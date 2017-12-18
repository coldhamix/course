import { AbstractTool } from './tool';
import { Tool } from '../model/tool';

export class Bucket extends AbstractTool {

  private startR: number;
  private startG: number;
  private startB: number;

  constructor(protected canvas: HTMLCanvasElement,
              protected tool: Tool) {
    super(canvas, tool);
    this.colorLayer = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    this.convertColor(tool.color);
  }

  move() {
    // no-op
  }

  down() {
    // no-op
  }

  up(startX: number, startY: number) {
    const pos = (startY * this.canvas.width + startX) * 4;
    this.startR = this.colorLayer.data[pos];
    this.startG = this.colorLayer.data[pos + 1];
    this.startB = this.colorLayer.data[pos + 2];


    if (this.startR === this.r && this.startG === this.g && this.startB === this.b) {
      return;
    }

    const pixelStack = [[startX, startY]];
    while (pixelStack.length) {

      const newPos = pixelStack.pop();
      const x = newPos[0];
      let y = newPos[1];

      let pixelPos = (y * this.canvas.width + x) * 4;
      while (y-- >= 0 && this.matchStartColor(pixelPos)) {
        pixelPos -= this.canvas.width * 4;
      }
      pixelPos += this.canvas.width * 4;
      ++y;
      let reachLeft = false;
      let reachRight = false;
      while (y++ < this.canvas.height - 1 && this.matchStartColor(pixelPos)) {
        this.setPixel(pixelPos, this.r, this.g, this.b);

        if (x > 0) {
          if (this.matchStartColor(pixelPos - 4)) {
            if (!reachLeft) {
              pixelStack.push([x - 1, y]);
              reachLeft = true;
            }
          } else if (reachLeft) {
            reachLeft = false;
          }
        }

        if (x < this.canvas.width - 1) {
          if (this.matchStartColor(pixelPos + 4)) {
            if (!reachRight) {
              pixelStack.push([x + 1, y]);
              reachRight = true;
            }
          } else if (reachRight) {
            reachRight = false;
          }
        }

        pixelPos += this.canvas.width * 4;
      }
    }

    this.canvas.getContext('2d').putImageData(this.colorLayer, 0, 0);

  }

  private matchStartColor(pixelPos) {
    const r = this.colorLayer.data[pixelPos];
    const g = this.colorLayer.data[pixelPos + 1];
    const b = this.colorLayer.data[pixelPos + 2];
    return (r === this.startR && g === this.startG && b === this.startB);
  }

}
