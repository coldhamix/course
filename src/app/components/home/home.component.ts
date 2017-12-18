import { AfterViewInit, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { CanvasService } from '../../canvas/canvas.service';
import { CanvasSize } from '../../model/canvas-size';
import { DrawingService } from '../../sidebar/drawing/drawing.service';
import { Tool } from '../../model/tool';
import { AbstractTool } from '../../tools/tool';
import { toolFactory } from 'app/tools/tool-factory';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('container') container: ElementRef;
  @ViewChild('placeholder') placeholder: ElementRef;

  @ViewChild('leftTop') leftTopHandle: ElementRef;
  @ViewChild('rightTop') rightTopHandle: ElementRef;
  @ViewChild('leftBottom') leftBottomHandle: ElementRef;
  @ViewChild('rightBottom') rightBottomHandle: ElementRef;

  canvasWidth: number;
  canvasHeight: number;

  placeholderTop: number;
  placeholderLeft: number;
  placeholderWidth: number;
  placeholderHeight: number;

  dragging: boolean;
  drawing: boolean;

  private tool: Tool;
  private toolInstance: AbstractTool;
  private dragElement: EventTarget;

  private x: number;
  private y: number;

  constructor(private canvasService: CanvasService,
              private drawingService: DrawingService,
              private zone: NgZone) {
    this.canvasService.canvasChanged.subscribe(size => zone.run(() => this.resizeCanvasInternal(size)));
    this.drawingService.toolChanged.subscribe(tool => this.onToolChanged(tool));
    this.updateCanvasSize(0, 0, 400, 400);
  }

  ngAfterViewInit() {
    const element: HTMLCanvasElement = this.canvas.nativeElement;
    this.canvasService.initCanvas(element);
    this.positionPlaceholder();
    this.positionHandles();
  }

  onMouseMove(event: MouseEvent) {
    if (this.dragging) {
      this.resizePlaceholder(event.pageX, event.pageY);
      this.positionHandles();
    }
  }

  onMouseUp() {
    this.dragging = false;
    this.dragElement = null;
    this.resizeStopped();
  }

  onMouseOut(event: MouseEvent) {
    if (event.fromElement === this.container.nativeElement) {
      if (!event.fromElement.contains(event.toElement)) {
        this.dragging = false;
        this.dragElement = null;
        this.resizeStopped();
      }
    }
  }

  onMouseDown(event: Event) {
    this.dragging = true;
    this.dragElement = event.target;
  }

  startDrawing(event: MouseEvent): void {
    this.drawing = true;

    const context = this.canvas.nativeElement.getContext('2d');
    const rect = this.canvas.nativeElement.getBoundingClientRect();

    this.x = event.pageX - rect.left;
    this.y = event.pageY - rect.top;

    this.toolInstance = toolFactory(this.canvas.nativeElement, this.tool);
    this.toolInstance.down(this.x, this.y);

  }

  stopDrawing(event: MouseEvent): void {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    this.x = event.pageX - rect.left;
    this.y = event.pageY - rect.top;

    if (this.toolInstance) {
      this.toolInstance.up(this.x, this.y);
      this.toolInstance = null;
    } else {
      this.onDraw(event);
    }

    this.drawing = false;
  }

  onDraw(event: MouseEvent): void {
    if (this.drawing) {
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      const context = this.canvas.nativeElement.getContext('2d');
      this.x = event.pageX - rect.left;
      this.y = event.pageY - rect.top;
      this.toolInstance.move(this.x, this.y);
    }
  }

  onCanvasLeft(event: MouseEvent): void {
    this.stopDrawing(event);
  }

  private onToolChanged(tool: Tool): void {
    this.tool = tool;
  }

  private resizeCanvasInternal(size: CanvasSize) {
    if (this.canvasWidth !== size.width || this.canvasHeight !== size.height) {
      const imageData = this.canvasService.save(size.left, size.top);
      this.canvasWidth = size.width;
      this.canvasHeight = size.height;
      this.canvasService.restore(imageData);
      this.positionPlaceholder();
      setTimeout(() => this.canvasService.canvasReadySubject.next());
    }
    this.canvasService.canvasReady
      .first()
      .subscribe(() => this.positionHandles())
  }

  private resizePlaceholder(dragX: number, dragY: number): void {
    const placeholder = this.placeholder.nativeElement;
    const canvas = this.canvas.nativeElement;
    const rect = placeholder.getBoundingClientRect();

    let newTop = canvas.offsetTop;
    let newLeft = canvas.offsetLeft;
    let newWidth = dragX - rect.left;
    let newHeight = dragY - rect.top;

    if (this.dragElement === this.rightBottomHandle.nativeElement) {
      newWidth = newWidth > 0 ? newWidth : 1;
      newHeight = newHeight > 0 ? newHeight : 1;
    } else if (this.dragElement === this.leftBottomHandle.nativeElement) {
      newLeft = dragX - rect.left + placeholder.offsetLeft;
      newWidth = placeholder.width - newLeft + canvas.offsetLeft;
      newHeight = newHeight > 0 ? newHeight : 1;
    } else if (this.dragElement === this.rightTopHandle.nativeElement) {
      newTop = dragY - rect.top + placeholder.offsetTop;
      newWidth = newWidth > 0 ? newWidth : 1;
      newHeight = placeholder.height - newTop + canvas.offsetTop;
    } else if (this.dragElement === this.leftTopHandle.nativeElement) {
      newLeft = dragX - rect.left + placeholder.offsetLeft;
      newTop = dragY - rect.top + placeholder.offsetTop;
      newWidth = placeholder.width - newLeft + canvas.offsetLeft;
      newHeight = placeholder.height - newTop + canvas.offsetTop;
    }
    this.updatePlaceholderSize(newTop, newLeft, newWidth, newHeight);
  }

  private resizeStopped(): void {
    this.updatePlaceholderSize(this.placeholderTop, this.placeholderLeft, this.placeholderWidth, this.placeholderHeight);
    this.updateCanvasSize(this.placeholderTop, this.placeholderLeft, this.placeholderWidth, this.placeholderHeight);
    this.positionHandles();
  }

  private updatePlaceholderSize(top: number, left: number, width: number, height: number): void {
    this.placeholderTop = top;
    this.placeholderLeft = left;
    this.placeholderWidth = width;
    this.placeholderHeight = height;
  }

  private updateCanvasSize(top: number, left: number, width: number, height: number): void {

    let canvasTop = top;
    let canvasLeft = left;

    if (this.canvas) {
      const canvas = this.canvas.nativeElement;
      canvasTop -= canvas.offsetTop;
      canvasLeft -= canvas.offsetLeft;
    }

    this.canvasService.canvasChangedSubject.next({
      top: canvasTop,
      left: canvasLeft,
      width,
      height
    });
    this.updatePlaceholderSize(top, left, width, height);
  }

  private positionPlaceholder(): void {
    if (this.placeholder) {
      const placeholder = this.placeholder.nativeElement;
      const rectTop = this.canvas.nativeElement.offsetTop;
      const rectLeft = this.canvas.nativeElement.offsetLeft;

      placeholder.style.top = `${rectTop}px`;
      placeholder.style.left = `${rectLeft}px`;
      this.placeholderWidth = placeholder.width = this.canvasWidth;
      this.placeholderHeight = placeholder.height = this.canvasHeight;
    }
  }

  private positionHandles(): void {
    if (this.placeholder) {
      const element: HTMLCanvasElement = this.placeholder.nativeElement;
      const rect = this.getRelativePosition(element);

      const leftTop = this.leftTopHandle.nativeElement;
      leftTop.style.top = `${rect.top - 6}px`;
      leftTop.style.left = `${rect.left - 6}px`;

      const rightTop = this.rightTopHandle.nativeElement;
      rightTop.style.top = `${rect.top - 6}px`;
      rightTop.style.left = `${rect.left + rect.width}px`;

      const leftBottom = this.leftBottomHandle.nativeElement;
      leftBottom.style.top = `${rect.top + rect.height}px`;
      leftBottom.style.left = `${rect.left - 6}px`;

      const rightBottom = this.rightBottomHandle.nativeElement;
      rightBottom.style.top = `${rect.top + rect.height}px`;
      rightBottom.style.left = `${rect.left + rect.width}px`;

    }
  }

  private getRelativePosition(el: HTMLElement): ClientRect {
    const elRect = el.getBoundingClientRect();

    return {
      top: el.offsetTop,
      left: el.offsetLeft,
      width: elRect.width,
      height: elRect.height
    } as ClientRect;

  }

}
