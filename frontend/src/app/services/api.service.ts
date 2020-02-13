import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';


import { ApiResponse } from '../modules/apiResponse';
import { ClinicalCase } from '../modules/clinicalCase';


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


  getTypes(): Observable<string[]> {
    var url = this.baseUrl + "types"
    return this.http.get<string[]>(url).pipe(
      retry(3), // retry a failed request up to 3 times      
      catchError(this.handleError), // then handle the error
    );
  }

  getDocuments(selected_type: String, index: number = 0, pageSize: number = 10): Observable<ApiResponse> {
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


    return this.http.get<ApiResponse>(url, { params: params }).pipe(
      retry(3), // retry a failed request up to 3 times      
      catchError(this.handleError), // then handle the error
      map(data => new ApiResponse().deserialize(data))
    );

  }


  addClinicalCase(document: any): Observable<ClinicalCase> {
    document.location = "location";

    var url = this.baseUrl + "add";
    return this.http.post<Document>(url, document).pipe(
      catchError(this.handleError),
      map(data => new ClinicalCase().deserialize(data))
    );
  }

  finishDocument(_id: string) {
    var url = this.baseUrl + "finish";
    return this.http.put<any>(url, { "_id": _id }).pipe(
      catchError(this.handleError)
    )
  }

  getHPO() {
    var url = this.baseUrl + "hpo";
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    )
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

// createNewCase(id: string) {
  //   var url = this.baseUrl + "new_case";
  //   return this.http.post<Document>(url, { _id: id });
  // }
