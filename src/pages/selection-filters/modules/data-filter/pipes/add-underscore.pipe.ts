import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addUnderscore'
})
export class AddUnderscorePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.replace(".","_");
  }

}
