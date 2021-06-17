import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../core/services/socket.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { StorageService } from '../../core/services/storage.service';
import { CryptoService } from '../../core/services/crypto.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  to: FormControl = this.fb.control('');
  message: FormControl = this.fb.control('');

  messages: string[] = [];

  socket: WebSocket;

  constructor(private socketService: SocketService,
              private fb: FormBuilder,
              private storage: StorageService,
              private crypto: CryptoService) { }

  ngOnInit(): void {
    console.log(`I am ${this.storage.credentials.login}`);
    this.socketService.getSocket().then(socket => {
      this.socket = socket;
      socket.onmessage = (ev) => {
        if (ev.data) {
          let data;
          try {
            data = JSON.parse(ev.data);
            this.messages.push(this.crypto.decrypt(data.cipherMessage, this.storage.credentials.decryptedKey));
          } catch (e) {
            this.storage.setServerCertificate(ev.data);
          }
          if (data) {
          }
          // const data = JSON.parse(ev.data);
          // console.log(this.storage.credentials.decryptedKey);
          // const cipherMessage = this.crypto.encrypt('salut', this.storage.credentials.certificate);
          // console.log(cipherMessage);
        }
      };
    });
  }

  send(): void {
    console.log('sending');
    this.socket.send(JSON.stringify({
      to: this.to.value,
      from: this.storage.credentials.login,
      command: 'new_message',
      message: this.message.value
    }));
  }

}
