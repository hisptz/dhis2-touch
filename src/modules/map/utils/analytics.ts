import { relativePeriods } from '../constants/periods.contant';
/* DIMENSIONS */

const createDimension = (dimension, items, props) => ({
  dimension,
  items,
  ...props
});

const getDimension = (dimension, arr) => arr.filter(item => item.dimension === dimension)[0];

const getDimensionItems = (dimension, arr) => {
  const dataItems = getDimension(dimension, arr);
  return dataItems && dataItems.items ? dataItems.items : [];
};

/* DATA ITEMS */

export const getDataItemsFromColumns = (columns = []) => getDimensionItems('dx', columns);

// PERIOD
export const getPeriodFromFilters = (filters = []) => getDimensionItems('pe', filters)[0];
export const getPeriodNameFromId = id => {
  const period = relativePeriods.filter(pe => pe.id === id)[0];
  return period ? period.name : null;
};

//
export const getOrgUnitsFromRows = (rows = []) => getDimensionItems('ou', rows) || [];

export const getFiltersFromColumns = (columns = []) => {
  const filters = columns.filter(item => item.filter);
  return filters.length ? filters : null;
};

export const getFiltersAsText = (filters = []) => {
  return filters.map(({ name, filter }) => {
    const [operator, value] = filter.split(':');
    return `${name} ${getFilterOperatorAsText(operator)} ${value}`;
  });
};

export const getFilterOperatorAsText = id =>
  ({
    EQ: '=',
    GT: '>',
    GE: '>=',
    LT: '<',
    LE: '<=',
    NE: '!=',
    IN: 'one of',
    '!IN': 'not one of',
    LIKE: 'contains',
    '!LIKE': "doesn't contains"
  }[id]);
