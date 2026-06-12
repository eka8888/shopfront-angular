import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../../core/services/auth';


import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Button } from '../../../../shared/components/button/button';
import { InputComponent } from '../../../../shared/components/input/input';

import {
  ButtonType,
  InputType,
} from '../../../../shared/types/form.enums';
import { AddressPipe } from "../../../../shared/pipes/address-pipe";

@Component({
  selector: 'app-profile-page',
  imports: [
    ReactiveFormsModule,
    Button,
    InputComponent,
    AddressPipe
],
  templateUrl: './profile-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePage {
  readonly ButtonType = ButtonType;
  readonly InputType = InputType;

  private authService = inject(Auth);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  profileForm = this.fb.nonNullable.group({
    firstName: ['Demo', [Validators.required]],
    lastName: ['User', [Validators.required]],
    email: ['demo@gmail.com', [Validators.required, Validators.email]],
    dateOfBirth: ['2000-01-01', [Validators.required]],
  });

  addresses = [
    {
      type: 'Default Address',
      street: 'Rustaveli Ave 10',
      city: 'Tbilisi',
      country: 'Georgia',
    },
  ];

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    console.log(
      'Profile updated:',
      this.profileForm.getRawValue()
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}