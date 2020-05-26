import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment'
import { map } from 'rxjs/operators';
import { ApiResponseDocs } from '../models/docs/api-response-docs';
import { ClinicalCase } from '../models/docs/clinicalCase';
import { Version } from '../models/docs/version';


@Injectable({
  providedIn: 'root'
})
export class ClinicalDataService {

  constructor(private http: HttpClient) { }

  getClinicalCases(index: number = 0, pageSize: number = 10): Observable<ApiResponseDocs> {
    const tmpUrl = `${environment.apiUrl}/clinical_cases`;

    if (!index) {
      index = 0;
    }
    if (!pageSize) {
      pageSize = 10
    }
    let params = new HttpParams()
      .set("pageIndex", index.toString())
      .set("pageSize", pageSize.toString());


    return this.http.get<ApiResponseDocs>(tmpUrl, { params: params }).pipe(
      map(data => {
        if (data) {
          return new ApiResponseDocs().deserialize(data)
        }
      })
    );
  }

  modifySelectedVersionId(case_id, versionId: number) {
    const tmpUrl = `${environment.apiUrl}/clinical_cases/${case_id}/selected_version`;
    return this.http.patch<any>(tmpUrl,
      {
        selectedVersionId: versionId
      });

  }

  modifyCaseVersion(case_id, version: Version): Observable<any> {
    const tmpUrl = `${environment.apiUrl}/clinical_cases/${case_id}/versions/${version.$id}`;
    return this.http.patch<any>(tmpUrl,
      {
        clinicalCase: version.$clinicalCase,
        hpoCodes: version.$hpoCodes
      });
  }

  deleteVersion(case_id: string, version_id: number): Observable<any> {

    const tmpUrl = `${environment.apiUrl}/clinical_cases/${case_id}/versions/${version_id}`;
    return this.http.delete<any>(tmpUrl);

  }


  deleteCase(case_id: string) {
    const tmpUrl = `${environment.apiUrl}/clinical_cases/${case_id}`;
    return this.http.delete<ClinicalCase>(tmpUrl);

  }
}
