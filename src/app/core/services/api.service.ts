import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  register(body: any): Promise<any> {
    return this.http.post(`${environment.BASE_URL}/users/create`, JSON.stringify(body))
      .toPromise();
  }

  login(body: any): Promise<any> {
    return this.http.post(`${environment.BASE_URL}/token/`, JSON.stringify(body))
      .toPromise();
  }
}
