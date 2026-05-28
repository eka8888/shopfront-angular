import { computed, effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
    private loggedIn = signal(localStorage.getItem('isLoggedIn') === 'true');

  isAuthenticated = computed(() => this.loggedIn());

    constructor() {
    effect(() => {
      localStorage.setItem(
        'isLoggedIn',
        String(this.loggedIn())
      );

      console.log(
        'Auth state changed:',
        this.loggedIn()
      );
    });
  }

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
