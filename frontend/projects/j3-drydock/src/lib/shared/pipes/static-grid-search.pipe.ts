import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'staticGridSearch'
})
export class StaticGridSearchPipe implements PipeTransform {
  transform<T>(gridData: T[], searchTerm: string, filterFn: (item: T, searchTerm: string) => boolean): T[] {
    return gridData.filter((item) => filterFn(item, searchTerm));
  }
}
