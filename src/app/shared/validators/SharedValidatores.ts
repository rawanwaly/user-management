import { AbstractControl, ValidationErrors, Validators } from "@angular/forms";
export function CustomRequired(control: AbstractControl) {
  const isNotWhitespace = (control.value || "").trim().length !== 0;
  return isNotWhitespace ? null : { required: true };
}

export function noZeroValue(control: AbstractControl): ValidationErrors | null {
  const patten = /[1-9]+/;
  if (!Validators.pattern(patten)(control)) return null;
  return { noZeroValue: true };
}
