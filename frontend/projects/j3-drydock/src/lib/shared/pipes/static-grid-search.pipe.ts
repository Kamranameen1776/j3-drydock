import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'staticGridSearch'
})
export class StaticGridSearchPipe implements PipeTransform {
  transform<T>(gridData: T[], searchTerm: string, filterFn: (item: T, searchTerm: string) => boolean) {
    if (!gridData) {
      return {
        records: [],
        count: 0
      };
    }

    if (!searchTerm) {
      return {
        records: gridData,
        count: gridData.length
      };
    }

    const filtered = gridData.filter((item) => filterFn(item, searchTerm));
    return { records: filtered, count: filtered.length };
  }
}
