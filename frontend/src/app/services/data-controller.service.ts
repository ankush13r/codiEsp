import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataControllerService {
  // Create a new variable type BehaviorSubject to share selected file between two components.
  // BehaviorSubject serves for synchronize shared data
  private selectedFile = new BehaviorSubject<string>(null);
  private isFoundData = new BehaviorSubject<boolean>(null);
  private targetText = new BehaviorSubject<string>(null);

  constructor() { }

  getSelectedFile() {
    return (this.selectedFile.asObservable())
  }
  setSelectedFile(file: string) {
    this.selectedFile.next(file);
  }

  getIsFoundData() {
    return (this.isFoundData.asObservable())
  }
  setIsFoundData(parm: boolean) {
    this.isFoundData.next(parm);
  }

  setTargetText(text: string) {
    var valid;
    var resultText;
    
    this.targetText.asObservable().subscribe(result => {
      resultText = result;
      valid = (result == null || result != text)
    });
    if (valid)
      if (resultText == "" || !resultText)
        this.targetText.next(text);
      else {
        console.log("TODO: ask if user wants to do it.")
        this.targetText.next(text);

      }
    else {
      console.log("Same text as before");
    }
  }
  getTargetText() {
    return (this.targetText.asObservable())
  }
}
