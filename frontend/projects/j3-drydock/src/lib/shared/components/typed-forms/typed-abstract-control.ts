import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';

export interface TypedAbstractControl<T> extends AbstractControl {
  readonly valueChanges: Observable<T>;
  readonly value: T;

  setValue(
    value: T,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    }
  ): void;
}
