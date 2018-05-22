import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Visualization } from '../../models';
import { VisualizationObjectAction, VisualizationObjectActionTypes } from '../actions/visualization-object.actions';

export interface VisualizationObjectState extends EntityState<Visualization> {

}

export const visualizationObjectAdapter: EntityAdapter<Visualization> = createEntityAdapter<Visualization>();

const initialState: VisualizationObjectState = visualizationObjectAdapter.getInitialState({

})

export function visualizationObjectReducer(state: VisualizationObjectState = initialState, action: VisualizationObjectAction): VisualizationObjectState {
  switch (action.type) {
    case VisualizationObjectActionTypes.ADD_ALL_VISUALIZATION_OBJECTS:
      return visualizationObjectAdapter.addAll(action.visualizationObjects, state);
    case VisualizationObjectActionTypes.UPDATE_VISUALIZATION_OBJECT:
      return visualizationObjectAdapter.updateOne({id: action.id, changes: action.changes}, state)
  }
  return state;
}
