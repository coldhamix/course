import { Tool } from '../model/tool';

export class AbstractTool {

  protected r: number;
  protected g: number;
  protected b: number;

  protected colorLayer: ImageData;

  constructor(protected canvas: HTMLCanvasElement,
              protected tool: Tool) {
  }

  down(x: number, y: number): void {
    throw new Error('Method AbstractTool.down is not implemented');
  }

  move(x: number, y: number): void {
    throw new Error('Method AbstractTool.move is not implemented');
  }

  up(x: number, y: number): void {
    throw new Error('Method AbstractTool.up is not implemented');
  }

  protected convertColor(color: string) {
    this.r = parseInt(color.substr(1, 2), 16);
    this.g = parseInt(color.substr(3, 2), 16);
    this.b = parseInt(color.substr(5, 2), 16);
  }

  protected setPixel(pixelPos: number, r: number, g: number, b: number) {
    this.colorLayer.data[pixelPos] = r;
    this.colorLayer.data[pixelPos + 1] = g;
    this.colorLayer.data[pixelPos + 2] = b;
    this.colorLayer.data[pixelPos + 3] = 255;
  }

  protected getPixel(x: number, y: number): number[] {
    const pos = (y * this.colorLayer.width + x) * 4;
    return [
      this.colorLayer.data[pos],
      this.colorLayer.data[pos + 1],
      this.colorLayer.data[pos + 2]
    ];
  }


}
