import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'standardJobsStatusColor'
})
export class StandardJobsStatusColorPipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? '#2676BB' : '#D356FF';
  }
}
