import { Action } from '@ngrx/store';
import { DataSelections } from '../../models/data-selections.model';

export const ADD_DATA_SELECTION = '[Map] Add data selection';
export const UPDATE_DATA_SELECTION = '[Map] Update data selection';
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

// action types
export type DataSelectionAction = AddDataSelection | UpdateDataSelection;
