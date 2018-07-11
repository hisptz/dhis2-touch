import * as _ from 'lodash';
import { VisualizationDataSelection } from '../models/visualization-data-selection.model';

// TODO Find best standard for config structure so that layerType can be obtained direct from config object
export function getAnalyticsUrl(dataSelections: VisualizationDataSelection[], layerType: string,
  config?: any): string {
  return layerType === 'thematic' ? getAggregateAnalyticsUrl(dataSelections, layerType, config) :
    getEventAnalyticsUrl(dataSelections, layerType, config);
}

function flattenDimensions(dataSelections: VisualizationDataSelection[]): string {
  const isEligibleForAnalytics = _.filter(
    _.map(dataSelections, dataSelection => ['ou', 'pe'].indexOf(dataSelection.dimension) !== -1),
    isEligible => isEligible).length === 2;

  if (!isEligibleForAnalytics) {
    return '';
  }
  const dimensions = _.filter(_.map(dataSelections, (dataSelection: VisualizationDataSelection) => {
    const selectionValues = dataSelection.filter ? dataSelection.filter :
      _.map(dataSelection.items, item => item.id).join(';');
    return selectionValues !== '' ? 'dimension=' + dataSelection.dimension + ':' + selectionValues :
      ['dx', 'ou', 'pe'].indexOf(dataSelection.dimension) === -1 ?
        'dimension=' + dataSelection.dimension + (dataSelection.legendSet ? '-' + dataSelection.legendSet : '') : '';
  }), dimension => dimension !== '');

  return dimensions.join('&');
}

function getAggregateAnalyticsUrl(dataSelections: VisualizationDataSelection[], layerType: string,
  config?: any): string {
  const flattenedDimensionString = flattenDimensions(dataSelections);
  return flattenedDimensionString !== '' ?
    'analytics.json?' + flattenedDimensionString + getAnalyticsUrlOptions(config, layerType) : '';
}

function getAnalyticsUrlOptions(config: any, layerType: string) {
  if (!config && !layerType) {
    return '';
  }

  const displayPropertySection = config.displayNameProperty ? '&displayProperty=' + config.displayNameProperty : '';

  const aggregrationTypeSection = config ?
    config.aggregationType && config.aggregationType !== 'DEFAULT' ? '&aggregationType=' + config.aggregationType : '' :
    '';

  const valueSection = config.value ? '&value' + config.value.id : '';

  const outputType = layerType === 'event' ? '&outputType=EVENT' : '';

  const coordinateSection = layerType === 'event' ? '&coordinatesOnly=true' : '';

  return displayPropertySection + aggregrationTypeSection + valueSection + outputType + coordinateSection;
}

function getEventAnalyticsUrl(dataSelections: VisualizationDataSelection[], layerType: string, config: any) {
  const flattenedDimensionString = flattenDimensions(dataSelections);
  const analyticsUrlFields = flattenedDimensionString !== '' ? getEventAnalyticsUrlSection(
    config) + getProgramParameters(config) + getEventAnalyticsStartAndEndDateSection(config) + flattenDimensions(
    dataSelections) + getAnalyticsUrlOptions(config, layerType) : '';
  return analyticsUrlFields !== '' ? 'analytics/events/' + analyticsUrlFields : '';
}

function getProgramParameters(config: any): string {
  return config ? config.program && config.programStage ? config.program.id && config.programStage.id ?
    config.program.id + '.json?stage=' + config.programStage.id + '&' : '' : '' : '';
}

function getEventAnalyticsUrlSection(config) {
  switch (config.visualizationType) {
    case 'EVENT_CHART':
      return 'aggregate/';
    case 'EVENT_REPORT':
      return config.dataType === 'AGGREGATED_VALUES' ? 'aggregate/' : 'query/';
    default:
      return !config.aggregate ? config.eventClustering ? 'count/' : 'query/' : 'aggregate/';
  }

}

function getEventAnalyticsStartAndEndDateSection(config: any) {
  return config && config.startDate && config.endDate ?
    'startDate=' + config.startDate + '&' + 'endDate=' + config.endDate + '&' : '';
}
