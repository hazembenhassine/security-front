import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { StorageService } from '../../core/services/storage.service';
import { CryptoService } from '../../core/services/crypto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loginForm: FormGroup = this.fb.group({
    login: ['', [Validators.required]],
    password: ['', [Validators.required]],
    certificate: ['']
  });

  constructor(private fb: FormBuilder,
              private api: ApiService,
              private storage: StorageService,
              private crypto: CryptoService,
              private router: Router) { }

  ngOnInit(): void {
  }

  login(): void {
    if (this.loginForm.valid) {
      this.loginForm.patchValue({certificate: this.storage.credentials.certificate});
      this.api.login(this.loginForm.value).then(({access}) => {
        this.storage.setToken(access);
        const key = this.crypto.decryptPrivateKey(this.storage.credentials.key, this.loginForm.get('password').value);
        console.log(key);
        this.storage.setDecryptedKey(key);
        this.storage.setLogin(this.loginForm.get('login').value);
        this.router.navigate(['/chat']);
      });
    }
  }

}
