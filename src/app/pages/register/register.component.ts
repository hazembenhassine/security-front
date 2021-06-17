import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { CryptoService } from '../../core/services/crypto.service';
import { Router } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup = this.fb.group({
    login: ['', [Validators.required]],
    nom: ['', [Validators.required]],
    prenom: ['', [Validators.required]],
    num: ['', [Validators.required]],
    password: ['', [Validators.required]],
    cert_req: ['']
  });

  constructor(private fb: FormBuilder,
              private api: ApiService,
              private crypto: CryptoService,
              private storageService: StorageService,
              private router: Router) { }

  ngOnInit(): void {
  }

  register(): void {
    if (this.registerForm.valid) {
      const cert = this.crypto.generateCertificateRequestAndEncryptedPrivateKeyPEM(
        this.registerForm.get('login').value,
        this.registerForm.get('password').value
      );
      this.registerForm.patchValue({cert_req: cert.certificateRequest});
      this.api.register(this.registerForm.value).then(({certificate}) => {
        this.storageService.setCertificate(certificate);
        this.storageService.setEncryptedKey(cert.encryptedPrivateKey);
        this.router.navigate(['/home']);
      }).catch((err) => {
        console.error(err);
      });
    }
  }

}
