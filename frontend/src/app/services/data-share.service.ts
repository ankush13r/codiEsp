import { Injectable } from '@angular/core';
import {PageEvent} from '@angular/material/paginator';

import { Observable, BehaviorSubject, of } from 'rxjs';
import { FileObj } from '../interfaces/file-obj';


@Injectable({
  providedIn: 'root'
})
export class DataShareService {
  // Create a new variable type BehaviorSubject to share selected file between two components.
  // BehaviorSubject serves for synchronize shared data
  private selectedFile = new BehaviorSubject<FileObj>(null);
  private paginationPageEvent = new BehaviorSubject<PageEvent>(null);

  constructor() { }

  getSelectedFile() {
    return (this.selectedFile.asObservable())
  }
  setSelectedFile(file: FileObj) {
    this.selectedFile.next(file);
  }

  getPaginationEvent() {
    return (this.paginationPageEvent.asObservable())
  }

  setPaginationEvent(event: PageEvent) {
    this.paginationPageEvent.next(event);
  }

}
