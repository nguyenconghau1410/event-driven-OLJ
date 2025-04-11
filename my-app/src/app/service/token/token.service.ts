import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private access_token = new BehaviorSubject<string | null>(null);
  private secretKey =
    (window as any)?.env?.SECRET_KEY && !window.env.SECRET_KEY.includes('${')
      ? window.env.SECRET_KEY
      : '';
  constructor() {
    const storedToken = sessionStorage.getItem('access_token');
    if (storedToken) {
      const decrypted = this.secretKey !== '' ? this.decrypt(storedToken) : storedToken;
      this.access_token.next(decrypted);
    }
  }

  setAccessToken(token: string) {
    const encrypted = this.encrypt(token);
    if(this.secretKey !== '') {
      sessionStorage.setItem('access_token', encrypted);
    }
    else {
      sessionStorage.setItem('access_token', token);
    }

    this.access_token.next(token);
  }

  get accessToken(): BehaviorSubject<string | null> {
    return this.access_token;
  }

  clearAccessToken(): void {
    sessionStorage.removeItem('access_token');
  }

  private encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }

  private decrypt(cipherText: string): string | null {
      try {
        const bytes = CryptoJS.AES.decrypt(cipherText, this.secretKey);
        return bytes.toString(CryptoJS.enc.Utf8) || null;
      } catch (e) {
        console.error("Failed to decrypt token:", e);
        return null;
      }
  }
  
}
