import { Action } from '@ngrx/store';
import { DashboardVisualization } from '../../models/dashboard-visualization.model';

export enum DashboardVisualizationActionTypes {
  ADD_ALL_DASHBOARD_VISUALIZATIONS = '[DashboardVisualization] Add all dashboard visualizations'
}

export class AddAllDashboardVisualizationAction implements Action {
  readonly type = DashboardVisualizationActionTypes.ADD_ALL_DASHBOARD_VISUALIZATIONS;
  constructor(public dashboardVisualizations: DashboardVisualization[]) {}
}

export type DashboardVisualizationAction = AddAllDashboardVisualizationAction;
