import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function dateOfBirthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) return null;

    const date = new Date(value);
    const today = new Date();

    if (Number.isNaN(date.getTime())) {
      return { invalidDate: true };
    }

    if (date >= today) {
      return { futureDate: true };
    }

    return null;
  };
}

export function postalCodeValidator(
  countryControlName: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;
    if (!parent) return null;

    const country = parent.get(countryControlName)?.value;
    const postalCode = control.value;

    if (!postalCode) return null;

    const patterns: Record<string, RegExp> = {
      georgia: /^\d{4}$/,
      usa: /^\d{5}(-\d{4})?$/,
      germany: /^\d{5}$/,
    };

    const pattern = patterns[country];

    if (!pattern) return null;

    return pattern.test(postalCode)
      ? null
      : { invalidPostalCode: true };
  };
}