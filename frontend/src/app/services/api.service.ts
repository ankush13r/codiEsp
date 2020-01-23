import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

import { ApiSchema } from '../interfaces/apiSchema';
import { Document } from '../interfaces/document';

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

  getDocuments(selected_type: String, index: number = 0, pageSize: number = 10): Observable<ApiSchema> {
    var url = this.baseUrl + selected_type;

    if (!index) {
      index = 0;
    }
    if (!pageSize) {
      pageSize = 10
    }
    let params = new HttpParams()
      .set("pageIndex", index.toString())
      .set("pageSize", pageSize.toString());

    return this.http.get<ApiSchema>(url, { params: params }).pipe(
      retry(3), // retry a failed request up to 3 times      
      catchError(this.handleError) // then handle the error
    );
  }

 

  // addClinicalCase(file: Document){ //  Observable<Document> 
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

  addClinicalCase(document: Document, selected_type: String): Observable<Document> {
    document.meta_data = {
      location: "location",
      conationTime: 12345
    };
    var url = this.baseUrl + selected_type + "/add";
    return this.http.post<Document>(url, document)
  }


  modifyClinicalCase(file: Document) {
    console.log("modify Data: " + JSON.stringify(file));
  }

  removeClinicalCase(file: Document) {
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
