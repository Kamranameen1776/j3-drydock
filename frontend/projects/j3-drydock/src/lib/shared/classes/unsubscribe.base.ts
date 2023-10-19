import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

export abstract class UnsubscribeComponent implements OnDestroy {
  unsubscribe$ = new Subject<void>();

  unsubscribe(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
