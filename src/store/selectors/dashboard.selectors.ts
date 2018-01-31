import {createSelector} from '@ngrx/store';
import * as _ from 'lodash';
import {getDashboardState} from '../reducers/index';
import {DashboardState} from '../reducers/dashboard.reducer';
import {Dashboard} from '../../models/dashboard';
import {DashboardMenuItem} from '../../models/dashboard-menu-item';

export const getCurrentDashboardPage = createSelector(getDashboardState, (dashboardObject: DashboardState) =>
  dashboardObject.currentDashboardPage);

export const getDashboardPages = createSelector(getDashboardState, (dashboardObject: DashboardState) =>
  dashboardObject.dashboardPageNumber);

export const getCurrentDashboard = createSelector(getDashboardState, (dashboardObject: DashboardState) =>
  _.find(dashboardObject.dashboards, ['id', dashboardObject.currentDashboard]));

export const getDashboardSearchItems = createSelector(getDashboardState, (dashboardObject: DashboardState) => {
  return {
    ...dashboardObject.dashboardSearchItem,
    results: dashboardObject.dashboardSearchItem.results.filter(result => result.selected)
  };
});
export const getCurrentDashboardSharing = createSelector(getDashboardState,
  (dashboardObject: DashboardState) => dashboardObject.dashboardSharing[dashboardObject.currentDashboard]);

export const getDashboardMenuItems = createSelector(getDashboardState,
  (dashboardObject: DashboardState) => !dashboardObject.preferPaginatedDashboards ?
    dashboardObject.activeDashboards :
    dashboardObject.activeDashboards.length > 0 ?
    dashboardObject.activeDashboards.slice(
    getStartItemIndex(dashboardObject.currentDashboardPage, dashboardObject.dashboardPerPage),
    getEndItemIndex(dashboardObject.currentDashboardPage, dashboardObject.dashboardPerPage) + 1)
    .map((dashboard: Dashboard) => mapStateToDashboardMenu(dashboard)) : []);

export const getShowBookmarkedStatus = createSelector(getDashboardState,
  (dashboardObject: DashboardState) => dashboardObject.showBookmarked);

export const getDashboardLoadingStatus = createSelector(getDashboardState,
  (dashboardObject: DashboardState) => dashboardObject.loading);

function getStartItemIndex(pageNumber: number, pageSize: number) {
  return (pageSize * pageNumber) - pageSize;
}

function getEndItemIndex(pageNumber: number, pageSize: number) {
  return (pageSize * pageNumber) - 1;
}

function mapStateToDashboardMenu(dashboard: Dashboard): DashboardMenuItem {
  return {
    id: dashboard.id,
    name: dashboard.name,
    details: dashboard.details
  };
}
