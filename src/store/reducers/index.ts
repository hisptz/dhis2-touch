import { ActionReducerMap } from '@ngrx/store';
import { currentUserReducer, CurrentUserState } from './currentUser.reducers';

export interface ApplicationState {
  currentUser: CurrentUserState;
}

export const reducers: ActionReducerMap<ApplicationState> = {
  currentUser: currentUserReducer
};

export const getCurrentUserState = (state: ApplicationState) =>
  state.currentUser;
