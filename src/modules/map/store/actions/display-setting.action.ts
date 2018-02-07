import { Action } from '@ngrx/store';
import { DisplaySettings } from '../../models/display-settings.model';

export const ADD_DISPLAY_SETTING = '[Map] Add display settings';
export const UPDATE_DISPLAY_SETTING = '[Map] Update display settings';

export class AddDisplaySetting implements Action {
  readonly type = ADD_DISPLAY_SETTING;
  constructor(public payload: DisplaySettings) {}
}

export class UpdateDisplaySetting implements Action {
  readonly type = UPDATE_DISPLAY_SETTING;
  constructor(public payload: DisplaySettings) {}
}

// action types
export type DisplaySettingActions = AddDisplaySetting | UpdateDisplaySetting;
