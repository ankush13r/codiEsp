import { Injectable } from '@angular/core';

import { HttpResponse, HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpClient } from '@angular/common/http'
import { Observable, Subject, pipe, BehaviorSubject, throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { environment } from '../../environments/environment'
import { catchError, switchMap, take, filter } from 'rxjs/operators';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private auth: AuthenticationService) { }
  private refreshTokenInProgress: boolean = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      catchError(error => {

        // We don't want to refresh token for some requests like login or refresh token itself
        // So we verify url and we throw an error if it's the case
        if (
          request.url.includes("refresh") ||
          request.url.includes("login") ||
          request.url.includes("revoke_access_token")||
          request.url.includes("revoke_refresh_token")


        ) {
          // We do another check to see if refresh token failed
          // In this case we want to logout user and to redirect it to login page

          if (request.url.includes("refresh")) {
            this.auth.logout();

          }
          if (!request.url.includes("logout")) {
            return throwError(error);
          }

        }

        // If error status is different than 401 we want to skip refresh token
        // So we check that and throw the error if it's the case
        if (error.status !== 401) {
          return throwError(error);
        }

        if (this.refreshTokenInProgress) {
          // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
          // – which means the new token is ready and we can retry the request again
          return this.refreshTokenSubject.pipe(
            filter(result => result !== null),
            take(1),
            switchMap(() => next.handle(request))
          );
        } else {
          this.refreshTokenInProgress = true;

          // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
          this.refreshTokenSubject.next(null);

          // Call auth.refreshAccessToken(this is an Observable that will be returned)
          return this.auth.refreshAccessToken().pipe(
            switchMap((token: any) => {
              //When the call to refreshToken completes we reset the refreshTokenInProgress to false
              // for the next time the token needs to be refreshed
              this.refreshTokenInProgress = false;
              this.refreshTokenSubject.next(token.accessToken);
              this.auth.setAccessToken(token.accessToken);
              return next.handle(request);
            }),
            catchError((err: any) => {
              this.refreshTokenInProgress = false;
              this.auth.logout();
              return throwError(err);
            })
          );

        }
      }));

  }
}
  // addAuthenticationToken(request) {
    
  //   // Get access token from Local Storage
  //   const accessToken = this.auth.getAccessToken();
  //   console.log(accessToken);
    
  //   // If access token is null this means that user is not logged in
  //   // And we return the original request
  //   if (!accessToken) {
  //     return request;
  //   }

  //   // We clone the request, because the original request is immutable
  //   return request.clone({
  //     setHeaders: {
  //       Authorization: this.auth.getAccessToken()
  //     }
  //   });
  // }


  // intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

  //   return new Observable(observer => {

  //     const subscription = next.handle(request).subscribe(
  //       event => {
  //         if (event instanceof HttpResponse) {
  //           observer.next(event);
  //         }
  //       },
  //       err => {

  //         if (err.url.includes(environment.apiUrl)) {

  //           if (request.url.includes("refresh") ||
  //             request.url.includes("login") ||
  //             request.url.includes("logout")) {
  //             // We do another check to see if refresh token failed
  //             // In this case we want to logout user and to redirect it to login page
  //             alert('Please remove cache by clicking Ctrl + F5 adn login again. If the warning still appearers , send a mail to: ankush.rana@bsc.es')

  //             if (request.url.includes("refresh")) {
  //               this.auth.logout();
  //             } else {
  //               observer.error(err);
  //             }

  //           } else if (err.status == 401) {
  //             this.isRefreshProcess = true;

  //           } else {
  //             alert('Please remove cache by clicking Ctrl + F5. If the warning still appearers , send a mail to: ankush.rana@bsc.es')
  //             observer.error(err);
  //           }
  //         }
  //       },
  //       () => {
  //         observer.complete()
  //       });

  //     if (this.isRefreshProcess) {

  //     } else {
  //       return () => {
  //         subscription.unsubscribe();
  //       }
  //     }
  //   });
  // }

  // refreshToken(request: HttpRequest<unknown>, next: HttpHandler) {
  //   let subject: Subject<HttpRequest<unknown>> = new Subject<HttpRequest<unknown>>();

  //   this.auth.refreshAccessToken().subscribe(res => {
  //     console.log("ss");

  //     if (res?.accessToken) {
  //       // this.isRefreshProcess = true;

  //       localStorage.setItem('accessToken', JSON.stringify(res.accessToken));
  //       return next.handle(request);
  //     }
  //   })
  // }

