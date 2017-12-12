import { Injectable } from '@angular/core';
import { Tool } from '../../model/tool';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DrawingService {

  toolChangedSubject: Subject<Tool> = new Subject();
  toolChanged: Observable<Tool> = this.toolChangedSubject.asObservable();

  constructor() { }

}
