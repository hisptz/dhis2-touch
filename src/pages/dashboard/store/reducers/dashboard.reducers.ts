import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Dashboard } from '../../models/dashboard.model';
import { DashboardAction, DashboardActionTypes } from '../actions/dashboard.actions';
import { getStandardizedDashboards } from '../../helpers';

export interface DashboardObjectState extends EntityState<Dashboard> {
  loaded: boolean;
  loading: boolean;
  currentDashboard: string;
  error: any;
  hasError: boolean;
}

export const dashboardAdapter: EntityAdapter<Dashboard> = createEntityAdapter<Dashboard>();

const initialState: DashboardObjectState = dashboardAdapter.getInitialState({
  loaded: false,
  loading: false,
  currentDashboard: '',
  error: null,
  hasError: false
});

export function dashboardObjectReducer(state: DashboardObjectState = initialState,
  action: DashboardAction): DashboardObjectState {
  switch (action.type) {
    case DashboardActionTypes.LOAD_DASHBOARDS:
      return {...state, loading: true, hasError: false, error: null, loaded: false};
    case DashboardActionTypes.LOAD_DASHBOARDS_SUCCESS:
      return dashboardAdapter.addAll(getStandardizedDashboards(action.dashboards),
        {...state, loading: false, loaded: true});
    case DashboardActionTypes.LOAD_DASHBOARDS_FAIL:
      return {...state, loading: false, loaded: true, hasError: true, error: action.dashboardError};
    case DashboardActionTypes.SET_CURRENT_DASHBOARD:
      return {...state, currentDashboard: action.id};
  }
  return state;
}


// expose other selectors
export const getDashboardLoadingState = (state: DashboardObjectState) => state.loading;
export const getDashboardLoadedState = (state: DashboardObjectState) => state.loaded;
export const getDashboardHasErrorState = (state: DashboardObjectState) => state.hasError;
export const getDashboardErrorState = (state: DashboardObjectState) => state.error;
export const getCurrentDashboardState = (state: DashboardObjectState) => state.currentDashboard;
