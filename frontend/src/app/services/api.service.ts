import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  data: Object = {
    file1: { data: "data1 ", message: "message1" },
    file2: { data: "data2 ", message: "message2" },
    file3: { data: "data3 ", message: "message3" },
    file4: { data: "data4 ", message: "message4" },
    file5: { data: false, message: "error5" },
    file6: { data: "data6 ", message: "message6" },
    file7: { data: "data7 ", message: "message7" },
    file8: { data: "data8 ", message: "message8" },
    file9: { data: "data9 ", message: "message9" },
    file10: { data: "data10 ", message: "message10" },
    file11: { data: false, message: "error11" },
  };


  files: string[] = [
    "file1", "file2","file3",
    "file4", "file5","file6",
    "file7", "file8","file9",
    "file10", "file11"
  ];
  
    constructor() { }

  getFiles(): Observable<string[]> {
    return of(this.files);
  }


  getDataByFile(file:string) :Observable<Object>{
    return (this.data[file])
  }


  getData() {
    console.log("get Data");
    return ("source text")
  }
  setData() {
    console.log("submit Data");
  }

  modifyData() {
    console.log("modify Data");
  }

  removeData() {
    console.log("remove Data");
  }

}
