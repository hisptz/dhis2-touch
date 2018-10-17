import * as _ from 'lodash';

export function getSanitizedAnalytics(analytics: any, dataSelections) {
  if (!analytics) {
    return null;
  }

  const { headers, metaData, rows } = analytics;

  // Check header with option set
  const headersWithOptionSet = _.filter(
    headers,
    analyticsHeader => analyticsHeader.optionSet
  );

  _.each(headersWithOptionSet, (header: any) => {
    const { optionSet } = _.find(dataSelections, ['dimension', header.name]);

    const headerOptions = optionSet ? optionSet.options : [];

    if (headerOptions.length > 0) {
      // Update metadata dimension
      if (metaData[header.name]) {
        metaData[header.name] = _.map(
          headerOptions,
          (option: any) => option.code || option.id
        );
      }

      // Update metadata names
      _.each(headerOptions, headerOption => {
        metaData.names[headerOption.code || headerOption.id] =
          headerOption.name;
      });
    }
  });

  // Check header with other dynamic dimensions
  const headersWithDynamicDimensionButNotOptionSet = _.filter(
    headers,
    (analyticsHeader: any) => {
      return (
        analyticsHeader.name !== 'dx' &&
        analyticsHeader.name !== 'pe' &&
        analyticsHeader.name !== 'ou' &&
        analyticsHeader.name !== 'value' &&
        !analyticsHeader.optionSet
      );
    }
  );

  _.each(headersWithDynamicDimensionButNotOptionSet, header => {
    const dataSelection = _.find(dataSelections, ['dimension', header.name]);
    if (dataSelection) {
      // find index for the dimension
      const dataSelectionHeaderIndex = headers.indexOf(
        _.find(headers, ['name', dataSelection.dimension])
      );
      // Find rows for the dimension
      const rowValues =
        dataSelectionHeaderIndex !== -1
          ? _.filter(
              _.map(rows, row => parseInt(row[dataSelectionHeaderIndex], 10)),
              rowValue => !isNaN(rowValue)
            )
          : [];
      const splittedFilter = dataSelection.filter
        ? dataSelection.filter.split(':')
        : [];
      const headerOptions =
        splittedFilter.length > 1
          ? getFilterOptions(
              splittedFilter[0],
              parseInt(splittedFilter[1], 10),
              _.max(rowValues)
            )
          : dataSelection.items.length > 0
            ? _.map(dataSelection.items, item => {
                return { code: item.id, name: item.name };
              })
            : [];

      if (headerOptions.length > 0) {
        // Update metadata dimension
        if (metaData[header.name]) {
          metaData[header.name] = _.map(
            headerOptions,
            (option: any) => option.code
          );
        }

        // Update metadata names
        _.each(headerOptions, headerOption => {
          metaData.names[headerOption.code] = headerOption.name;
        });
      }
    }
  });

  return { ...analytics, metaData };
}

function getFilterOptions(
  operator: string,
  testValue: number,
  maxValue: number
) {
  switch (operator) {
    case 'LT':
      return _.times(testValue, (valueItem: number) => {
        return {
          code: valueItem.toString(),
          name: valueItem.toString()
        };
      });
    case 'LE':
      return _.times(testValue + 1, (valueItem: number) => {
        return {
          code: valueItem.toString(),
          name: valueItem.toString()
        };
      });
    case 'GT':
      return _.map(_.range(testValue + 1, maxValue + 1), valueItem => {
        return {
          code: valueItem.toString(),
          name: valueItem.toString()
        };
      });
    case 'GE':
      return _.map(_.range(testValue, maxValue + 1), valueItem => {
        return {
          code: valueItem.toString(),
          name: valueItem.toString()
        };
      });
    case 'EQ':
      return [{ code: testValue.toString(), name: testValue.toString() }];
    case 'NE':
      return _.filter(
        _.times(maxValue + 1, (valueItem: number) => {
          return {
            code: valueItem.toString(),
            name: valueItem.toString()
          };
        }),
        valueItem => parseInt(valueItem.code, 10) !== testValue
      );
    default:
      return [];
  }
}
