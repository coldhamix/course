export class Bucket {

  private colorLayer: ImageData
  private startR: number;
  private startG: number;
  private startB: number;

  private r: number;
  private g: number;
  private b: number;

  constructor(private startX: number,
              private startY: number,
              private color: string,
              private canvas: HTMLCanvasElement) {
    this.colorLayer = canvas.getContext('2d')
      .getImageData(0, 0, canvas.width, canvas.height);

    this.convertColor(color);

    const pos = (startY * canvas.width + startX) * 4;
    this.startR = this.colorLayer.data[pos];
    this.startG = this.colorLayer.data[pos + 1];
    this.startB = this.colorLayer.data[pos + 2];
  }

  apply() {

    if (this.startR === this.r && this.startG === this.g && this.startB === this.b) {
      return;
    }

    const pixelStack = [[this.startX, this.startY]];
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
        this.colorPixel(pixelPos, this.r, this.g, this.b);

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

  private colorPixel(pixelPos, r, g, b) {
    this.colorLayer.data[pixelPos] = r;
    this.colorLayer.data[pixelPos + 1] = g;
    this.colorLayer.data[pixelPos + 2] = b;
    this.colorLayer.data[pixelPos + 3] = 255;
  }

  private convertColor(color: string) {
    this.r = parseInt(color.substr(1, 2), 16);
    this.g = parseInt(color.substr(3, 2), 16);
    this.b = parseInt(color.substr(5, 2), 16);
  }


}
