import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromVisualizationLegend from '../reducers/visualization-legend.reducers';

export const getVisualizationLegendState = createSelector(
  fromFeature.getMapState,
  (state: fromFeature.MapState) => state.visualizationLegend
);

export const getAllVisualizationLegendEntities = createSelector(
  getVisualizationLegendState,
  fromVisualizationLegend.getVisualizationLegendEntities
);

export const isVisualizationLegendOpen = id =>
  createSelector(getAllVisualizationLegendEntities, entities => entities[id].open);

export const isVisualizationLegendPinned = id =>
  createSelector(getAllVisualizationLegendEntities, entities => entities[id].pinned);

export const isVisualizationLegendFilterSectionOpen = id =>
  createSelector(getAllVisualizationLegendEntities, entities => entities[id].filterSectionOpen);
