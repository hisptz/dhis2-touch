import { Action } from '@ngrx/store';
import { VisualizationUiConfig } from '../../models/visualization-ui-config.model';

export enum VisualizationUiConfigurationActionTypes {
  ADD_ALL_VISUALIZATION_UI_CONFIGURATIONS = '[VisualizationUIConfig] Add all visualization Ui configurations',
  SHOW_OR_HIDE_VISUALIZATION_BODY = '[VisualizationUIConfig] show or hide visualization body',
  TOGGLE_FULL_SCREEN = '[VisualizationUIConfig] toggle full screen'
}

export class AddAllVisualizationUiConfigurationsAction implements Action {
  readonly type = VisualizationUiConfigurationActionTypes.ADD_ALL_VISUALIZATION_UI_CONFIGURATIONS;

  constructor(public visualizationUiConfigurations: VisualizationUiConfig[]) {
  }
}

export class ShowOrHideVisualizationBodyAction implements Action {
  readonly type = VisualizationUiConfigurationActionTypes.SHOW_OR_HIDE_VISUALIZATION_BODY;

  constructor(public id: string, public changes: Partial<VisualizationUiConfig>) {
  }
}

export class ToggleFullScreenAction implements Action {
  readonly type = VisualizationUiConfigurationActionTypes.TOGGLE_FULL_SCREEN;

  constructor(public id: string) {
  }
}

export type VisualizationUiConfigurationAction =
  AddAllVisualizationUiConfigurationsAction
  | ShowOrHideVisualizationBodyAction
  | ToggleFullScreenAction;
