import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appForbiddenNames]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: ForbiddenNamesDirective,
    multi: true
  }]
})
export class ForbiddenNamesDirective implements Validator {
  @Input('appForbiddenNames') forbiddenNames: string[] = [];

  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const value = control.value.trim().toLowerCase();
    return this.forbiddenNames.includes(value) ? { forbiddenName: true } : null;
  }
}
