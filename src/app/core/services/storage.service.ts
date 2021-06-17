import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Credentials } from '../models/credentials.model';

export const credentialsKey = 'ChatApp';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    if (isPlatformBrowser(this.platformId)) {
      const savedCredentials = localStorage.getItem(credentialsKey);
      if (savedCredentials) {
        this._credentials = JSON.parse(savedCredentials);
      } else {
        this._credentials = {} as Credentials;
      }
    }
  }

  get credentials(): Credentials {
    return this._credentials;
  }

  // tslint:disable-next-line:variable-name
  private _credentials: Credentials;

  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.setCredentials();
    return of(true);
  }

  isAuthenticated(): boolean {
    return !!this.credentials.token;
  }

  public setCredentials(credentials?: any): void {
    if (isPlatformBrowser(this.platformId)) {
      this._credentials = credentials || null;

      if (credentials) {
        localStorage.setItem(credentialsKey, JSON.stringify(credentials));
      } else {
        localStorage.removeItem(credentialsKey);
      }
    }
  }

  public setToken(token): void {
    if (isPlatformBrowser(this.platformId)) {
      this._credentials.token = token;
      localStorage.setItem(credentialsKey, JSON.stringify(this._credentials));
    }
  }

  public setEncryptedKey(key): void {
    if (isPlatformBrowser(this.platformId)) {
      this._credentials.key = key;
      localStorage.setItem(credentialsKey, JSON.stringify(this._credentials));
    }
  }

  public setCertificate(certificate): void {
    if (isPlatformBrowser(this.platformId)) {
      this._credentials.certificate = certificate;
      localStorage.setItem(credentialsKey, JSON.stringify(this._credentials));
    }
  }

  public setServerCertificate(certificate): void {
    if (isPlatformBrowser(this.platformId)) {
      this._credentials.serverCertificate = certificate;
      localStorage.setItem(credentialsKey, JSON.stringify(this._credentials));
    }
  }

  public setDecryptedKey(key): void {
    if (isPlatformBrowser(this.platformId)) {
      this._credentials.decryptedKey = key;
      localStorage.setItem(credentialsKey, JSON.stringify(this._credentials));
    }
  }

  public setLogin(login): void {
    if (isPlatformBrowser(this.platformId)) {
      this._credentials.login = login;
      localStorage.setItem(credentialsKey, JSON.stringify(this._credentials));
    }
  }

}
