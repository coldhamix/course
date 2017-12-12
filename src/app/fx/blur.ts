import { AbstractEffect } from './effect';

export const EFFECT_STRENGTH = 3;

export class BlurEffect extends AbstractEffect {

  process(input: ImageData): ImageData {

    const data = input.data;
    let sumRed = 0;
    let sumGreen = 0;
    let sumBlue = 0;
    let sumAlpha = 0;
    let total = 0;

    for (let effectStrength = 0; effectStrength < EFFECT_STRENGTH; effectStrength++) {
      for (let i = 0; i < data.length; i += 4) {
        const lineWidth = 4 * input.width;
        sumAlpha = sumRed = sumGreen = sumBlue = 0;
        total = 0;

        const surroundingPixels = [
          i - lineWidth - 4, i - lineWidth, i - lineWidth + 4,
          i - 4, i + 4,
          i + lineWidth - 4, i + lineWidth, i + lineWidth + 4
        ];

        for (let j = 0; j < surroundingPixels.length; j++) {
          if (surroundingPixels[j] >= 0 && surroundingPixels[j] <= data.length - 3) {
            sumAlpha += data[surroundingPixels[j]];
            sumRed += data[surroundingPixels[j] + 1];
            sumGreen += data[surroundingPixels[j] + 2];
            sumBlue += data[surroundingPixels[j] + 3];
            total++;
          }
        }

        data[i] = sumAlpha / total;
        data[i + 1] = sumRed / total;
        data[i + 2] = sumGreen / total;
        data[i + 3] = sumBlue / total;
      }
    }

    return input;
  }

}
