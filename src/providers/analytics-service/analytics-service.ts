import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as _ from 'lodash';
import {HttpClientProvider} from "../http-client/http-client";

/*
  Generated class for the AnalyticsServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AnalyticsServiceProvider {

  constructor(public http: HttpClientProvider) {}

  getAnalytics(visualizationDetails: any,currentUser) {
    const visualizationObject = _.clone(visualizationDetails.visualizationObject);
    return Observable.create(observer => {
      Observable.forkJoin(visualizationDetails.filters.map(filterObject => {
        let analyticUrl = '';
        const parametersArray: any[] = this._getParametersArray(filterObject.filters);
        if (parametersArray.length > 0) {
          const parameters: string = parametersArray.join('&');
          let visualizationSettings = this._getVisualizationSettings(visualizationDetails.favorite, filterObject.id);
          if (visualizationSettings == null) {
            visualizationSettings = _.filter(_.map(visualizationObject.layers, (layer: any) => {
              return layer.settings
            }), (setting) => {
              return setting.id === filterObject.id
            })[0];
          }

          analyticUrl = this._constructAnalyticsUrl(
            visualizationDetails.apiRootUrl,
            visualizationObject.type,
            visualizationSettings,
            parameters
          )

        }
        return analyticUrl !== '' ? this.http.get(analyticUrl,currentUser) : Observable.of(null)
      })).subscribe((analyticsResponse : any) => {
        const newAnalyticsResponse: any[] = _.map(analyticsResponse, (analyticsResponseObject: any) =>
          analyticsResponseObject !== null && analyticsResponseObject.data ? JSON.parse(analyticsResponseObject.data) : null
        );

        // alert(analyticsResponse)
        visualizationDetails.analytics = _.filter(_.map(visualizationDetails.filters, (filter: any, filterIndex) => {
          return {id: filter.id, content: newAnalyticsResponse[filterIndex]}
        }), (analytics) => {
          return analytics.content !== null;
        });

        observer.next(visualizationDetails);
        observer.complete();
      }, error => {
        visualizationDetails.error = error;
        observer.next(visualizationDetails);
        observer.complete();
      })
    });
  }

  private _sanitizeIncomingAnalytics(analyticsObject: any, filterObject) {

    // todo deal with analytics with more than one dynamic dimensions
    const newAnalyticsObject: any = _.clone(analyticsObject);

    if (analyticsObject !== null) {
      const newMetadata: any = _.clone(analyticsObject.metaData);

      if (analyticsObject.headers) {
        const headerWithOptionSet = _.filter(analyticsObject.headers, (analyticsHeader : any) => analyticsHeader.optionSet)[0];

        /**
         * Check header with option set
         */
        if (headerWithOptionSet) {
          const headerOptionsObject :any = _.find(filterObject.filters, ['name', headerWithOptionSet.name]);


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
              && analyticsHeader.name !== 'ou' && analyticsHeader.name !== 'value') && !analyticsHeader.optionSet
          })[0];

        if (headersWithDynamicDimensionButNotOptionSet) {
          const headerOptionsWithoutOptionSetObject : any = _.find(filterObject.filters, ['name', headersWithDynamicDimensionButNotOptionSet.name]);

          if (headerOptionsWithoutOptionSetObject) {
            const headerFilter = headerOptionsWithoutOptionSetObject.value;

            if (headerFilter) {

              let headerOptions = [];
              if (headerFilter.split(':').length > 1) {
                headerOptions = this._getFilterNumberRange(headerFilter);
              } else {
                if (headerOptionsWithoutOptionSetObject.items) {
                  headerOptions =  _.map(headerOptionsWithoutOptionSetObject.items, (item: any) => {
                    return {
                      code: item.id,
                      name: item.displayName
                    }
                  })
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

  private _getFilterNumberRange(filterString) {
    // todo add more mechanism for other operations
    const splitedFilter = filterString.split(':');
    let newNumberRange = [];
    if (splitedFilter[0] === 'LE') {
      const maxValue: number = parseInt(splitedFilter[1]);
      if (!isNaN(maxValue)) {
        newNumberRange = _.assign([], _.times(maxValue + 1, (value: number) => {
          return {
            code: (value).toString(),
            name: (value).toString()
          }
        }))
      }

    } else if (splitedFilter[0] === 'LT') {
      const maxValue: number = parseInt(splitedFilter[1]);
      if (!isNaN(maxValue)) {
        newNumberRange = _.assign([], _.times(maxValue, (value: number) => {
          return {
            code: (value).toString(),
            name: (value).toString()
          }
        }))
      }

    } else if (splitedFilter[0] === 'EQ') {
      newNumberRange = [{
        code: splitedFilter[1],
        name: splitedFilter[1]
      }]
    } else if (splitedFilter[0] === 'GE') {

    } else if (splitedFilter[0] === 'GT') {

    } else if (splitedFilter[0] === 'NE') {

    }
    return newNumberRange;
  }

  private _getParametersArray(filters: any[]) {
    return _.filter(_.map(filters, (filter) => {
      return filter.value !== '' ? 'dimension=' + filter.name + ':' + filter.value :
        ['dx', 'pe', 'ou'].indexOf(filter.name) === -1 ? 'dimension=' + filter.name : '';
    }), param => {
      return param !== ''
    });
  }

  private _getVisualizationSettings(favoriteObject, settingsId) {
    let settings: any = null;
    if (favoriteObject) {
      if (favoriteObject.mapViews) {
        settings = _.find(favoriteObject.mapViews, ['id', settingsId])
      } else if (favoriteObject.id === settingsId) {
        settings = favoriteObject
      }
    }
    return settings;
  }

  private _constructAnalyticsUrl(apiRootUrl: string,
                                 visualizationType: string,
                                 visualizationSettings: any,
                                 parameters: any) {

    if (!visualizationSettings) {
      return '';
    }
    let url: string = apiRootUrl + 'analytics';
    const aggregationType: string = visualizationSettings.hasOwnProperty('aggregationType') ?
      visualizationSettings.aggregationType !== 'DEFAULT' ? '&aggregationType=' + visualizationSettings.aggregationType : '' : '';
    const value: string = visualizationSettings.hasOwnProperty('value') ? '&value=' + visualizationSettings.value.id : '';

    if (visualizationType === 'EVENT_CHART') {
      url += '/events/aggregate/' + this._getProgramParameters(visualizationSettings);

    } else if (visualizationType === 'EVENT_REPORT') {

      if (visualizationSettings.hasOwnProperty('dataType')) {
        if (visualizationSettings.dataType === 'AGGREGATED_VALUES') {
          url += '/events/aggregate/' + this._getProgramParameters(visualizationSettings);
        } else {
          url += '/events/query/' + this._getProgramParameters(visualizationSettings);
        }
      }

    } else if (visualizationType === 'EVENT_MAP') {

      url += '/events/aggregate/' + this._getProgramParameters(visualizationSettings);

    } else if (visualizationType === 'MAP' && visualizationSettings.layer === 'event') {

      if (visualizationSettings.aggregate) {
        url += '/events/aggregate/' + this._getProgramParameters(visualizationSettings);
      } else {
        url += '/events/query/' + this._getProgramParameters(visualizationSettings);
      }

      /**
       * Also get startDate and end date if available
       */
      if (visualizationSettings.hasOwnProperty('startDate') && visualizationSettings.hasOwnProperty('endDate')) {
        url += 'startDate=' + visualizationSettings.startDate + '&' + 'endDate=' + visualizationSettings.endDate + '&';
      }

    } else {
      url += '.json?';
    }


    if (url.split('&').length <= 1 && parameters.split('&').length <= 1) {
      return '';
    }

    if (parameters !== '') {
      url += parameters;
    }
    url += value !== '' || value !== undefined ? value : '';
    url += aggregationType !== '' ? aggregationType : '';
    url += this._getAnalyticsCallStrategies(visualizationType, null);
    return url;
  }

  private _getAnalyticsCallStrategies(visualizationType, layerType: string = null): string {
    let strategies = '';
    strategies += visualizationType === 'EVENT_CHART' ||
    visualizationType === 'EVENT_REPORT' || visualizationType === 'EVENT_MAP' ? '&outputType=EVENT' : '';
    strategies += '&displayProperty=SHORTNAME';
    strategies += layerType !== null && layerType === 'event' ? '&coordinatesOnly=true' : '';
    return strategies;
  }

  private _getProgramParameters(favoriteObject: any): string {
    let params = '';
    if (favoriteObject.hasOwnProperty('program') && favoriteObject.hasOwnProperty('programStage')) {

      if (favoriteObject.program.hasOwnProperty('id') && favoriteObject.programStage.hasOwnProperty('id')) {
        params = favoriteObject.program.id + '.json?stage=' + favoriteObject.programStage.id + '&';
      }
    }
    return params;
  }

  mergeAnalytics(splitedAnalyticsArray) {
    const mergedRows: any[] = [];
    let headers: any[] = [];
    const metadataNames: any = {};
    const metadata: any = {};
    if (splitedAnalyticsArray) {
      splitedAnalyticsArray.forEach((analyticsObject: any) => {
        if (analyticsObject) {
          const rows = analyticsObject.rows;
          headers = analyticsObject.headers;
          const metadataKeys = _.keys(analyticsObject.metaData);
          metadataKeys.forEach(metadataKey => {
            const metadataKeyValues = analyticsObject.metaData[metadataKey];
            if (metadataKey === 'names') {
              const metadataNamesKeys = _.keys(metadataKeyValues);
              metadataNamesKeys.forEach(metadataNameKey => {
                metadataNames[metadataNameKey] = analyticsObject.metaData.names[metadataNameKey];
              })
            } else {
              const metadataIds = analyticsObject.metaData[metadataKey];
              if (metadataIds.length > 0) {
                metadataIds.forEach(metadataId => {
                  if (metadata[metadataKey]) {
                    const metadataIdIndex = _.indexOf(metadata[metadataKey], metadataId);
                    if (metadataIdIndex === -1) {
                      metadata[metadataKey].push(metadataId);
                    }
                  } else {
                    metadata[metadataKey] = [];
                    metadata[metadataKey].push(metadataId);
                  }
                })
              } else {
                metadata[metadataKey] = [];
              }
            }

          });

          /**
           * Get rows
           */
          if (rows) {
            rows.forEach(row => {
              mergedRows.push(row);
            })
          }
        }
      })
    }

    metadata.names = metadataNames;
    return {
      headers: headers,
      metaData: metadata,
      rows: mergedRows
    }
  }

  splitAnalytics(analytics: any, splitCriteria: any[]) {
    const analyticsArray: any[] = [];
    const analyticHeaders: any[] = analytics.headers;
    let analyticsMetadata: any[] = [];

    /**
     * split metadata based on dimension selected
     */
    if (analytics.metaData) {
      analyticsMetadata = [analytics.metaData];
      splitCriteria.forEach(criteria => {
        analyticsMetadata = this.splitAnalyticsMetadata(analyticsMetadata, criteria);
      });
    }

    /**
     * split the corresponding rows
     */
    if (analyticsMetadata.length > 0) {
      analyticsMetadata.forEach((metadata: any) => {
        let rows: any[] = analytics.rows;
        const metadataNames: any = {};
        const newMetadata: any = _.clone(metadata);
        if (rows.length > 0) {
          splitCriteria.forEach(criteria => {
            const rowIndex = _.findIndex(analyticHeaders, ['name', criteria]);
            const id = metadata[criteria][0];
            rows = this.splitAnalyticsRows(rows, id, rowIndex);

            /**
             * Get names
             */
            const headersNameArray = analyticHeaders.map(header => {
              return header.name
            });

            headersNameArray.forEach(headerName => {
              metadataNames[headerName] = metadata.names[headerName];
              if (metadata[headerName]) {
                metadata[headerName].forEach(metadataName => {
                  metadataNames[metadataName] = metadata.names[metadataName];
                });
              }
            });

            metadata[criteria].forEach(metadataCriteria => {
              metadataNames[metadataCriteria] = metadata.names[metadataCriteria];
            });

            newMetadata.names = metadataNames;
          });
        }

        analyticsArray.push({
          headers: analyticHeaders,
          metaData: newMetadata,
          rows: rows
        })
      })
    }


    return analyticsArray;
  }

  splitAnalyticsMetadata(analyticsMetadataArray, splitDimension): any {
    const metadataArray: any[] = [];
    if (analyticsMetadataArray) {
      analyticsMetadataArray.forEach(metadata => {
        if (metadata[splitDimension]) {
          metadata[splitDimension].forEach(metadataDimension => {
            const newMetadata: any = _.clone(metadata);
            newMetadata[splitDimension] = [metadataDimension];
            metadataArray.push(newMetadata)
          })
        }
      })
    }

    return metadataArray;
  }

  splitAnalyticsRows(analyticsRows, splitDimensionId, dimensionIndex) {
    const newRowsArray: any[] = [];
    if (analyticsRows) {
      analyticsRows.forEach(row => {
        if (row[dimensionIndex] === splitDimensionId) {
          newRowsArray.push(row)
        }
      })
    }

    return newRowsArray;
  }

  mapEventClusteredAnalyticsToAggregate(analyticsObject: any): any {
    return analyticsObject;
  }

}
