import { VisualizationLayer } from '../../models/visualization-layer.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { VisualizationLayerActionTypes } from '../actions/visualization-layer.actions';

export interface VisualizationLayerState extends EntityState<VisualizationLayer> {
}

export const visualizationLayerAdapter: EntityAdapter<VisualizationLayer> = createEntityAdapter<VisualizationLayer>();

const initialState: VisualizationLayerState = visualizationLayerAdapter.getInitialState({});

export function visualizationLayerReducer(state: VisualizationLayerState = initialState,
  action: any): VisualizationLayerState {
  switch (action.type) {
    case VisualizationLayerActionTypes.ADD_VISUALIZATION_LAYER:
      return visualizationLayerAdapter.addOne(action.visualizationLayer, state);
    case VisualizationLayerActionTypes.LOAD_VISUALIZATION_ANALYTICS_SUCCESS:
      return visualizationLayerAdapter.updateOne({id: action.id, changes: action.changes}, state);
    case VisualizationLayerActionTypes.UPDATE_VISUALIZATION_LAYER:
      return visualizationLayerAdapter.updateOne(
        {id: action.visualizationLayer.id, changes: action.visualizationLayer}, state);
  }
  return state;
}
