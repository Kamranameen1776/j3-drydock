import { Injectable } from '@angular/core';
import { eGrowlPosition, eMessagesSeverityValues, IJbGrowl } from 'jibe-components';
import { Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';

interface IGrowlError {
  status: number;
  error: {
    name?: string;
    message?: string;
  };
}

@Injectable()
export class GrowlMessageService {
  private _growlMessage$ = new Subject<IJbGrowl>();
  // strange jb-growl behavior - doesn't show fist message other way
  growlMessage$ = this._growlMessage$.asObservable().pipe(startWith({}));
  private readonly defaultMsg: IJbGrowl = {
    position: eGrowlPosition.TopRight,
    sticky: false,
    autoZIndex: true,
    baseZIndex: 50000
  };

  setErrorMessage(errorMsg?: string, detail?: string) {
    this._growlMessage$.next({
      ...this.defaultMsg,
      severity: eMessagesSeverityValues.Error,
      summary: errorMsg,
      detail
    });
  }

  setSuccessMessage(successMsg: string, detail?: string) {
    this._growlMessage$.next({
      ...this.defaultMsg,
      severity: eMessagesSeverityValues.Success,
      summary: successMsg,
      detail: detail
    });
  }

  setMessage(msg: IJbGrowl) {
    this._growlMessage$.next({
      ...this.defaultMsg,
      ...msg
    });
  }

  errorHandler(err: IGrowlError) {
    this.setErrorMessage(err.error.name, err.error.message);
  }
}
