import { Injectable } from '@angular/core';

import { HttpResponse, HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];
  constructor() { }


  removeRequest(request: HttpRequest<any>) {
    const i = this.requests.indexOf(request)
    if (i >= 0) {
      this.requests.splice(i, 1)
    }
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    return new Observable(observer => {
      
      const subscription = next.handle(request).subscribe(
          
          event => {
            if (event instanceof HttpResponse) {
              this.removeRequest(request)
              observer.next(event);
            }
          },
          err => {
            
            if (!err.url.includes("http://api.ipify.org")){
              alert('Please remove cache by clicking Ctrl + F5. If the warning still appearers , send a mail to: ankush.rana@bsc.es')
            }
            this.removeRequest(request);
            observer.error(err);
          },
          () => {            
            this.removeRequest(request)
            observer.complete()
          });
      // remove request from queue when cancelled
      return () => {        
        this.removeRequest(request)
        subscription.unsubscribe();
      }
    });
  }

}
