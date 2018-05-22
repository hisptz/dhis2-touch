import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardObjectState, dashboardObjectReducer, dashboardAdapter } from './dashboard.reducers';
import {
  dashboardVisualizationAdapter, dashboardVisualizationReducer,
  DashboardVisualizationState
} from './dashboard-visualizations.reducer';

export interface DashboardState {
  dashboard: DashboardObjectState;
  dashboardVisualizations: DashboardVisualizationState;
}

export const reducers: ActionReducerMap<DashboardState> = {
  dashboard: dashboardObjectReducer,
  dashboardVisualizations: dashboardVisualizationReducer
};

export const getDashboardState = createFeatureSelector<DashboardState>('dashboard');

// General selector for dashboards
export const getDashboardObjectState = createSelector(getDashboardState,
  (state: DashboardState) => state.dashboard);

export const {
  selectAll: getAllDashboards,
  selectEntities: getDashboardObjectEntities
} = dashboardAdapter.getSelectors(getDashboardObjectState);

// General selector for dashboard visualizations
export const getDashboardVisualizationState = createSelector(getDashboardState,
  (state: DashboardState) => state.dashboardVisualizations);

export const {
  selectAll: getAllDashboardVisualizations,
  selectEntities: getDashboardVisualizationsEntities
} = dashboardVisualizationAdapter.getSelectors(getDashboardVisualizationState);

