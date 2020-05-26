import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment'
import { User } from '../models/user/user';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
  }

  public get currentUserValue(): User {

    return Object.assign(new User(), this.currentUserSubject.value);
  }

  public get currentUser(): Observable<User> {
    return this.currentUserSubject.asObservable();
  }


  login(email: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, { email: email, password: password })
      .pipe(map(data => {
        // login successful if there's a jwt token in the response
        if (data[0] && data[1].user && data[1].tokens) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(data[1].user));
          localStorage.setItem('accessToken', JSON.stringify(data[1].tokens.accessToken));
          // data[1].tokens.accessToken
          localStorage.setItem('refreshToken', JSON.stringify(data[1].tokens.refreshToken));


          const user = Object.assign(new User(), data[1].user)
          this.currentUserSubject.next(user);
        }

        return data;
      }));
  }

  logout() {

    this.http.get<any>(`${environment.apiUrl}/auth/revoke_access_token`).subscribe(data => {});
    this.http.get<any>(`${environment.apiUrl}/auth/revoke_refresh_token`).subscribe(data => {});


    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    this.currentUserSubject.next(null);
  }

  getAccessToken() {
    return JSON.parse(localStorage.getItem('accessToken'))
  }

  setAccessToken(token: string) {
    localStorage.setItem('accessToken', JSON.stringify(token));
  }

  refreshAccessToken(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/refresh`, {})
  }
}