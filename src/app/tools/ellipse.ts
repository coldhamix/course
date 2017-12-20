import { AbstractTool } from './tool';
import { Tool } from '../model/tool';

export class Ellipse extends AbstractTool {

  protected startX: number;
  protected startY: number;

  protected originalImage: ImageData;

  constructor(protected canvas: HTMLCanvasElement,
              protected tool: Tool) {
    super(canvas, tool);
    this.originalImage = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
  }

  down(x: number, y: number): void {
    this.startX = x;
    this.startY = y;
    this.draw(x, y);
  }

  move(x: number, y: number): void {
    this.canvas.getContext('2d').putImageData(this.originalImage, 0, 0);
    this.draw(x, y);
  }

  up(x: number, y: number): void {
  }

  private draw(x: number, y: number): void {
    const context = this.canvas.getContext('2d');
    const radius = Math.hypot(x - this.startX, y - this.startY);
    context.lineWidth = this.tool.size;
    context.strokeStyle = this.tool.color;
    context.beginPath();
    context.ellipse(
      (this.startX + x) / 2,
      (this.startY + y) / 2,
      Math.abs((this.startX - x) / 2),
      Math.abs((this.startY - y) / 2),
      0, 0, 2 * Math.PI);
    context.stroke();
  }

}
