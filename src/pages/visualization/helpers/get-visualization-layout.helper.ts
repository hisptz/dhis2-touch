import { VisualizationDataSelection } from '../models/visualization-data-selection.model';
import * as _ from 'lodash';
import { VisualizationLayout } from '../models/visualization-layout.model';

export function getVisualizationLayout(dataSelections: VisualizationDataSelection[]): VisualizationLayout {
  if (!dataSelections) {
    return null;
  }
  const groupedLayout = _.groupBy(_.map(dataSelections, dataSelection => {
    return {dimension: dataSelection.dimension, layout: dataSelection.layout};
  }), 'layout');

  return getStandardizedLayout(groupedLayout);
}

function getStandardizedLayout(layoutObject: any): VisualizationLayout {
  const layoutKeys = _.keys(layoutObject);
  const newLayout: VisualizationLayout = {rows: [], columns: [], filters: []};
  _.each(layoutKeys, layoutKey => {
    const layouts = layoutObject[layoutKey];
    newLayout[layoutKey] = _.map(layouts, layout => layout.dimension);
  });
  return newLayout;
}
