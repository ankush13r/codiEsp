import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FilesObj } from '../interfaces/files-obj';
import { FileObj } from '../interfaces/file-obj';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  data = {
    totalRecords: 200,
    currentPage: 2,
    files: [
      {
        name: "file1",
        type: "pdf",
        path: "./path/file1",
        error:{message:"Failed to open the file1"}
      },
      {
        name: "file2",
        type: "pdf",
        path: "./path/file2",
        source: "File2 data"
      }, 
      {
        name: "file3",
        type: "pdf",
        path: "./path/file3",
        source: "File3 data"
      }, 
      {
        name: "file4",
        type: "pdf",
        path: "./path/file4",
        source: "File4 data"
      },
      {
        name: "file5",
        type: "pdf",
        path: "./path/file5",
        source: "File5 data"
      },
      {
        name: "file6",
        type: "pdf",
        path: "./path/file6",
        source: "File6 data"
      },
      {
        name: "file7",
        type: "pdf",
        path: "./path/file7",
        error: {message:"File7 couldn't find"}
      }
    ]
  }



  constructor() { }

  getFiles(): Observable<FilesObj> {
    return of(this.data);
  }



  getFile() {
    console.log("get Data");
    return ("source text")
  }
  postData(file:FileObj) {
    console.log("submit Data: "+ JSON.stringify(file));
  }

  modifyData(file:FileObj) {
    console.log("modify Data: " + JSON.stringify(file));
  }

  removeData(file:FileObj) {
    console.log("remove Data: "+ JSON.stringify(file));
  }

}
