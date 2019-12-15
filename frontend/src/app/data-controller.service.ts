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




  constructor() { }


  setSelectedFile(file: string){
    this.selectedFile.next(file);
  }

  getSelectedFile() {
    return (this.selectedFile.asObservable())
  } 

  setIsFoundData(parm:boolean){
    this.isFoundData.next(parm);
  }
  getIsFoundData(){
    return (this.isFoundData.asObservable())
  }
}
