import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Token {
  private readonly publicTokenKey = 'public_access_token';
  private readonly publicTokenExpiresAtKey =
    'public_access_token_expires_at';

  private readonly customerTokenKey = 'customer_access_token';

  readonly publicToken = signal<string | null>(
    localStorage.getItem(this.publicTokenKey)
  );

  readonly customerToken = signal<string | null>(
    localStorage.getItem(this.customerTokenKey)
  );

  setPublicToken(token: string, expiresInSeconds: number): void {
 
    const safetyMarginInSeconds = 60;

    const expiresAt =
      Date.now() +
      Math.max(expiresInSeconds - safetyMarginInSeconds, 0) * 1000;

    localStorage.setItem(this.publicTokenKey, token);

    localStorage.setItem(
      this.publicTokenExpiresAtKey,
      expiresAt.toString()
    );

    this.publicToken.set(token);
  }

  getPublicToken(): string | null {
    if (!this.isPublicTokenValid()) {
      return null;
    }

    return this.publicToken();
  }

  isPublicTokenValid(): boolean {
    const token = this.publicToken();

    const expiresAt = Number(
      localStorage.getItem(this.publicTokenExpiresAtKey)
    );

    return Boolean(
      token &&
      Number.isFinite(expiresAt) &&
      expiresAt > Date.now()
    );
  }

  clearPublicToken(): void {
    localStorage.removeItem(this.publicTokenKey);
    localStorage.removeItem(this.publicTokenExpiresAtKey);

    this.publicToken.set(null);
  }

  setCustomerToken(token: string): void {
    localStorage.setItem(this.customerTokenKey, token);
    this.customerToken.set(token);
  }

  getCustomerToken(): string | null {
    return this.customerToken();
  }

  clearCustomerToken(): void {
    localStorage.removeItem(this.customerTokenKey);
    this.customerToken.set(null);
  }

  clearAllTokens(): void {
    this.clearPublicToken();
    this.clearCustomerToken();
  }
}