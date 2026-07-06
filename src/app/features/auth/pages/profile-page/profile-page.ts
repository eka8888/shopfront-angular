import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Auth } from '../../../../core/services/auth';
import { Button } from '../../../../shared/components/button/button';
import { InputComponent } from '../../../../shared/components/input/input';
import { SelectComponent } from '../../../../shared/components/select/select';
import { ButtonType, InputType } from '../../../../shared/types/form.enums';
import { AddressPipe } from '../../../../shared/pipes/address-pipe';
import {
  dateOfBirthValidator,
  postalCodeValidator,
} from '../../../../shared/utils/profile.validator';
import { passwordStrengthValidator } from '../../../../shared/utils/password.validator';
import { ApiError } from '../../../../core/interceptors/auth-interceptor';
import { CustomerAddress } from '../../../../core/models/auth.interface';

@Component({
  selector: 'app-profile-page',
  imports: [
    ReactiveFormsModule,
    Button,
    InputComponent,
    SelectComponent,
    AddressPipe,
  ],
  templateUrl: './profile-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePage implements OnInit {
  readonly ButtonType = ButtonType;
  readonly InputType = InputType;

  private readonly authService = inject(Auth);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  customerVersion = 0;
  saveSuccess = '';
  passwordSuccess = '';
passwordError = '';
  isLoading = false;
  profileError = '';

  editingAddressId: string | null = null;
  showAddressForm = false;

  countries = [
    { value: 'georgia', label: 'Georgia' },
    { value: 'usa', label: 'USA' },
    { value: 'germany', label: 'Germany' },
  ];

  profileForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    dateOfBirth: ['', [Validators.required, dateOfBirthValidator()]],
  });

  passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        passwordStrengthValidator,
      ],
    ],
    confirmPassword: ['', Validators.required],
  });

  addressForm = this.fb.nonNullable.group({
    streetName: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    postalCode: ['', [Validators.required, postalCodeValidator('country')]],
  });

  addresses: CustomerAddress[] = [];
  defaultShippingAddressId?: string;
  defaultBillingAddressId?: string;

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.profileError = '';

    this.authService
      .getMyProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => {
          this.isLoading = false;
          this.customerVersion = profile.version;
          

          this.profileForm.patchValue({
            firstName: profile.firstName ?? '',
            lastName: profile.lastName ?? '',
            email: profile.email,
            dateOfBirth: profile.dateOfBirth ?? '',
          });

          this.addresses = profile.addresses ?? [];
          this.defaultShippingAddressId = profile.defaultShippingAddressId;
          this.defaultBillingAddressId = profile.defaultBillingAddressId;

          this.cdr.markForCheck();
        },
        error: (error: ApiError) => {
          this.isLoading = false;
          this.profileError = error.message;
          this.cdr.markForCheck();
        },
      });
  }

  saveProfile(): void {
    this.profileError = '';
    this.saveSuccess = '';

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.authService
      .updateMyProfile({
        version: this.customerVersion,
        ...this.profileForm.getRawValue(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedProfile) => {
          this.isLoading = false;
          this.customerVersion = updatedProfile.version;
          this.saveSuccess = 'Profile updated successfully.';
          this.cdr.markForCheck();
        },
        error: (error: ApiError) => {
          this.isLoading = false;
          this.profileError = error.message;
          this.cdr.markForCheck();
        },
      });
  }
