import { VisualizationUiConfig } from '../../models/visualization-ui-config.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import {
  VisualizationUiConfigurationAction,
  VisualizationUiConfigurationActionTypes
} from '../actions/visualization-ui-configuration.actions';

export interface VisualizationUiConfigurationState extends EntityState<VisualizationUiConfig> {
}

export const visualizationUiConfigurationAdapter: EntityAdapter<VisualizationUiConfig> = createEntityAdapter<VisualizationUiConfig>();

const initialState: VisualizationUiConfigurationState = visualizationUiConfigurationAdapter.getInitialState({});

export function visualizationUiConfigurationReducer(state: VisualizationUiConfigurationState = initialState,
  action: VisualizationUiConfigurationAction): VisualizationUiConfigurationState {
  switch (action.type) {
    case VisualizationUiConfigurationActionTypes.ADD_ALL_VISUALIZATION_UI_CONFIGURATIONS:
      return visualizationUiConfigurationAdapter.addAll(action.visualizationUiConfigurations, state);
    case VisualizationUiConfigurationActionTypes.SHOW_OR_HIDE_VISUALIZATION_BODY:
      return visualizationUiConfigurationAdapter.updateOne({id: action.id, changes: action.changes}, state);
    case VisualizationUiConfigurationActionTypes.TOGGLE_FULL_SCREEN:
      const visualizationUiConfig = state.entities[action.id];
      return visualizationUiConfig ? visualizationUiConfigurationAdapter.updateOne({
          id: action.id, changes: {
            fullScreen: !visualizationUiConfig.fullScreen,
            height: visualizationUiConfig.fullScreen ? '450px' : '99vh'
          }
        }, state) :
        state;
  }
  return state;
}
