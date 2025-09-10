import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from "@angular/forms";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

export function AsyncExistanceValidator(
  func: (val: any) => Observable<boolean>
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || (control.value || "").trim().length === 0) {
      return of(null);
    }
    return func(control.value).pipe(
      map((res: boolean) => (res ? { isExists: true } : null))
    );
  };
}

export function AsyncExistanceValidatorByControl(
  func: (val: AbstractControl) => Observable<boolean>
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);
    return func(control).pipe(
      map((res: boolean) => (res ? { isExists: true } : null))
    );
  };
}
