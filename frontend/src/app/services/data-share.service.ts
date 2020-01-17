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
  private totalRecords = new BehaviorSubject<FileObj>(null);
  private docType = new BehaviorSubject<String>(null);


  constructor() { }

  getSelectedFile() {
    return (this.selectedFile.asObservable())
  }
  setSelectedFile(file: FileObj) {
    this.selectedFile.next(file);
  }
  
  getDocType() {
    return (this.docType.asObservable())
  }
  setDocType(type: String) {
    this.docType.next(type);
  }



}