changePassword(): void {
  this.passwordError = '';
  this.passwordSuccess = '';

  if (this.passwordForm.invalid) {
    this.passwordForm.markAllAsTouched();
    return;
  }

  const { currentPassword, newPassword, confirmPassword } =
    this.passwordForm.getRawValue();

  if (newPassword !== confirmPassword) {
    this.passwordError = 'New password and confirmation password do not match.';
    this.cdr.markForCheck();
    return;
  }

  this.isLoading = true;

  this.authService
    .changePassword({
      version: this.customerVersion,
      currentPassword,
      newPassword,
    })
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (profile) => {
        this.isLoading = false;
        this.customerVersion = profile.version;
        this.passwordForm.reset();

        this.passwordSuccess = 'Password changed successfully.';
        this.passwordError = '';

        this.cdr.markForCheck();
      },
      error: (error: ApiError) => {
        this.isLoading = false;
        this.passwordSuccess = '';

        if (error.status === 400) {
          this.passwordError = 'Current password is incorrect.';
        } else {
          this.passwordError =
            error.message ?? 'Password change failed. Please try again.';
        }

        this.cdr.markForCheck();
      },
    });
}

  openAddressForm(): void {
    this.showAddressForm = true;
    this.editingAddressId = null;
    this.addressForm.reset();
    this.saveSuccess = '';
    this.profileError = '';
  }

  saveAddress(): void {
    this.profileError = '';
    this.saveSuccess = '';

    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    const address = this.addressForm.getRawValue();

    const request$ = this.editingAddressId
      ? this.authService.updateAddress(
          this.customerVersion,
          this.editingAddressId,
          address
        )
      : this.authService.addAddress(this.customerVersion, address);

    this.isLoading = true;

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => {
          this.applyUpdatedProfile(profile);
          this.addressForm.reset();
          this.editingAddressId = null;
          this.showAddressForm = false;
          this.saveSuccess = 'Address saved successfully.';
          this.cdr.markForCheck();
        },
        error: (error: ApiError) => {
          this.isLoading = false;
          this.profileError = error.message;
          this.cdr.markForCheck();
        },
      });
  }

  editAddress(address: CustomerAddress): void {
    this.showAddressForm = true;
    this.editingAddressId = address.id ?? null;
    this.saveSuccess = '';
    this.profileError = '';

    this.addressForm.patchValue({
      streetName: address.streetName ?? '',
      city: address.city ?? '',
      country: this.mapCountryName(address.country ?? ''),
      postalCode: address.postalCode ?? '',
    });

    this.cdr.markForCheck();
  }

  deleteAddress(addressId?: string): void {
    if (!addressId) return;

    this.isLoading = true;
    this.profileError = '';
    this.saveSuccess = '';

    this.authService
      .deleteAddress(this.customerVersion, addressId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => {
          this.applyUpdatedProfile(profile);
          this.saveSuccess = 'Address deleted successfully.';
          this.cdr.markForCheck();
        },
        error: (error: ApiError) => {
          this.isLoading = false;
          this.profileError = error.message;
          this.cdr.markForCheck();
        },
      });
  }

  setDefaultShipping(addressId?: string): void {
    if (!addressId) return;

    this.profileError = '';
    this.saveSuccess = '';

    this.authService
      .setDefaultShippingAddress(this.customerVersion, addressId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => {
          this.applyUpdatedProfile(profile);
          this.saveSuccess = 'Default shipping address updated.';
          this.cdr.markForCheck();
        },
        error: (error: ApiError) => {
          this.profileError = error.message;
          this.cdr.markForCheck();
        },
      });
  }

  setDefaultBilling(addressId?: string): void {
    if (!addressId) return;

    this.profileError = '';
    this.saveSuccess = '';

    this.authService
      .setDefaultBillingAddress(this.customerVersion, addressId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => {
          this.applyUpdatedProfile(profile);
          this.saveSuccess = 'Default billing address updated.';
          this.cdr.markForCheck();
        },
        error: (error: ApiError) => {
          this.profileError = error.message;
          this.cdr.markForCheck();
        },
      });
  }

  cancelAddressEdit(): void {
    this.showAddressForm = false;
    this.editingAddressId = null;
    this.addressForm.reset();
    this.profileError = '';
    this.saveSuccess = '';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private applyUpdatedProfile(profile: {
    version: number;
    addresses?: CustomerAddress[];
    defaultShippingAddressId?: string;
    defaultBillingAddressId?: string;
  }): void {
    this.isLoading = false;
    this.customerVersion = profile.version;
    this.addresses = profile.addresses ?? [];
    this.defaultShippingAddressId = profile.defaultShippingAddressId;
    this.defaultBillingAddressId = profile.defaultBillingAddressId;
  }

  private mapCountryName(countryCode: string): string {
    const countries: Record<string, string> = {
      GE: 'georgia',
      US: 'usa',
      DE: 'germany',
    };

    return countries[countryCode] ?? countryCode.toLowerCase();
  }
}