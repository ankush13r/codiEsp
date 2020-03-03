import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegexType } from '../models/regex-type';

import { environment } from '../../environments/environment'
import url from 'url';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiRegexService {
  apiUrl = new URL(environment.apiUrl)

  constructor(private http: HttpClient) { }


  getAll(): Observable<RegexType[]> {
    const tmpUrl = url.resolve(environment.apiUrl, '/regex');
    
    return this.http.get<any>(tmpUrl).pipe(
      //map  to convert normal list to regexType list. 
      //First map let whole data received by http and second map creates loop and instance a new of each object. 
      map(dataList => dataList.map(obj => Object.assign(new RegexType, obj)))
    );
  }

  getById() {

  }

  add(data: RegexType): Observable<RegexType> {
    const tmpUrl = url.resolve(environment.apiUrl, '/regex/add');
    return this.http.post<any>(tmpUrl, data);
  }

  modify() {

  }

  delete() {


  }

}
