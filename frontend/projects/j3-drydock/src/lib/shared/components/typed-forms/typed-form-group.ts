import { AbstractControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { TypedAbstractControl } from './typed-abstract-control';

export type StringKeys<T> = Extract<keyof T, string>;

export interface TypedFormGroup<T> extends FormGroup {
  readonly valueChanges: Observable<T>;
  readonly value: T;

  controls: {
    [K in StringKeys<T>]: TypedAbstractControl<T[K]>;
  };

  get<K extends StringKeys<T>>(path: K): TypedAbstractControl<T[K]>;

  addControl<K extends StringKeys<T>>(name: K, control: AbstractControl): void;
  addControl<K extends StringKeys<T>>(name: K, control: TypedAbstractControl<T[K]>): void;

  getRawValue(): T;

  patchValue(
    value: Partial<T>,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ): void;
}
