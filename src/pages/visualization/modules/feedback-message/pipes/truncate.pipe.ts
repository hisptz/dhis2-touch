import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(text: string, textLength: number): any {
    return _.truncate(text, {'length': textLength});
  }

}
