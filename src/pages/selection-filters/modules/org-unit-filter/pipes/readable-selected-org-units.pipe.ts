import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'readableSelectedOrgUnitsPipe',
  pure: false
})
export class ReadableSelectedOrgUnitsPipe implements PipeTransform {
  transform(selectedOrgUnits: any[], nameCount: number = 3): any {
    if (!selectedOrgUnits) {
      return '';
    }

    return _.map(selectedOrgUnits.slice(0, nameCount), orgUnit => orgUnit.name).
      join(', ') + (selectedOrgUnits.length > nameCount ? ' and ' + (selectedOrgUnits.length - nameCount) + ' more' :
      '');
  }
}
