import { Pipe, PipeTransform } from '@angular/core';
import { SpecificationStatus } from '../../services/specifications/specification.service';

const statusCodeMap = {
  [SpecificationStatus.RAISED.toLocaleLowerCase()]: 'raise',
  [SpecificationStatus.APPROVED.toLocaleLowerCase()]: 'in progress',
  [SpecificationStatus.COMPLETED.toLocaleLowerCase()]: 'close',
  [SpecificationStatus.REJECTED.toLocaleLowerCase()]: 'raise'
};

@Pipe({
  name: 'specificationStatus'
})
export class SpecificationStatusPipe implements PipeTransform {
  transform(statusCode: string): string {
    const lowerStatusCode = (statusCode ?? '').toLocaleLowerCase();
    return statusCodeMap[lowerStatusCode] ?? statusCodeMap[SpecificationStatus.RAISED];
  }
}
