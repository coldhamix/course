import { Injectable } from '@angular/core';

import { clipboard, dialog, ipcRenderer, nativeImage } from 'electron';
import * as fs from 'fs';
import * as childProcess from 'child_process';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { canvasBuffer, ImageType } from '../helper/canvas-to-image';

@Injectable()
export class ElectronService {

  nativeImage: typeof nativeImage;
  ipcRenderer: typeof ipcRenderer;
  childProcess: typeof childProcess;
  dialog: typeof dialog;
  fs: typeof fs;
  clipboard: typeof clipboard;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.nativeImage = require('electron').nativeImage;
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.dialog = window.require('electron').remote.dialog;
      this.clipboard = window.require('electron').remote.clipboard;
      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
    }
  }

  getImageSavePath(): Observable<string> {
    return Observable.create((observer: Observer<string>) => {
      this.dialog.showSaveDialog({
        filters: [
          {
            name: 'PNG',
            extensions: ['png']
          },
          {
            name: 'JPEG',
            extensions: ['jpg', 'jpeg']
          }
        ]
      }, fileName => {
        observer.next(fileName);
        observer.complete();
      });
    });
  }

  saveImage(canvas: HTMLCanvasElement): void {
    this.getImageSavePath().subscribe(filename => {
      if (filename) {
        const buffer = canvasBuffer(this.nativeImage, canvas, this.detectImageType(filename));
        fs.writeFileSync(filename, buffer);
        this.setTitle(filename);
      }
    })
  }

  setTitle(title: string) {
    document.title = `Графический редактор - ${title}`;
  }

  getImageFromClipboard() {
    return this.clipboard.readImage();
  }

  private detectImageType(filename: string): ImageType {
    if (filename.endsWith('.png')) {
      return 'image/png';
    } else {
      return 'image/jpg';
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

}
