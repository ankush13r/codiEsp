import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment'
import { ApiResponseDocs } from '../models/docs/api-response-docs';
import { ClinicalCase } from '../models/docs/clinicalCase';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
}

@Injectable({
  providedIn: 'root'
})

export class DocsService {


  private ip: string = null;



  constructor(private http: HttpClient) { }



  getIp() {
    const url = 'http://api.ipify.org/?format=json';

    this.http.get<any>(url).subscribe(res => {
      if (res.ip) { this.ip = res.ip; }
    });
  }


  getTypes(): Observable<string[]> {
    var url =  `${environment.apiUrl}/docs/types`
    return this.http.get<string[]>(url);
  }

  getDocuments(selected_type: String, index: number = 0, pageSize: number = 10): Observable<ApiResponseDocs> {
    var url =`${environment.apiUrl}/docs/${selected_type}`;

    if (!index) {
      index = 0;
    }
    if (!pageSize) {
      pageSize = 10
    }
    let params = new HttpParams()
      .set("pageIndex", index.toString())
      .set("pageSize", pageSize.toString());


    return this.http.get<ApiResponseDocs>(url, { params: params }).pipe(
      map(data => new ApiResponseDocs().deserialize(data))
    );

  }


  addClinicalCase(document: any): Observable<ClinicalCase> {
    document.ip = this.ip;
    var url = `${environment.apiUrl}/docs/add`;

    return this.http.post<Document>(url, document).pipe(
      map(data => new ClinicalCase().deserialize(data))
    );
  }

  finishDocument(_id: string) {
    var url = `${environment.apiUrl}/docs/finish`;
    return this.http.put<any>(url, { "_id": _id });
  }

  getHPO() {
    var url = `${environment.apiUrl}/docs/hpo`;
    return this.http.get<any>(url);
  }
}

