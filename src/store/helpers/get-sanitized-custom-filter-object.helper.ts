export function getSanitizedCustomFilterObject(filterObject) {

  const newFilterValue = filterObject.selectedData ? filterObject.selectedData : filterObject;
  const newFilterItems = filterObject.items ? filterObject.items : filterObject.itemList;
  return {name: newFilterValue.name, value: newFilterValue.value, items: newFilterItems};
}
