import { Injectable } from '@angular/core';
import { IJbGrowl } from 'jibe-components';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messageSourceSubject = new BehaviorSubject<IJbGrowl>({});

  public messageSource$ = this.messageSourceSubject.asObservable();

  constructor() {}

  log(severity?: 'error' | 'info' | 'success' | 'warn', summary?: string, detail?: string, position = 'top-right'): void {
    this.messageSourceSubject.next({ severity, summary, detail, position });
  }

  error = (summary?: string, detail?: string, position = 'top-right') => this.log('error', summary, detail, position);

  info = (summary?: string, detail?: string, position = 'top-right') => this.log('info', summary, detail, position);

  success = (summary?: string, detail?: string, position = 'top-right') => this.log('success', summary, detail, position);

  warn = (summary?: string, detail?: string, position = 'top-right') => this.log('warn', summary, detail, position);

  showWarningError = (error: any): void => {
    const firstNotification = error?.error?.notifications?.[0];
    if (!firstNotification) {
      this.error(JSON.stringify(error));
      return;
    }
    const { message, name, type } = firstNotification;
    if (type === 'warning') {
      this.warn(message);
    } else {
      this.error(
        name === 'OptimisticLockError' ? 'Please refresh the page since record has been updated by someone else during editing' : message
      );
    }
  };
}
