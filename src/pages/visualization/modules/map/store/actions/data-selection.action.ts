import { Action } from '@ngrx/store';
import { DataSelections } from '../../models/data-selections.model';

export const ADD_DATA_SELECTION = '[Map] Add data selection';
export const UPDATE_DATA_SELECTION = '[Map] Update data selection';
export const UPDATE_PE_SELECTION = '[Map] Update PE in data selection';
export const UPDATE_OU_SELECTION = '[Map] Update OU in data selection';
export const UPDATE_DX_SELECTION = '[Map] Update DX in data selection';
export const LOAD_DATA_SELECTION = '[Map] Load data selection';
export const LOAD_DATA_SELECTION_FAIL = '[Map] Load data selection Fail';
export const LOAD_DATA_SELECTION_SUCCESS = '[Map] Load data selection Success';

export class AddDataSelection implements Action {
  readonly type = ADD_DATA_SELECTION;
  constructor(public payload: DataSelections) {}
}
export class UpdateDataSelection implements Action {
  readonly type = UPDATE_DATA_SELECTION;
  constructor(public payload: DataSelections) {}
}

export class UpdatePESelection implements Action {
  readonly type = UPDATE_PE_SELECTION;
  constructor(public payload: any) {}
}

export class UpdateOUSelection implements Action {
  readonly type = UPDATE_OU_SELECTION;
  constructor(public payload: any) {}
}

export class UpdateDXSelection implements Action {
  readonly type = UPDATE_DX_SELECTION;
  constructor(public payload: any) {}
}

export class LoadDataSelection implements Action {
  readonly type = LOAD_DATA_SELECTION;
  constructor(public payload: DataSelections) {}
}

export class LoadDataSelectionSuccess implements Action {
  readonly type = LOAD_DATA_SELECTION;
  constructor(public payload: DataSelections) {}
}

export class LoadDataSelectionFail implements Action {
  readonly type = LOAD_DATA_SELECTION;
  constructor(public payload: DataSelections) {}
}

// action types
export type DataSelectionAction = AddDataSelection | UpdateDataSelection;
