import { Injectable } from '@angular/core';
import * as forge from 'node-forge';

const pki = forge.pki;
const rsa = pki.rsa;
const md = forge.md.sha256.create();

const KEY_SIZE = 2048;

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private privateKey: any;
  private publicKey;
  private certificate;

  constructor() { }

  generateCertificateRequestAndEncryptedPrivateKeyPEM(username: string, password: string):
    {certificateRequest: string, encryptedPrivateKey: string} {
    const keyPair = rsa.generateKeyPair(KEY_SIZE);
    this.publicKey = keyPair.publicKey;
    this.privateKey = keyPair.privateKey;
    const certificateRequest = pki.createCertificationRequest();
    certificateRequest.publicKey = this.publicKey;
    certificateRequest.setSubject([{
      name: 'commonName',
      value: username
    }, {
      name: 'countryName',
      value: 'TN'
    }, {
      name: 'localityName',
      value: 'Tunis'
    }, {
      name: 'organizationName',
      value: 'ChatApp'
    }, {
      shortName: 'OU',
      value: 'Test'
    }]);
    certificateRequest.sign(this.privateKey);
    const encryptedPrivateKey = pki.encryptRsaPrivateKey(keyPair.privateKey, password);
    return {certificateRequest: pki.certificationRequestToPem(certificateRequest), encryptedPrivateKey};
  }

  decryptPrivateKey(encryptedPrivateKeyPem: string, password: string): string {
    return pki.privateKeyToPem(pki.decryptRsaPrivateKey(encryptedPrivateKeyPem, password));
  }

  encrypt(message: string, senderCertificate: string): string {
    const certificate = pki.certificateFromPem(senderCertificate);
    const publicKey = certificate.publicKey;
    // @ts-ignore
    return forge.util.encode64(publicKey.encrypt(message));
  }

  decrypt(encryptedMessage: string, privateKeyPem: string): string {
    const privateKey = pki.privateKeyFromPem(privateKeyPem);
    return privateKey.decrypt(forge.util.decode64(encryptedMessage), 'RSA-OAEP', {
      md: forge.md.sha256.create(),
      mgf1: {
        md: forge.md.sha256.create()
      }
    });
  }

}
