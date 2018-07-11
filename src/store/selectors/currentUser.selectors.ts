
import { createSelector } from '@ngrx/store';
import {getCurrentUserData, getCurrentUserLoading} from "../reducers/currentUser.reducers";
import {getCurrentUserState} from "../reducers/index";


export const getCurrentUser = createSelector(
  getCurrentUserState,getCurrentUserData
);

export const getCurrentUserLoadingStatus = createSelector(
  getCurrentUserState,getCurrentUserLoading
);
