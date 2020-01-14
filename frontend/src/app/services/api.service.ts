import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

import { FilesObj } from '../interfaces/files-obj';
import { FileObj } from '../interfaces/file-obj';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
}

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private baseUrl = 'http://127.0.0.1:5000/documents/';

  constructor(private http: HttpClient) {

  }

  getDocuments(selected_type: string, index: string = "0", pageSize: string = "10"): Observable<FilesObj> {
    var url = this.baseUrl + selected_type;

    let params = new HttpParams()
      .set("pageIndex", index)
      .set("pageSize", pageSize);

    return this.http.get<FilesObj>(url, { params: params }).pipe(
      retry(3), // retry a failed request up to 3 times      
      catchError(this.handleError) // then handle the error
    );
  }

  getFile() {
    console.log("get Data");
    return ("source text")
  }

  // addClinicalCase(file: FileObj){ //  Observable<FileObj> 
  //   var url = 'http://127.0.0.1:5000/documents/html/add';
  //   console.log(file);
  //   console.log("to post");

  //   var tmpVar =  this.http.post(url, file);
  //     // .pipe(
  //     //   retry(2),
  //     //   catchError(this.handleError)
  //     // );

  //     console.log(tmpVar);

  //     // return tmpVar;

  // }

  addClinicalCase(file: FileObj): Observable<FileObj> {
    return this.http.post<FileObj>('http://127.0.0.1:5000/documents/html/add', file)
  }


  modifyClinicalCase(file: FileObj) {
    console.log("modify Data: " + JSON.stringify(file));
  }

  removeClinicalCase(file: FileObj) {
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




}
