import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService {
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
      console.log('interceptor', tokenizedReq);

      return next.handle(tokenizedReq);
    }

    console.log('interceptor no token: ', req.headers);
    // if (this.token) {
    //   const tokenizedReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + this.token) });
    //   return next.handle(tokenizedReq);
    // }
    return next.handle(req);
  }
}
