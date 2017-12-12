export class AbstractEffect {
  process(input: ImageData): ImageData {
    throw new Error('Not implemented');
  }

  setPixel(imageData: ImageData, x: number, y: number, r: number, g: number, b: number, a: number = 1) {
    const i = (x + y * imageData.width) * 4;
    imageData.data[i + 0] = r;
    imageData.data[i + 1] = g;
    imageData.data[i + 2] = b;
    imageData.data[i + 3] = a;
  }

}
