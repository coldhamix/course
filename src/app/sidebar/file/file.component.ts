import { Component } from '@angular/core';
import { FileService } from './file.service';
import { CanvasService } from '../../canvas/canvas.service';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import { ElectronService } from '../../providers/electron.service';

@Component({
  selector: 'app-sidebar-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent {

  file: any;

  constructor(private fileService: FileService,
              private canvasService: CanvasService,
              private electronService: ElectronService) {
  }

  onFileChange(event: Event) {
    let img: HTMLImageElement;
    const input: HTMLInputElement = event.target as HTMLInputElement;

    this.fileService
      .getImage(input)
      .switchMap(image => this.canvasService.drawImage(img = image))
      .subscribe(() => {
        this.electronService.setTitle(input.files[0].name);
        this.canvasService.context.drawImage(img, 0, 0);
      });
  }

  save(): void {
    this.canvasService.saveToFile();
  }

}
