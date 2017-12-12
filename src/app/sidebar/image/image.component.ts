import { Component, OnInit } from '@angular/core';
import { CanvasSize } from '../../model/canvas-size';
import { CanvasService } from '../../canvas/canvas.service';
import { ElectronService } from '../../providers/electron.service';

@Component({
  selector: 'app-sidebar-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent {

  imageWidth: number;
  imageHeight: number;

  constructor(private canvasService: CanvasService,
              private electronService: ElectronService) {
    canvasService.canvasChanged.subscribe(size => this.onCanvasSizeChanged(size));
    this.onCanvasSizeChanged(canvasService.size);
  }

  clearImage(): void {
    this.canvasService.clear();
  }

  fromClipboard(): void {
    const image = this.electronService.getImageFromClipboard();
    this.canvasService.openNativeImage(image);
  }

  private onCanvasSizeChanged(size: CanvasSize) {
    if (size) {
      this.imageWidth = size.width;
      this.imageHeight = size.height;
    }
  }

}
