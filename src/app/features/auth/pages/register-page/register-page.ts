import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Button } from '../../../../shared/components/button/button';
import { InputComponent } from '../../../../shared/components/input/input';
import { SelectComponent } from '../../../../shared/components/select/select';

import {
  ButtonType,
  InputType,
} from '../../../../shared/types/form.enums';

import { passwordStrengthValidator } from '../../../../shared/utils/password.validator';
import { APP_CONFIG } from '../../../../core/config/app-config.token';

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

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private appConfig = inject(APP_CONFIG);

  countries = [
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

    dateOfBirth: ['', Validators.required],

    country: ['', Validators.required],

    street: ['', Validators.required],

    city: ['', Validators.required],

    postalCode: ['', Validators.required],
  });

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    console.log(
      'Register Form:',
      this.registerForm.getRawValue()
    );

    this.router.navigate(['/login']);
  }
}