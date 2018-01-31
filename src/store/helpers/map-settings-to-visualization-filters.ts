import {getDimensionValues} from './get-dimension-values.helpers';

export function mapSettingsToVisualizationFilters(visualizationSettings: any) {
  const visualizationFilters: any = [
    ...getDimensionValues(visualizationSettings.rows, visualizationSettings.dataElementDimensions),
    ...getDimensionValues(visualizationSettings.columns, visualizationSettings.dataElementDimensions),
    ...getDimensionValues(visualizationSettings.filters, visualizationSettings.dataElementDimensions)
  ];
  return visualizationFilters;
}
