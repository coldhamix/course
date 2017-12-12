import { Injectable } from '@angular/core';
import { AbstractEffect } from './effect';

@Injectable()
export class FxService {

  constructor() { }

  applyEffect(ctx: CanvasRenderingContext2D, effect: AbstractEffect, width: number, height: number) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const afterEffect = effect.process(imageData);
    ctx.putImageData(imageData, 0, 0);
  }

}
