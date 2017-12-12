import { AbstractEffect } from './effect';

export class InverseEffect extends AbstractEffect {

  process(input: ImageData): ImageData {
    const data = input.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }

    return input;
  }

}
