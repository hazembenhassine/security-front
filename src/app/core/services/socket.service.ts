import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { StorageService } from './storage.service';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket: any;

  constructor(private storage: StorageService) { }

  getSocket(): Promise<WebSocket> {
    return new Promise<WebSocket>((resolve, reject) => {
      const socket = new WebSocket(`ws://localhost:8000/ws/?token=${this.storage.credentials.token}`);
      socket.onopen = () => {
        resolve(socket);
      };
      socket.onerror = (err) => {
        reject(err);
      };
      socket.onclose = (e) => {
        console.error('Chat socket closed unexpectedly');
      };
    });
  }
}
