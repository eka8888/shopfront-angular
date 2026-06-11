import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return null;
  }

  const hasLetter = /[A-Za-z]/.test(value);
  const hasNumber = /\d/.test(value);

  return hasLetter && hasNumber ? null : { passwordStrength: true };
}