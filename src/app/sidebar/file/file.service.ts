import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class FileService {

  constructor() { }

  getImage(input: HTMLInputElement): Observable<HTMLImageElement> {
    return Observable.create((observer: Observer<HTMLImageElement>) => {
      const img = new Image();
      img.onload = () => observer.next(img);
      img.onerror = err => observer.error(err);
      img.src = URL.createObjectURL(input.files[0]);
    });
  }

}
