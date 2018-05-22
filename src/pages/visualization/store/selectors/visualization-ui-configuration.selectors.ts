import {
  getVisualizationObjectEntities,
  getVisualizationUiConfigurationEntities
} from '../reducers';
import { createSelector } from '@ngrx/store';
import { Visualization } from '../../models/visualization.model';
export const getCurrentVisualizationUiConfig = (visualizationId: string) => createSelector(
  getVisualizationObjectEntities, getVisualizationUiConfigurationEntities,
  (visualizationObjectEntities, visualizationUiConfigurationEntities) => {
    const currentVisualizationObject: Visualization = visualizationObjectEntities[visualizationId];
    if (!currentVisualizationObject) {
      return null;
    }

    return visualizationUiConfigurationEntities[currentVisualizationObject.uiConfigId]
  });
