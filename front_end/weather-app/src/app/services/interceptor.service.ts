import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService {

  //This interceptor looks for every http request sent from the client to the
  //back end (API) and intercepts it into include the authoriazation header with
  //with the token 
  token: string = '';
  constructor(private store: StorageService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

      const token = this.store.getItem('Token');
    if (token) {
      // headers = headers.append('auth', `Bearer ${token}`)
      req.headers.set('Authorization', 'Bearer ' + token);
      const tokenizedReq = req.clone({
        headers: req.headers.set('authorization', 'Bearer ' + token),
      });
      //console.log('interceptor', tokenizedReq);

      return next.handle(tokenizedReq);
    }

    console.log('interceptor no token: ', req.headers);
    return next.handle(req);
  }
}
