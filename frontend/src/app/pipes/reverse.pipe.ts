import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse',
  pure: false
})
export class ReversePipe implements PipeTransform {

  transform(value: Object[]): any {    
      return value.slice().reverse();
  }
}
