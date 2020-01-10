import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

import { FilesObj } from '../interfaces/files-obj';
import { FileObj } from '../interfaces/file-obj';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private docsUrl = 'http://127.0.0.1:5000/documents/html';


  getFiles(): Observable<FilesObj> {
    return this.http.get<FilesObj>(this.docsUrl).pipe(
      retry(3), // retry a failed request up to 3 times      
      catchError(this.handleError) // then handle the error
    );
  }

  getFile() {
    console.log("get Data");
    return ("source text")
  }
  postData(file: FileObj) {
    console.log("submit Data: " + JSON.stringify(file));
  }

  modifyData(file: FileObj) {
    console.log("modify Data: " + JSON.stringify(file));
  }

  removeData(file: FileObj) {
    console.log("remove Data: " + JSON.stringify(file));
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, \nbody was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
  constructor(
    private http: HttpClient) { }



}
