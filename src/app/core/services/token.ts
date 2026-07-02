import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Token {
    private readonly tokenKey = 'access_token';

  token = signal<string | null>(localStorage.getItem(this.tokenKey));

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.token.set(token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.token.set(null);
  }
}
