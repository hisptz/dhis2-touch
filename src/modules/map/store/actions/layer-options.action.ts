import { Action } from '@ngrx/store';
import { LayerOptions } from '../../models/layer-options.model';

export const ADD_LAYER_OPTIONS = '[Map] Add layers options';
export const UPDATE_LAYER_OPTIONS = '[Map] Update layers options';

export class AddLayerOptions implements Action {
  readonly type = ADD_LAYER_OPTIONS;
  constructor(public payload: LayerOptions) {}
}

export class UpdateLayerOptions implements Action {
  readonly type = UPDATE_LAYER_OPTIONS;
  constructor(public payload: LayerOptions) {}
}

// action types
export type LayerOptionsActions = AddLayerOptions | UpdateLayerOptions;
