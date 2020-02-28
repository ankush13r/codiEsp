import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegexType } from '../models/regex-type';

@Injectable({
  providedIn: 'root'
})
export class ApiRegexService {
  private baseUrl = 'http://127.0.0.1:5000/';

  constructor(private http: HttpClient) { }


  getAll(){
  }

  getById(){

  }

  add(data:RegexType): Observable<RegexType>{
    const url = this.baseUrl + "regex/add";
    return this.http.post<any>(url, data);
  }

  modify(){

  }

  delete(){


  }

}
