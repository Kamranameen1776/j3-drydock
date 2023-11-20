import { Pipe, PipeTransform } from '@angular/core';
import { eStandardJobsMainStatus } from '../../../models/enums/standard-jobs-main.enum';

@Pipe({
  name: 'standardJobsStatusName'
})
export class StandardJobsStatusNamePipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? eStandardJobsMainStatus.Active : eStandardJobsMainStatus.InActive;
  }
}
