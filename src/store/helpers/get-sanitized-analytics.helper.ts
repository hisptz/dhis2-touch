import * as _ from 'lodash';

export function getSanitizedAnalytics(analyticsObject: any, visualizationFilters: any[]) {

  // TODO deal with analytics with more than one dynamic dimensions
  const newAnalyticsObject: any = _.clone(analyticsObject);

  if (analyticsObject !== null) {
    const newMetadata: any = _.clone(analyticsObject.metaData);

    if (analyticsObject.headers) {
      const headerWithOptionSet = _.filter(analyticsObject.headers, analyticsHeader => analyticsHeader.optionSet)[0];

      /**
       * Check header with option set
       */
      if (headerWithOptionSet) {
        const headerOptionsObject = _.find(visualizationFilters, ['name', headerWithOptionSet.name]);

        if (headerOptionsObject) {
          const headerOptions = _.assign([], headerOptionsObject.options);
          if (headerOptions) {
            /**
             * Update metadata dimension
             */
            if (newMetadata[headerWithOptionSet.name]) {
              newMetadata[headerWithOptionSet.name] = _.assign(
                [], _.map(headerOptions, (option: any) => option.code ? option.code : option.id));
            }

            /**
             * Update metadata names
             */
            const newMetadataNames = _.clone(newMetadata.names);

            headerOptions.forEach((option: any) => {
              const nameIndex = option.code ? option.code : option.id;

              if (nameIndex) {
                newMetadataNames[nameIndex] = option.name;
              }
            });

            newMetadata.names = _.assign({}, newMetadataNames);
          }
        }
      }

      const headersWithDynamicDimensionButNotOptionSet = _.filter(analyticsObject.headers,
        (analyticsHeader: any) => {
          return (analyticsHeader.name !== 'dx' && analyticsHeader.name !== 'pe'
            && analyticsHeader.name !== 'ou' && analyticsHeader.name !== 'value') && !analyticsHeader.optionSet;
      })[0];

      if (headersWithDynamicDimensionButNotOptionSet) {
        const headerOptionsWithoutOptionSetObject = _.find(visualizationFilters, ['name', headersWithDynamicDimensionButNotOptionSet.name]);

        if (headerOptionsWithoutOptionSetObject) {
          const headerFilter = headerOptionsWithoutOptionSetObject.value;

          if (headerFilter) {

            let headerOptions = [];
            if (headerFilter.split(':').length > 1) {
              headerOptions = getFilterNumberRange(headerFilter);
            } else {
              if (headerOptionsWithoutOptionSetObject.items) {
                headerOptions = _.map(headerOptionsWithoutOptionSetObject.items, (item: any) => {
                  return {
                    code: item.id,
                    name: item.displayName
                  };
                });
              }
            }

            if (headerOptions) {
              /**
               * Update metadata dimension
               */
              if (newMetadata[headersWithDynamicDimensionButNotOptionSet.name]) {
                newMetadata[headersWithDynamicDimensionButNotOptionSet.name] = _.assign(
                  [], _.map(headerOptions, (option: any) => option.code ? option.code : option.id));
              }

              /**
               * Update metadata names
               */
              const newMetadataNames = _.clone(newMetadata.names);

              headerOptions.forEach((option: any) => {
                const nameIndex = option.code ? option.code : option.id;

                if (nameIndex) {
                  newMetadataNames[nameIndex] = option.name;
                }
              });

              newMetadata.names = _.assign({}, newMetadataNames);
            }
          }
        }
      }
    }

    newAnalyticsObject.metaData = _.assign({}, newMetadata);
  }
  return newAnalyticsObject;
}

function getFilterNumberRange(filterString) {
  // todo add more mechanism for other operations
  const splitedFilter = filterString.split(':');
  let newNumberRange = [];
  if (splitedFilter[0] === 'LE') {
    const maxValue: number = parseInt(splitedFilter[1], 10);
    if (!isNaN(maxValue)) {
      newNumberRange = _.assign([], _.times(maxValue + 1, (value: number) => {
        return {
          code: (value).toString(),
          name: (value).toString()
        };
      }));
    }

  } else if (splitedFilter[0] === 'LT') {
    const maxValue: number = parseInt(splitedFilter[1], 10);
    if (!isNaN(maxValue)) {
      newNumberRange = _.assign([], _.times(maxValue, (value: number) => {
        return {
          code: (value).toString(),
          name: (value).toString()
        };
      }));
    }

  } else if (splitedFilter[0] === 'EQ') {
    newNumberRange = [{
      code: splitedFilter[1],
      name: splitedFilter[1]
    }];
  } else if (splitedFilter[0] === 'GE') {

  } else if (splitedFilter[0] === 'GT') {

  } else if (splitedFilter[0] === 'NE') {

  }
  return newNumberRange;
}
