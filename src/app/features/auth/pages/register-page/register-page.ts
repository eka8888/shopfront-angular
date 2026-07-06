import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Button } from '../../../../shared/components/button/button';
import { InputComponent } from '../../../../shared/components/input/input';
import { SelectComponent } from '../../../../shared/components/select/select';

import {
  ButtonType,
  InputType,
} from '../../../../shared/types/form.enums';

import { passwordStrengthValidator } from '../../../../shared/utils/password.validator';
import {
  dateOfBirthValidator,
  postalCodeValidator,
} from '../../../../shared/utils/profile.validator';
import { APP_CONFIG } from '../../../../core/config/app-config.token';
import { Auth } from '../../../../core/services/auth';
import { ApiError } from '../../../../core/interceptors/auth-interceptor';

@Component({
  selector: 'app-register-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    Button,
    InputComponent,
    SelectComponent,
  ],
  templateUrl: './register-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPage {
  readonly ButtonType = ButtonType;
  readonly InputType = InputType;

  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly  appConfig = inject(APP_CONFIG);
  private readonly authService = inject(Auth);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
readonly minPasswordLength = this.appConfig.minPasswordLength;
  registerError = '';
  isLoading = false;

  readonly countries = [
    { value: 'georgia', label: 'Georgia' },
    { value: 'usa', label: 'USA' },
    { value: 'germany', label: 'Germany' },
  ];

  registerForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(this.appConfig.minPasswordLength),
        passwordStrengthValidator,
      ],
    ],
    dateOfBirth: ['', [Validators.required, dateOfBirthValidator()]],

    country: ['', Validators.required],
    street: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: ['', [Validators.required, postalCodeValidator('country')]],

    useSameAddressForBilling: [true],

    billingCountry: [''],
    billingStreet: [''],
    billingCity: [''],
    billingPostalCode: [''],
  });

  get useSameAddressForBilling(): boolean {
    return this.registerForm.controls.useSameAddressForBilling.value;
  }

  register(): void {
    this.registerError = '';
    this.updateBillingValidators();

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formValue = this.registerForm.getRawValue();

    this.authService
      .register(formValue)
      .pipe(
        switchMap(() =>
          this.authService.login({
            email: formValue.email,
            password: formValue.password,
          })
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.isLoading = false;
            this.cdr.markForCheck();
          this.router.navigate(['/home']);
        },
        error: (error: ApiError) => {
          this.isLoading = false;

          if (error.status === 0) {
    this.registerError = 'Network error. Please check your internet connection.';
  } else if (error.status === 400) {
    this.registerError = error.message ?? 'Registration failed. Please check your data.';
  } else if (error.status === 401) {
    this.registerError =
      'Registration was successful, but login failed. Please login manually.';
    this.router.navigate(['/login']);
  } else {
    this.registerError = error.message ?? 'Registration failed. Please try again.';
  }

  this.cdr.markForCheck();
}
      });
  }

  private updateBillingValidators(): void {
    const {
      billingCountry,
      billingStreet,
      billingCity,
      billingPostalCode,
    } = this.registerForm.controls;

    if (!this.useSameAddressForBilling) {
      billingCountry.addValidators(Validators.required);
      billingStreet.addValidators(Validators.required);
      billingCity.addValidators(Validators.required);
      billingPostalCode.addValidators([
        Validators.required,
        postalCodeValidator('billingCountry'),
      ]);
    } else {
      billingCountry.clearValidators();
      billingStreet.clearValidators();
      billingCity.clearValidators();
      billingPostalCode.clearValidators();
    }

    billingCountry.updateValueAndValidity();
    billingStreet.updateValueAndValidity();
    billingCity.updateValueAndValidity();
    billingPostalCode.updateValueAndValidity();
  }
}