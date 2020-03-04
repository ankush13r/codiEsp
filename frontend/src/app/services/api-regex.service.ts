import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegexObj } from '../models/regex/regex-obj';

import { environment } from '../../environments/environment'
import url from 'url';
import { map } from 'rxjs/operators';
import { ApiResponseRegex } from '../models/regex/api-response-regex';

@Injectable({
  providedIn: 'root'
})
export class ApiRegexService {
  apiUrl = new URL(environment.apiUrl)

  constructor(private http: HttpClient) {

  }


  getAll(): Observable<ApiResponseRegex> {
    const tmpUrl = url.resolve(environment.apiUrl, '/regex');

    return this.http.get<any>(tmpUrl).pipe(
      //map  to convert normal list to regexType list. 
      //First map let whole data received by http and second map creates loop and instance a new of each object. 
      map(data => (new ApiResponseRegex().deserialize(data))
      )
    );
  }

  getById() {

  }

  add(data: RegexObj): Observable<RegexObj> {
    const tmpUrl = url.resolve(environment.apiUrl, '/regex/add');
    return this.http.post<any>(tmpUrl, data).pipe(
      //map  to convert normal list to regexType list. 
      //First map let whole data received by http and second map creates loop and instance a new of each object. 
      map(data => Object.assign(new RegexObj, data))
    );;
  }

  modify() {

  }

  delete() {


  }

}
