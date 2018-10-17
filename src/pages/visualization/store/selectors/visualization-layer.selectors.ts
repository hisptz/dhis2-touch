import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import {
  getVisualizationObjectEntities,
  getVisualizationLayerEntities,
  getVisualizationUiConfigurationEntities
} from '../reducers';
import { Visualization } from '../../models/visualization.model';
import { VisualizationUiConfig } from '../../models/visualization-ui-config.model';
import { VisualizationLayer } from '../../models/visualization-layer.model';
import { getVisualizationMetadataIdentifiers } from '../../helpers/get-visualization-metadata-identifier.helper';
import { getVisualizationLayout } from '../../helpers/get-visualization-layout.helper';

export const getCurrentVisualizationObjectLayers = (visualizationId: string) =>
  createSelector(
    getVisualizationObjectEntities,
    getVisualizationLayerEntities,
    getVisualizationUiConfigurationEntities,
    (
      visualizationObjectEntities,
      visualizationLayerEntities,
      visualizationUiConfigurationEntities
    ) => {
      const currentVisualizationObject: Visualization =
        visualizationObjectEntities[visualizationId];
      if (!currentVisualizationObject) {
        return [];
      }

      const currentVisualizationUiConfiguration: VisualizationUiConfig =
        visualizationUiConfigurationEntities[
          currentVisualizationObject.uiConfigId
        ];
      return currentVisualizationUiConfiguration.showBody
        ? _.map(
            _.filter(
              _.map(
                currentVisualizationObject.layers,
                (layerId: string) => visualizationLayerEntities[layerId]
              ),
              (layer: VisualizationLayer) => layer
            ),
            (visualizationLayer: any) => {
              return {
                ...visualizationLayer,
                metadataIdentifiers: getVisualizationMetadataIdentifiers(
                  visualizationLayer.dataSelections
                ),
                layout: getVisualizationLayout(
                  visualizationLayer.dataSelections
                )
              };
            }
          )
        : [];
    }
  );
