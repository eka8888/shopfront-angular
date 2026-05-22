import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  imports: [],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage {
    private router = inject(Router);

  register(): void {
    console.log('User registered');

    this.router.navigate(['/login']);
  }
}
