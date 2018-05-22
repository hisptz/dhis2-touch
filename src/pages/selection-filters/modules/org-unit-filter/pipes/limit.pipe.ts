import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'limitPipe',
  pure: false
})
export class LimitPipe implements PipeTransform {
  transform(array: any[], limit: number = 3): any {
    if (!array) {
      return '';
    }

    return array.slice(0, limit);
  }
}
