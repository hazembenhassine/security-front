import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { credentialsKey } from './storage.service';

@Injectable()
export class ApiHeaderInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token: string;
    if ((localStorage.getItem(credentialsKey))) {
      token = JSON.parse(localStorage.getItem(credentialsKey)).token;
    } else if ((sessionStorage.getItem(credentialsKey))) {
      token = JSON.parse(sessionStorage.getItem(credentialsKey)).token;
    }
    if (token) {
      request = request.clone({headers: request.headers.set('Authorization', 'Bearer ' + token)});
    }

    if (!request.headers.has('Content-Type') && !request.headers.has('File-Upload')) {
      request = request.clone({headers: request.headers.set('Content-Type', 'application/json')});
    }

    request = request.clone({headers: request.headers.set('Accept', 'application/json')});

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(`Error ${error.status}: ${error.statusText}`);
        return throwError(error);
      })
    );
  }
}
