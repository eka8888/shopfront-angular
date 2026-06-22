import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Auth } from '../../../../core/services/auth';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Button } from '../../../../shared/components/button/button';
import { InputComponent } from '../../../../shared/components/input/input';

import { ButtonType, InputType } from '../../../../shared/types/form.enums';

@Component({
  selector: 'app-login-page',
  imports: [
    Button,
    InputComponent,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  readonly ButtonType = ButtonType;
  readonly InputType = InputType;

  private authService = inject(Auth);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginError = '';

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  login(): void {
    this.loginError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    console.log('Login Form:', this.loginForm.getRawValue());



    this.authService.login();

    this.router.navigate(['/home']);
  }
}