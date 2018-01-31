import * as _ from 'lodash';
export function constructAnalyticsUrl(visualizationType: string, visualizationSettings: any, visualizationFilters: any[]) {

  if (!visualizationSettings) {
    return '';
  }
  let url = 'analytics';
  const aggregationType: string = visualizationSettings.hasOwnProperty('aggregationType') ?
    visualizationSettings.aggregationType !== 'DEFAULT' ? '&aggregationType=' + visualizationSettings.aggregationType : '' : '';
  const value: string = visualizationSettings.hasOwnProperty('value') ? '&value=' + visualizationSettings.value.id : '';

  if (visualizationType === 'EVENT_CHART') {
    url += '/events/aggregate/' + getProgramParameters(visualizationSettings);

  } else if (visualizationType === 'EVENT_REPORT') {

    if (visualizationSettings.hasOwnProperty('dataType')) {
      if (visualizationSettings.dataType === 'AGGREGATED_VALUES') {
        url += '/events/aggregate/' + getProgramParameters(visualizationSettings);
      } else {
        url += '/events/query/' + getProgramParameters(visualizationSettings);
      }
    }

  } else if (visualizationType === 'EVENT_MAP') {

    url += '/events/aggregate/' + getProgramParameters(visualizationSettings);

  } else if (visualizationType === 'MAP' && visualizationSettings.layer === 'event') {

    if (visualizationSettings.aggregate) {
      url += '/events/aggregate/' + getProgramParameters(visualizationSettings);
    } else {
      url += '/events/query/' + getProgramParameters(visualizationSettings);
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

  const parameters = getParametersArray(visualizationFilters).join('&');
  if (url.split('&').length <= 1 && parameters.split('&').length <= 1) {
    return '';
  }

  if (parameters !== '') {
    url += parameters;
  }
  url += value !== '' || value !== undefined ? value : '';
  url += aggregationType !== '' ? aggregationType : '';
  url += getAnalyticsCallStrategies(visualizationType, null);
  return url;
}

function getAnalyticsCallStrategies(visualizationType, layerType: string = null): string {
  let strategies = '';
  strategies += visualizationType === 'EVENT_CHART' ||
  visualizationType === 'EVENT_REPORT' || visualizationType === 'EVENT_MAP' ? '&outputType=EVENT' : '';
  strategies += '&displayProperty=NAME';
  strategies += layerType !== null && layerType === 'event' ? '&coordinatesOnly=true' : '';
  return strategies;
}

function getProgramParameters(favoriteObject: any): string {
  let params = '';
  if (favoriteObject.hasOwnProperty('program') && favoriteObject.hasOwnProperty('programStage')) {

    if (favoriteObject.program.hasOwnProperty('id') && favoriteObject.programStage.hasOwnProperty('id')) {
      params = favoriteObject.program.id + '.json?stage=' + favoriteObject.programStage.id + '&';
    }
  }
  return params;
}

function getParametersArray(filters: any[]) {
  return _.filter(_.map(filters, (filter) => {
    return filter.value !== '' ? 'dimension=' + filter.name + ':' + filter.value :
      ['dx', 'pe', 'ou'].indexOf(filter.name) === -1 ? 'dimension=' + filter.name : '';
  }), param => param !== '');
}
