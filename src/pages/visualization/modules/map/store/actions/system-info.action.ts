import { Action } from '@ngrx/store';

// add Context Path
export const ADD_CONTEXT_PATH = '[SYSTEM] Add contect Path';

export class AddContectPath implements Action {
  readonly type = ADD_CONTEXT_PATH;
}

export type SystemInfoAction = AddContectPath;
