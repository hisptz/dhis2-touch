import { createSelector } from '@ngrx/store';
import { getDashboardObjectEntities, getDashboardObjectState } from '../reducers';
import { getCurrentDashboardState, getDashboardLoadingState } from '../reducers/dashboard.reducers';

export const getCurrentDashboardId = createSelector(getDashboardObjectState, getCurrentDashboardState);

export const getCurrentDashboard = createSelector(getDashboardObjectEntities, getCurrentDashboardId,
  (dashboardEntities, currentDashboardId) => dashboardEntities[currentDashboardId]);

export const getDashboardLoadingStatus = createSelector(getDashboardObjectState, getDashboardLoadingState)
