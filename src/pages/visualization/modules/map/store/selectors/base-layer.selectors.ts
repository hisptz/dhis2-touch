import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import { LegendSet } from '../../models/Legend-set.model';
import * as fromBaseLayerReducer from '../reducers/base-layer.reducers';

export const getBaseLayerObjectState = createSelector(
  fromFeature.getMapState,
  (state: fromFeature.MapState) => state.baselayerLegend
);

export const getAllBaseLayerObjectEntities = createSelector(
  getBaseLayerObjectState,
  fromBaseLayerReducer.getBaseLayerEntities
);

export const getCurrentBaseLayer = id =>
  createSelector(getAllBaseLayerObjectEntities, entities => entities[id]);

export const getAllBaseLayerObject = createSelector(getAllBaseLayerObjectEntities, entities => {
  return Object.keys(entities).map(id => entities[id]);
});
