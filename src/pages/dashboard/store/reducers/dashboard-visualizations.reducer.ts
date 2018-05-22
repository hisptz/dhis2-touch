import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import {
  DashboardVisualizationAction,
  DashboardVisualizationActionTypes
} from '../actions/dashboard-visualization.actions';
import { DashboardVisualization } from '../../models/dashboard-visualization.model';

export interface DashboardVisualizationState extends EntityState<DashboardVisualization> {

}

export const dashboardVisualizationAdapter: EntityAdapter<DashboardVisualization> = createEntityAdapter<DashboardVisualization>();

const initialState: DashboardVisualizationState = dashboardVisualizationAdapter.getInitialState({});

export function dashboardVisualizationReducer(state: DashboardVisualizationState = initialState,
  action: DashboardVisualizationAction): DashboardVisualizationState {
  switch (action.type) {
    case DashboardVisualizationActionTypes.ADD_ALL_DASHBOARD_VISUALIZATIONS:
      return dashboardVisualizationAdapter.addAll(action.dashboardVisualizations, state);
  }
  return state;
}
