
import {CurrentUser} from "../../models/currentUser";
import * as fromCurrentUserActions from "../actions/currentUser.actons";

export interface CurrentUserState {
  data : CurrentUser;
  loading : boolean;
  loaded : boolean;
}

export const initialState : CurrentUserState = {
  data : {
    username : "admin",
    password : "",
    serverUrl : "",
    currentLanguage : "en"
  },
  loading : false,
  loaded : false
};

export function currentUserReducer ( state : CurrentUserState = initialState, action : fromCurrentUserActions.CurrentUserActions){

  switch(action.type){
    case fromCurrentUserActions.LOADED_CURRENT_USER : {
      return {
        loading:false,loaded : true, data : action.payload
      }
    }
  }

  return state;
}

export const getCurrentUserLoading= (state: CurrentUserState) => state.loading;
export const getCurrentUserData= (state: CurrentUserState) => state.data;
