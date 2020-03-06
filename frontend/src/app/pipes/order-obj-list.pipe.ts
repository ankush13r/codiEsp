import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderObjList'
})
export class OrderObjListPipe implements PipeTransform {

  transform(value: unknown[], key: string): unknown[] {
    return value.sort((obj,obj2)=>obj[key]- obj2[key])
  }

}
