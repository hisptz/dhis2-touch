import { Action } from '@ngrx/store';
import { LegendSet } from '../../models/Legend-set.model';

// add Context Path
export const ADD_LEGEND_SET = '[MAP] Add Legend Set';
export const ADD_LEGEND_SET_FAIL = '[MAP] Add Legend Set Fail';
export const ADD_LEGEND_SET_SUCCESS = '[MAP] Add Legend Set Success';
export const LOAD_LEGEND_SET = '[MAP] Load Legend Set';
export const LOAD_LEGEND_SET_SUCCESS = '[MAP] Load Legend Set Success';
export const LOAD_LEGEND_SET_FAIL = '[MAP] Load Legend Set Fail';
export const UPDATE_LEGEND_SET = '[MAP] Add Legend Set';
export const UPDATE_LEGEND_SET_FAIL = '[MAP] Add Legend Set Fail';
export const UPDATE_LEGEND_SET_SUCCESS = '[MAP] Add Legend Set Success';

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
  constructor(public payload: { [id: string]: LegendSet[] }) {}
}

export class LoadLegendSet implements Action {
  readonly type = LOAD_LEGEND_SET;
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
  readonly type = ADD_LEGEND_SET;
  // TODO: add Legend Set data casting;
  constructor(public payload: any) {}
}

export class UpdateLegendSetFail implements Action {
  readonly type = ADD_LEGEND_SET_FAIL;
  // TODO: add Legend Set data casting;
  constructor(public payload: any) {}
}

export class UpdateLegendSetSuccess implements Action {
  readonly type = ADD_LEGEND_SET_SUCCESS;
  // TODO: add Legend Set data casting;
  constructor(public payload: { [id: string]: LegendSet[] }) {}
}

export type LegendSetAction =
  | AddLegendSet
  | AddLegendSetFail
  | AddLegendSetSuccess
  | UpdateLegendSet
  | UpdateLegendSetFail
  | UpdateLegendSetSuccess;
