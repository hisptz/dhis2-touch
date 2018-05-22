import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import {
  visualizationObjectAdapter, visualizationObjectReducer,
  VisualizationObjectState
} from './visualization-object.reducer';
import {
  visualizationLayerAdapter, visualizationLayerReducer,
  VisualizationLayerState
} from './visualization-layer.reducer';
import {
  visualizationUiConfigurationAdapter,
  visualizationUiConfigurationReducer,
  VisualizationUiConfigurationState
} from './visualization-ui-configuration.reducer';
import {
  visualizationConfigurationAdapter, visualizationConfigurationReducer,
  VisualizationConfigurationState
} from './visualization-configuration.reducer';

export interface VisualizationState {
  visualizationObject: VisualizationObjectState;
  visualizationLayer: VisualizationLayerState;
  visualizationUiConfiguration: VisualizationUiConfigurationState;
  visualizationConfiguration: VisualizationConfigurationState;
}

export const reducers: ActionReducerMap<VisualizationState> = {
  visualizationObject: visualizationObjectReducer,
  visualizationLayer: visualizationLayerReducer,
  visualizationUiConfiguration: visualizationUiConfigurationReducer,
  visualizationConfiguration: visualizationConfigurationReducer
};

export const getVisualizationState = createFeatureSelector<VisualizationState>('visualization');

// General selector for visualization object
export const getVisualizationObjectState = createSelector(getVisualizationState,
  (state: VisualizationState) => state.visualizationObject);

export const {
  selectEntities: getVisualizationObjectEntities,
  selectAll: getAllVisualizationObjects
} = visualizationObjectAdapter.getSelectors(getVisualizationObjectState);

// General selector for visualization layers
export const getVisualizationLayerState = createSelector(getVisualizationState,
  (state: VisualizationState) => state.visualizationLayer);

export const {
  selectEntities: getVisualizationLayerEntities,
  selectAll: getAllVisualizationLayers
} = visualizationLayerAdapter.getSelectors(getVisualizationLayerState);

// General selector for visualization ui configurations
export const getVisualizationUiConfigurationState = createSelector(getVisualizationState,
  (state: VisualizationState) => state.visualizationUiConfiguration);

export const {
  selectEntities: getVisualizationUiConfigurationEntities
} = visualizationUiConfigurationAdapter.getSelectors(getVisualizationUiConfigurationState);

// General selector for visualization configurations
export const getVisualizationConfigurationState = createSelector(getVisualizationState,
  (state: VisualizationState) => state.visualizationConfiguration);

export const {
  selectEntities: getVisualizationConfigurationEntities
} = visualizationConfigurationAdapter.getSelectors(getVisualizationConfigurationState);
