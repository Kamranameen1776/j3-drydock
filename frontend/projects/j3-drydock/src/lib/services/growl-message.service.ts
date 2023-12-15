import { Injectable } from '@angular/core';
import { eGrowlPosition, eMessagesSeverityValues, IJbGrowl } from 'jibe-components';
import { Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';

interface IGrowlError {
  status: number;
  error: {
    title: string;
    type: string;
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

  setErrorMessage(errorMsg: string) {
    this._growlMessage$.next({
      ...this.defaultMsg,
      severity: eMessagesSeverityValues.Error,
      summary: errorMsg
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
    if (err?.status === 422) {
      this.setErrorMessage(err.error.title);
    } else {
      this.setErrorMessage('Server error occurred');
    }
  }
}
