import { Action } from '@ngrx/store';
import { VisualizationLayer } from '../../models/visualization-layer.model';

export enum VisualizationLayerActionTypes {
  ADD_VISUALIZATION_LAYER = '[VisualizationLayer] Add visualization layer',
  UPDATE_VISUALIZATION_LAYER = '[VisualizationLayer] Update visualization layer',
  LOAD_VISUALIZATION_ANALYTICS = '[VisualizationLayer] Load visualization analytics',
  LOAD_VISUALIZATION_ANALYTICS_SUCCESS = '[VisualizationLayer] Load visualization analytics success',
  LOAD_VISUALIZATION_ANALYTICS_FAIL = '[VisualizationLayer] Load visualization analytics fail',
}

export class AddVisualizationLayerAction implements Action {
  readonly type = VisualizationLayerActionTypes.ADD_VISUALIZATION_LAYER;

  constructor(public visualizationLayer: VisualizationLayer) {
  }
}

export class UpdateVisualizationLayerAction implements Action {
  readonly type = VisualizationLayerActionTypes.UPDATE_VISUALIZATION_LAYER;
  constructor(public visualizationLayer: VisualizationLayer) {}
}

export class LoadVisualizationAnalyticsAction implements Action {
  readonly type = VisualizationLayerActionTypes.LOAD_VISUALIZATION_ANALYTICS;

  constructor(public visualizationId: string, public visualizationLayers: VisualizationLayer[]) {
  }
}

export class LoadVisualizationAnalyticsSuccessAction implements Action {
  readonly type = VisualizationLayerActionTypes.LOAD_VISUALIZATION_ANALYTICS_SUCCESS;

  constructor(public id: string, public changes: Partial<VisualizationLayer>) {
  }
}

export class LoadVisualizationAnalyticsFailAction implements Action {
  readonly type = VisualizationLayerActionTypes.LOAD_VISUALIZATION_ANALYTICS_FAIL;

  constructor(public id: string, public error: any) {
  }
}

export type VisualizationLayerAction =
  AddVisualizationLayerAction
  | LoadVisualizationAnalyticsAction
  | LoadVisualizationAnalyticsSuccessAction
  | LoadVisualizationAnalyticsFailAction;
