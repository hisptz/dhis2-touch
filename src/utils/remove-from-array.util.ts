import * as _ from 'lodash';

export function removeFromArray(array: any[], removalCriteriaObject: any): any[] {
  const itemToRemove = _.find(array, removalCriteriaObject);

  if (itemToRemove) {
    const itemIndex = _.findIndex(array, removalCriteriaObject);

    if (itemIndex !== -1) {
      return _.concat(
        _.slice(array, 0, itemIndex),
        _.slice(array, itemIndex + 1)
      );
    }
  }
  return array;
}
