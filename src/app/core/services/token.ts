import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Token {
  private readonly publicTokenKey = 'public_access_token';
  private readonly customerTokenKey = 'customer_access_token';

  /**
   * Token used for public commercetools requests:
   * products, categories, product search, and so on.
   */
  readonly publicToken = signal<string | null>(
    localStorage.getItem(this.publicTokenKey)
  );

  /**
   * Token received after customer login.
   * Used for /me, /me/password, /me/carts, and similar endpoints.
   */
  readonly customerToken = signal<string | null>(
    localStorage.getItem(this.customerTokenKey)
  );

  setPublicToken(token: string): void {
    localStorage.setItem(this.publicTokenKey, token);
    this.publicToken.set(token);
  }

  getPublicToken(): string | null {
    return this.publicToken();
  }

  clearPublicToken(): void {
    localStorage.removeItem(this.publicTokenKey);
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