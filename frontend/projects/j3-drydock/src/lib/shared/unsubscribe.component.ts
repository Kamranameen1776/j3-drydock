import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

export abstract class UnsubscribeComponent implements OnDestroy {
  protected componentDestroyed$ = new Subject();

  protected dispose(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  ngOnDestroy(): void {
    this.dispose();
  }
}
