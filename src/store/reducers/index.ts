import {ActionReducerMap} from '@ngrx/store';
import {currentUserReducer, CurrentUserState} from "./currentUser.reducers";
import * as fromDashboardReducer from './dashboard.reducer';
import * as fromVisualizationReducer from './visualization.reducer';

export interface ApplicationState{
  currentUser : CurrentUserState,
  dashboard: fromDashboardReducer.DashboardState
  visualization: fromVisualizationReducer.VisualizationState;
}

export const reducers: ActionReducerMap<ApplicationState> = {
  currentUser : currentUserReducer,
  dashboard: fromDashboardReducer.dashboardReducer,
  visualization: fromVisualizationReducer.visualizationReducer
};


export const getCurrentUserState = (state: ApplicationState) => state.currentUser;
export const getVisualizationState = (state: ApplicationState) => state.visualization;
export const getDashboardState = (state: ApplicationState) => state.dashboard;
