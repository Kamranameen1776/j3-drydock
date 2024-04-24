import { Pipe, PipeTransform } from '@angular/core';
import { UTCAsLocal } from '../../utils/date';

@Pipe({
  name: 'UTCAsLocal'
})
export class UTCAsLocalPipe implements PipeTransform {
  constructor() {}

  transform(date: string): Date {
    return UTCAsLocal(date);
  }
}
