import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DrawingService } from './drawing.service';
import { DEFAULT_TOOL, Tool, ToolType } from '../../model/tool';

@Component({
  selector: 'app-sidebar-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.scss']
})
export class DrawingComponent {

  currentColor: string;
  currentSize: number;
  currentTool: ToolType;

  sizeSelectorOpen = false;

  @ViewChild('sizeSelector') sizeSelector: ElementRef;

  constructor(private drawingService: DrawingService) {
    drawingService.toolChanged.subscribe(tool => this.onToolChanged(tool));
    drawingService.toolChangedSubject.next(DEFAULT_TOOL);
  }

  get pencilSelected(): boolean {
    return this.currentTool === 'pencil';
  }

  get eraserSelected(): boolean {
    return this.currentTool === 'eraser';
  }

  get bucketSelected(): boolean {
    return this.currentTool === 'bucket';
  }

  selectEraser(): void {
    this.drawingService.toolChangedSubject.next({
      type: 'eraser',
      size: this.currentSize,
      color: this.currentColor
    });
  }

  selectPencil(): void {
    this.drawingService.toolChangedSubject.next({
      type: 'pencil',
      size: this.currentSize,
      color: this.currentColor
    });
  }

  selectBucket(): void {
    this.drawingService.toolChangedSubject.next({
      type: 'bucket',
      size: this.currentSize,
      color: this.currentColor
    });
  }

  colorChanged(color: string) {
    this.drawingService.toolChangedSubject.next({
      type: this.currentTool,
      size: this.currentSize,
      color
    });
  }

  toggleSizeSelector(): void {
    this.sizeSelectorOpen = !this.sizeSelectorOpen;
  }

  selectSize(size: number): void {
    this.sizeSelectorOpen = false;
    this.drawingService.toolChangedSubject.next({
      type: this.currentTool,
      color: this.currentColor,
      size
    });
  }

  private onToolChanged(tool: Tool) {
    if (tool && tool.type) {
      this.currentTool = tool.type;
      this.currentSize = tool.size;
      this.currentColor = tool.color;
    } else {
      this.currentTool = null;
      this.currentSize = 1;
      this.currentColor = 'white';
    }
  }

}
