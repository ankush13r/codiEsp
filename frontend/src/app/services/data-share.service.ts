import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { Observable, BehaviorSubject, of } from 'rxjs';
import { Document } from '../models/docs/document';


@Injectable({
  providedIn: 'root'
})
export class DataShareService {
  // Create a new variable type BehaviorSubject to share selected file between two components.
  // BehaviorSubject serves for synchronize shared data
  private selectedDocument = new BehaviorSubject<Document>(null);
  private docType = new BehaviorSubject<string>(null);
  private auxText = new BehaviorSubject<string>(null);
  private preview = new BehaviorSubject<boolean>(null);


  private currentLat;
  private currentLong;


  constructor() {
  }



  observeDocumentType() {
    return (this.docType.asObservable())
  }
  selectDocumentType(type: string) {
    this.docType.next(type);
  }

  previewTarget(bool:boolean){
    this.preview.next(bool);
  }

  observePreviewTarget() {
    return (this.preview.asObservable())
  }

  observeAuxText() {
    return (this.auxText.asObservable())
  }
  changeAuxText(text: string) {
    this.auxText.next(text);
  }




}