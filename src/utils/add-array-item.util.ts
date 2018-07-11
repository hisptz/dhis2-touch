import * as _ from 'lodash';
import {replaceArrayItem} from './replace-array-item.util';

export function addArrayItem(array: any[], newItem: any, identifier: string, addCriteria: string = 'last', canUpdate: boolean = false) {
  const newArray = _.clone(array);
  const availableItem = _.find(array, [identifier, newItem[identifier]]);

  if (!availableItem) {
    if (addCriteria === 'last') {
      return _.concat(array, newItem);
    } else if (addCriteria === 'first') {
      return _.concat(newItem, array);
    }
  } else if (canUpdate) {
    return replaceArrayItem(array, [identifier, newItem[identifier]], newItem);
  }

  return newArray;
}
