import { Component, inject } from '@angular/core';
import { Auth } from '../../../../core/services/auth';
import { Router } from '@angular/router';
import { Button } from "../../../../shared/components/button/button";

@Component({
  selector: 'app-login-page',
  imports: [Button],
  templateUrl: './login-page.html'

})
export class LoginPage {
    private authService = inject(Auth);
  private router = inject(Router);

  login(): void {
    this.authService.login();

    this.router.navigate(['/profile']);
  }
}
