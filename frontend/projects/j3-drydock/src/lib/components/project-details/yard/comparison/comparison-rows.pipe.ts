import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'comparisonRows'
})
export class ComparisonRowsPipe implements PipeTransform {
  transform<T>(value: T[], visibleRowsIdSet: Set<string | number>, fieldName: string): T[] {
    if (!value || !visibleRowsIdSet || !visibleRowsIdSet.size) {
      return [];
    }
    const re = value.filter((item) => visibleRowsIdSet.has(item[fieldName]));
    return re;
  }
}
