import { UserService, eDateFormats } from 'jibe-components';
import moment from 'moment';

export function getISOStringFromDateString(date: string) {
  const dateFormat = UserService.getUserDetails()?.Date_Format?.toUpperCase() || eDateFormats.FormDateFormat.toUpperCase();
  return moment(date, dateFormat).toISOString();
}
