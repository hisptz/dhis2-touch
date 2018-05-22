import { createSelector } from '@ngrx/store';
import { getVisualizationObjectEntities } from '../reducers';
import { Visualization } from '../../models/visualization.model';

export const getVisualizationObjectById = (id) => createSelector(getVisualizationObjectEntities,
  (visualizationObjectEntity) => visualizationObjectEntity[id]);

export const getCurrentVisualizationProgress = (id) => createSelector(getVisualizationObjectEntities,
  (visualizationObjectEntity) => {
    const currentVisualizationObject: Visualization = visualizationObjectEntity[id];

    return currentVisualizationObject ?  currentVisualizationObject.progress : null;
  });

