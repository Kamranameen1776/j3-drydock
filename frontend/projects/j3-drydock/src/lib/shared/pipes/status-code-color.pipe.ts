import { Pipe, PipeTransform } from '@angular/core';

export const statusCodeColors = {
  raise: '#D356FF',
  'in progress': '#A35BFF',
  complete: '#2676BB',
  close: '#349258',
  unclose: '#349258',
  offset: '#7F8594'
};
// Taken from jb-components, because it's not exported from it
@Pipe({
  name: 'statusCodeColor'
})
export class StatusCodeColorPipe implements PipeTransform {
  transform(statusCode: string): string {
    const lowerStatusCode = (statusCode ?? '').toLocaleLowerCase();
    return statusCodeColors[lowerStatusCode] ?? statusCodeColors.raise;
  }
}
