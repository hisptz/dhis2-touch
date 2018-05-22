import {
  getVisualizationObjectEntities,
  getVisualizationConfigurationEntities
} from '../reducers';
import { createSelector } from '@ngrx/store';
import { Visualization } from '../../models/visualization.model';
export const getCurrentVisualizationConfig = (visualizationId: string) => createSelector(
  getVisualizationObjectEntities, getVisualizationConfigurationEntities,
  (visualizationObjectEntities, visualizationConfigurationEntities) => {
    const currentVisualizationObject: Visualization = visualizationObjectEntities[visualizationId];
    if (!currentVisualizationObject) {
      return null;
    }

    return visualizationConfigurationEntities[currentVisualizationObject.visualizationConfigId]
  });
