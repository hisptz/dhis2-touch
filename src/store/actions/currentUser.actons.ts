import { Action } from '@ngrx/store';
import {CurrentUser} from "../../models/currentUser";

export const LOADED_CURRENT_USER = "[Current user] Loaded current user";

export class LoadedCurrentUser implements Action{
  readonly type = LOADED_CURRENT_USER;
  constructor(public payload : CurrentUser){}
}

export type CurrentUserActions = LoadedCurrentUser;


