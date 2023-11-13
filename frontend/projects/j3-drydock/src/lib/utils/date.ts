import { UserService, eDateFormats } from 'jibe-components';
import moment from 'moment';

export function getDateString(date: Date | string): string {
  const dateFormat = UserService.getUserDetails()?.Date_Format?.toLocaleUpperCase() || eDateFormats.DefaultFormat;
  return moment(date).format(dateFormat);
}
