import * as _ from 'lodash';

export function replaceArrayItem(array, replaceCriteriaObject: any, newItem: any) {
  const availableItem = _.find(array, replaceCriteriaObject);
  if (availableItem) {
    const itemIndex = _.findIndex(array, availableItem);
    if (itemIndex !== -1) {
      return _.concat(
        _.slice(array, 0, itemIndex),
        newItem,
        _.slice(array, itemIndex + 1)
      );
    }
  }

  return array;
}
