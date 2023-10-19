import { Injectable } from '@angular/core';
import { eGrowlPosition, eMessagesSeverityValues, IJbGrowl } from 'jibe-components';
import { Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Injectable()
export class GrowlMessageService {
  private _growlMessage$ = new Subject<IJbGrowl>();

  private readonly defaultMsg: IJbGrowl = {
    position: eGrowlPosition.TopRight,
    sticky: false,
    autoZIndex: true,
    baseZIndex: 50000
  };

  // strange jb-growl behavior - doesn't show fist message other way
  public growlMessage$ = this._growlMessage$.asObservable().pipe(startWith({}));

  public setErrorMessage(errorMsg: string) {
    this._growlMessage$.next({
      ...this.defaultMsg,
      severity: eMessagesSeverityValues.Error,
      summary: errorMsg
    });
  }

  public setSuccessMessage(successMsg: string, detail?: string) {
    this._growlMessage$.next({
      ...this.defaultMsg,
      severity: eMessagesSeverityValues.Success,
      summary: successMsg,
      detail: detail
    });
  }

  public setMessage(msg: IJbGrowl) {
    this._growlMessage$.next({
      ...this.defaultMsg,
      ...msg
    });
  }
}
