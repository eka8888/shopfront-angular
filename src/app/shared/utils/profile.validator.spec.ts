import { FormControl, FormGroup } from '@angular/forms';
import {
  dateOfBirthValidator,
  postalCodeValidator,
} from './profile.validator';

describe('Profile validators', () => {
  it('should return invalidDate for wrong date', () => {
    const control = new FormControl('wrong-date', dateOfBirthValidator());

  expect(control.errors?.['invalidDate']).toBe(true);
  });

  it('should return futureDate for future date', () => {
    const control = new FormControl('2999-01-01', dateOfBirthValidator());

  expect(control.errors?.['futureDate']).toBe(true);
  });

  it('should validate Georgian postal code', () => {
    const form = new FormGroup({
      country: new FormControl('georgia'),
      postalCode: new FormControl('1234', postalCodeValidator('country')),
    });

    expect(form.controls.postalCode.errors).toBeNull();
  });
});