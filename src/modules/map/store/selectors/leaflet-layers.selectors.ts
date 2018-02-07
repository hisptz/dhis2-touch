import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromLayers from '../reducers/layers.reducer';

export const getLayerState = createSelector(
  fromFeature.getMapState,
  (state: fromFeature.MapState) => state.leafletLayers
);

export const getAllLayersEntities = createSelector(getLayerState, fromLayers.getLayersEntities);
export const getAllLayers = createSelector(getAllLayersEntities, entities => {
  return Object.keys(entities).map(id => entities[id]);
});
export const isLayersLoading = createSelector(getLayerState, fromLayers.getLayerLoading);
export const isLayersLoaded = createSelector(getLayerState, fromLayers.getLayerLoaded);
