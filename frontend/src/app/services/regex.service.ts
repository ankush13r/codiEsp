import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegexObj } from '../models/regex/regex-obj';

import { environment } from '../../environments/environment'
import url from 'url';

@Injectable({
  providedIn: 'root'
})
export class RegexService {
  url = url.resolve(environment.apiUrl, '/regex')

  constructor(private http: HttpClient) {

  }


  getAll(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  getById() {

  }

  add(data: RegexObj): Observable<any> {
    return this.http.post<any>(this.url, data);
  }

  modify(data: RegexObj): Observable<any> {
    return this.http.put<any>(this.url, data);
  }

  /*
  .pipe(
      //map  to convert normal list to regexType list. 
      //First map let whole data received by http and second map creates loop and instance a new of each object.
      map(data => {
        if (data && !data.error) {
          return new ApiResponseRegex().deserialize(data)
        }
      }
      ));
  */
  delete(id: string): Observable<any> {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        _id: id
      }
    }

    return this.http.delete<any>(this.url, options);
  }
}
