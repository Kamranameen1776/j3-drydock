import { UserService, eDateFormats } from 'jibe-components';
import moment from 'moment';

/**
 * @example
 *  Local Time in GMT+2 as JbString: 14-12-2023 13:30
 *  UTC as JbString: 14-12-2023 11:30
 *  UTC: 2023-12-14T11:30:00.000Z
 *  LocalJbString as UTC: 2023-12-14T13:30:00.000Z
 */
export function localDateJbStringAsUTC(userFormattedDate: string, format?: string): Date {
  return localToUTC(getDateFromJbString(userFormattedDate, format));
}

/**
 * @example
 * UTC: 2000-01-01 13:00:00 GMT+0,
 * UTC as Local GMT+2: 2000-01-01 13:00:00 GMT+2
 */
export function UTCDateAsLocal(date?: Date): Date | null {
  return date ? new Date(date.toString().replace('Z', '')) : null;
}

/**
 * @returns Current local date as UTC
 * @example
 *  Local: 2000-01-01 15:00:00 GMT+2,
 *  UTC: 2000-01-01 13:00:00 GMT+0,
 *  Local as UTC: 2000-01-01 13:00:00 GMT+2
 */
export function currentLocalAsUTC(): Date {
  return localToUTC(new Date());
}

export function localAsUTCFromJbString(userFormattedDate: string, format?: string): string {
  return localAsUTC(getDateFromJbString(userFormattedDate, format));
}

export function UTCAsLocal(date: string): Date {
  return date && new Date(date?.replace('Z', ''));
}

function localAsUTC(date: Date | string): string {
  return date && localToUTC(new Date(date)).toISOString();
}

function getDateFromJbString(userFormattedDate: string, format?: string): Date {
  const dateFormat = format || UserService.getUserDetails()?.Date_Format?.toUpperCase() || eDateFormats.FormDateFormat.toUpperCase();
  return moment(userFormattedDate, dateFormat).toDate();
}

function localToUTC(date: Date): Date {
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - userTimezoneOffset);
}
