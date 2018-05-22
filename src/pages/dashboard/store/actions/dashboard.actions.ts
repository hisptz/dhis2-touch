import { Action } from '@ngrx/store';

export enum DashboardActionTypes {
  LOAD_DASHBOARDS = '[Dashboard] Load dashboards',
  LOAD_DASHBOARDS_SUCCESS = '[Dashboard] Load dashboards success',
  LOAD_DASHBOARDS_FAIL = '[Dashboard] Load dashboards fail',
  SET_CURRENT_DASHBOARD = '[Dashboard] Set current dashboard',
}

export class LoadDashboardsAction implements Action {
  readonly type = DashboardActionTypes.LOAD_DASHBOARDS;
}

export class LoadDashboardsSuccessAction implements Action {
  readonly type = DashboardActionTypes.LOAD_DASHBOARDS_SUCCESS;

  constructor(public dashboards: any[]) {
  }
}

export class LoadDashboardsFailAction implements Action {
  readonly type = DashboardActionTypes.LOAD_DASHBOARDS_FAIL;

  constructor(public dashboardError: any) {
  }
}

export class SetCurrentDashboardAction implements Action {
  readonly type = DashboardActionTypes.SET_CURRENT_DASHBOARD;

  constructor(public id: string) {
  }
}

export type DashboardAction =
  LoadDashboardsAction
  | LoadDashboardsSuccessAction
  | LoadDashboardsFailAction
  | SetCurrentDashboardAction
