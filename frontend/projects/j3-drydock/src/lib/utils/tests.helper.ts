import { DebugElement } from '@angular/core';
import { defer } from 'rxjs';

export const ButtonClickEvents = {
  left: { button: 0 },
  right: { button: 2 }
};

/** Simulate element click. Defaults to mouse left-button click event. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function click(el: DebugElement | HTMLElement, eventObj: any = ButtonClickEvents.left): void {
  if (el instanceof HTMLElement) {
    el.click();
  } else {
    el.triggerEventHandler('click', eventObj);
  }
}

/**
 * Create async observable that emits-once and completes
 * after a JS engine turn
 */
export function asyncResponse<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

/**
 * Create async observable error that errors
 * after a JS engine turn
 */
export function asyncError<T>(errorObject: T) {
  return defer(() => Promise.reject(errorObject));
}
