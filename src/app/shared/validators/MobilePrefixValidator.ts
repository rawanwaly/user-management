import { AbstractControl, ValidationErrors } from '@angular/forms';

export function MobilePrefixValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  const saudiRegex = /^05\d{8}$/;
  return saudiRegex.test(value) ? null : { pattern: true };
}
