import { createSelector } from '@ngrx/store';
import { getDashboardVisualizationsEntities } from '../reducers';
import { getCurrentDashboardId } from './dashboard.selectors';

export const getCurrentDashboardVisualizations = createSelector(getDashboardVisualizationsEntities,
  getCurrentDashboardId, (dashboardVisualizationEntities, currentDashboardId) => {
    const dashboardVisualizations = dashboardVisualizationEntities[currentDashboardId];
    return dashboardVisualizations ? dashboardVisualizations.items : [];
  });
