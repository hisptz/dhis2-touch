import { Action } from '@ngrx/store';
import { LegendSet } from '../../models/Legend-set.model';

// add Context Path
export const ADD_LEGEND_SET = '[MAP] Add Legend Set';
export const ADD_LEGEND_SET_FAIL = '[MAP] Add Legend Set Fail';
export const ADD_LEGEND_SET_SUCCESS = '[MAP] Add Legend Set Success';
export const LOAD_LEGEND_SET_ALL = '[MAP] Load All Legend Set';
export const LOAD_LEGEND_SET_ALL_SUCCESS = '[MAP] Load All Legend Set Success';
export const LOAD_LEGEND_SET_ALL_FAIL = '[MAP] Load All Legend Set Fail';
export const LOAD_LEGEND_SET = '[MAP] Load Legend Set';
export const LOAD_LEGEND_SET_SUCCESS = '[MAP] Load Legend Set Success';
export const LOAD_LEGEND_SET_FAIL = '[MAP] Load Legend Set Fail';
export const UPDATE_LEGEND_SET = '[MAP] Update Legend Set';
export const UPDATE_LEGEND_SET_FAIL = '[MAP] Update Legend Set Fail';
export const UPDATE_LEGEND_SET_SUCCESS = '[MAP] Update Legend Set Success';
export const CHANGE_LEGEND_SET_LAYER_OPACITY = '[MAP] Change Legend Set Opacity';
export const CHANGE_LEGEND_SET_LAYER_VISIBILITY = '[MAP] Change Legend Set Layer Visibility';

export class AddLegendSet implements Action {
  readonly type = ADD_LEGEND_SET;
  // TODO: add Legend Set data casting;
  constructor(public payload: any) {}
}

export class AddLegendSetFail implements Action {
  readonly type = ADD_LEGEND_SET_FAIL;
  // TODO: add Legend Set data casting;
  constructor(public payload: any) {}
}

export class AddLegendSetSuccess implements Action {
  readonly type = ADD_LEGEND_SET_SUCCESS;
  // TODO: add Legend Set data casting;
  constructor(public payload: { [id: string]: { [id: string]: LegendSet } }) {}
}

export class LoadLegendSet implements Action {
  readonly type = LOAD_LEGEND_SET;
  // TODO: add Legend Set data casting;
  constructor(public payload: any) {}
}

export class LoadAllLegendSet implements Action {
  readonly type = LOAD_LEGEND_SET_ALL;
}

export class LoadAllLegendSetSuccess implements Action {
  readonly type = LOAD_LEGEND_SET_ALL_SUCCESS;
  // TODO: add Legend Set data casting;
  constructor(public payload: any) {}
}

export class LoadAllLegendSetFail implements Action {
  readonly type = LOAD_LEGEND_SET_ALL_FAIL;
  // TODO: add Legend Set data casting;
  constructor(public payload: any) {}
}

export class ChangeLegendSetLayerOpacity implements Action {
  readonly type = CHANGE_LEGEND_SET_LAYER_OPACITY;
  // TODO: add Legend Set data casting;
  constructor(public payload: any) {}
}
export class ChangeLegendSetLayerVisibility implements Action {
  readonly type = CHANGE_LEGEND_SET_LAYER_VISIBILITY;
  // TODO: add Legend Set data casting;
  constructor(public payload: any) {}
}
export class LoadLegendSetFail implements Action {
  readonly type = LOAD_LEGEND_SET_FAIL;
  // TODO: add Legend Set data casting;
  constructor(public payload: any) {}
}

export class LoadLegendSetSuccess implements Action {
  readonly type = LOAD_LEGEND_SET_SUCCESS;
  // TODO: add Legend Set data casting;
  constructor(public payload: { [id: string]: LegendSet[] }) {}
}

export class UpdateLegendSet implements Action {
  readonly type = UPDATE_LEGEND_SET;
  // TODO: add Legend Set data casting;
  constructor(public payload: any) {}
}

export class UpdateLegendSetFail implements Action {
  readonly type = UPDATE_LEGEND_SET_FAIL;
  // TODO: add Legend Set data casting;
  constructor(public payload: any) {}
}

export class UpdateLegendSetSuccess implements Action {
  readonly type = UPDATE_LEGEND_SET_SUCCESS;
  // TODO: add Legend Set data casting;
  constructor(public payload: any) {}
}

export type LegendSetAction =
  | AddLegendSet
  | AddLegendSetFail
  | AddLegendSetSuccess
  | LoadAllLegendSet
  | LoadAllLegendSetFail
  | LoadAllLegendSetSuccess
  | LoadLegendSet
  | UpdateLegendSet
  | UpdateLegendSetFail
  | UpdateLegendSetSuccess
  | ChangeLegendSetLayerOpacity
  | ChangeLegendSetLayerVisibility;
