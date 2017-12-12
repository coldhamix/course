import { Injectable, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CanvasSize } from '../model/canvas-size';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/do';
import { ElectronService } from '../providers/electron.service';

export const BACKGROUND_COLOR = 'white';

@Injectable()
export class CanvasService {

  canvasChangedSubject: Subject<CanvasSize> = new Subject();
  canvasChanged: Observable<CanvasSize> = this.canvasChangedSubject.asObservable();

  canvasReadySubject: Subject<void> = new Subject();
  canvasReady: Observable<void> = this.canvasReadySubject.asObservable();

  private canvas: HTMLCanvasElement;
  private canvasSize: CanvasSize;

  constructor (private electronService: ElectronService) {
    this.canvasChanged.subscribe(size => this.canvasSize = size);
  }

  get size(): CanvasSize {
    return { ...this.canvasSize };
  }

  get context(): CanvasRenderingContext2D {
    return this.canvas.getContext('2d');
  }

  initCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.clear();
  }

  save(x: number = 0, y: number = 0): ImageData {
    if (this.canvas) {
      return this.canvas.getContext('2d')
        .getImageData(x, y, this.canvas.width, this.canvas.height);
    }
    return null;
  }

  restore(data: ImageData) {
    if (data) {
      setTimeout(() => this.restoreResizedCanvas(data));
    }
  }

  openNativeImage(image) {
    const height = image.getSize().height;
    const width = image.getSize().width;

    if (width && height) {
      const data = image.toBitmap();
      const imageData = new ImageData(width, height);

      for (let i = 0; i < data.length; i++) {
        imageData.data[i] = data[i];
      }

      this.canvasChangedSubject.next({top: 0, left: 0, width, height});
      this.canvasReady.first().subscribe(() => this.context.putImageData(imageData, 0, 0));
    }
  }

  clear(): void {
    this.context.fillStyle = BACKGROUND_COLOR;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawImage(image: HTMLImageElement): Observable<void> {
    this.canvasChangedSubject.next({ top: 0, left: 0, width: image.width, height: image.height });
    return this.canvasReady.first();
  }

  saveToFile(): void {
    this.electronService.saveImage(this.canvas);
  }

  private restoreResizedCanvas(data: ImageData): void {
    this.clear();
    this.context.putImageData(data, 0, 0)
  }

}
