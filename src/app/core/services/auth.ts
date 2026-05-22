import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
    private loggedIn = signal(false);

  isAuthenticated = computed(() => this.loggedIn());

  login(): void {
    this.loggedIn.set(true);
  }

  logout(): void {
    this.loggedIn.set(false);
  }

  isLoggedIn(): boolean {
    return this.loggedIn();
  }
}
