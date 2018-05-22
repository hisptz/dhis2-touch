import { Action } from '@ngrx/store';

export enum DictionaryActions {
  INITIALIZE = '[Dictionary] initialize incoming metadata',
  UPDATE = '[Dictionary] update metadata dictionary list',
  ADD = '[Dictionary] add initial items to dictionary list'
}

export class InitializeAction implements Action {
  readonly type = DictionaryActions.INITIALIZE;
  constructor(public payload: any[]) {}
}

export class AddAction implements Action {
  readonly type = DictionaryActions.ADD;
  constructor(public payload: Array<string>) {}
}

export class UpdateAction implements Action {
  readonly type = DictionaryActions.UPDATE;
  constructor(public payload: any) {}
}

export type DictionaryAction = InitializeAction | UpdateAction | AddAction;
