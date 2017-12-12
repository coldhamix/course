import { Component } from '@angular/core';
import { FxService } from '../../fx/fx.service';
import { AbstractEffect } from '../../fx/effect';
import { CanvasService } from '../../canvas/canvas.service';
import { InverseEffect } from '../../fx/inverse';
import { BlackWhiteEffect } from '../../fx/black-white';
import { BlurEffect } from '../../fx/blur';

@Component({
  selector: 'app-sidebar-fx',
  templateUrl: './fx.component.html',
  styleUrls: ['./fx.component.scss']
})
export class FxComponent {

  constructor(
    private canvasService: CanvasService,
    private fxService: FxService) {
  }

  inverse(): void {
    this.applyEffect(new InverseEffect());
  }

  blackWhite(): void {
    this.applyEffect(new BlackWhiteEffect());

  }

  blur(): void {
    this.applyEffect(new BlurEffect());
  }

  private applyEffect(effect: AbstractEffect) {
    this.fxService.applyEffect(
      this.canvasService.context,
      effect,
      this.canvasService.size.width,
      this.canvasService.size.height
    );
  }

}
