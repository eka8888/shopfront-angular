import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Auth } from '../../../../core/services/auth';
import { Button } from '../../../../shared/components/button/button';
import { InputComponent } from '../../../../shared/components/input/input';
import { ButtonType, InputType } from '../../../../shared/types/form.enums';
import { ApiError } from '../../../../core/interceptors/auth-interceptor';

@Component({
  selector: 'app-login-page',
  imports: [Button, InputComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  readonly ButtonType = ButtonType;
  readonly InputType = InputType;

  private readonly authService = inject(Auth);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

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

    this.authService
      .login(this.loginForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (error: ApiError) => {
          if (error.status === 0) {
            this.loginError =
              'Network error. Please check your internet connection.';
          } else if (error.status === 401 || error.status === 400) {
            this.loginError = 'Invalid email or password.';
          } else {
            this.loginError = error.message ?? 'Login failed. Please try again.';
          }

          this.cdr.markForCheck();
        },
      });
  }
}