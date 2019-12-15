import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FilesService {

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
}
