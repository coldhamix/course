import { AbstractTool } from './tool';

export class Eraser extends AbstractTool {

  down(x: number, y: number): void {
    const context = this.canvas.getContext('2d');
    context.beginPath();
    context.moveTo(x, y);
  }

  move(x: number, y: number): void {
    const context = this.canvas.getContext('2d');
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.lineWidth = this.tool.size * 2;
    context.strokeStyle = 'white';
    context.lineTo(x, y);
    context.stroke();
  }

  up(x: number, y: number): void {
    // no-op
  }
}
