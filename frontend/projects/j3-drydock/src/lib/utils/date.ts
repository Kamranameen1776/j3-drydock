import { UserService, eDateFormats } from 'jibe-components';
import moment from 'moment';

export function getDateFromJbString(userFormattedDate: string, format?: string): Date {
  const dateFormat = format || UserService.getUserDetails()?.Date_Format?.toUpperCase() || eDateFormats.FormDateFormat.toUpperCase();
  return moment(userFormattedDate, dateFormat).toDate();
}

export function localToUTC(date: Date): Date {
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - userTimezoneOffset);
}

export function localAsUTC(date: Date | string): string {
  return date && localToUTC(new Date(date)).toISOString();
}

export function UTCAsLocal(date: string): Date {
  return date && new Date(date?.replace('Z', ''));
}
