import { AbstractEffect } from './effect';

const CHUNK_SIZE = 4;

export class BlackWhiteEffect extends AbstractEffect {

  process(input: ImageData): ImageData {
    const data = input.data;

    for (let i = 0; i < data.length; i += 4) {
      const grey = data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722;
      data[i] = grey;
      data[i + 1] = grey;
      data[i + 2] = grey;
    }

    return input;
  }
}
