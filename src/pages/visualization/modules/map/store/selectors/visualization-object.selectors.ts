import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import { VisualizationObject } from '../../models/visualization-object.model';
import * as fromVisualizationObject from '../reducers/visualization-object.reducers';
import * as fromLayers from '../reducers/layers.reducer';

export const getVisualizationObjectState = createSelector(
  fromFeature.getMapState,
  (state: fromFeature.MapState) => state.visualizationObjects
);

export const getAllVisualizationObjectsEntities = createSelector(
  getVisualizationObjectState,
  fromVisualizationObject.getVisualizationObjectsEntities
);
export const _getCurrentMap = createSelector(
  getVisualizationObjectState,
  fromVisualizationObject.getCurrentMap
);
export const getAllVisualizationObjects = createSelector(
  getAllVisualizationObjectsEntities,
  entities => {
    return Object.keys(entities).map(id => entities[id]);
  }
);
export const getCurrentMap = createSelector(
  getAllVisualizationObjectsEntities,
  _getCurrentMap,
  (entities, currentMap): VisualizationObject => {
    return entities[currentMap];
  }
);

export const getCurrentMapLayers = createSelector(
  getAllVisualizationObjectsEntities,
  fromLayers.getLayersEntities,
  _getCurrentMap,
  (entities, layerEntities, currentMap): VisualizationObject => {
    return entities[currentMap].layers.map(id => layerEntities[id]);
  }
);

export const isVisualizationObjectsLoading = createSelector(
  getVisualizationObjectState,
  fromVisualizationObject.getVisualizationObjectsLoading
);

export const isVisualizationObjectsLoaded = createSelector(
  getVisualizationObjectState,
  fromVisualizationObject.getVisualizationObjectsLoaded
);

export const getCurrentVisualizationObject = id =>
  createSelector(getAllVisualizationObjectsEntities, entities => entities[id]);
