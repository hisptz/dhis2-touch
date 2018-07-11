import { Action } from '@ngrx/store';

import { Layer } from '../../models/layer.model';

// load layers
export const LOAD_LAYERS = '[Map] Load Layer';
export const LOAD_LAYERS_FAIL = '[Map] Load Layer Fail';
export const LOAD_LAYERS_SUCCESS = '[Map] Load Layer Success';
export const CREATE_LAYERS = '[Map] create Layer';
export const CREATE_LAYERS_FAIL = '[Map] Create Layer Fail';
export const CREATE_LAYERS_SUCCESS = '[Map] Create Layer Success';
export const ADD_LAYERS = '[Map] Add Layer';
export const ADD_LAYERS_FAIL = '[Map] Add Layer Fail';
export const ADD_LAYERS_SUCCESS = '[Map] Add Layer Success';
export const REMOVE_LAYERS = '[Map] Remove Layer';
export const REMOVE_LAYERS_FAIL = '[Map] Remove Layer Fail';
export const REMOVE_LAYERS_SUCCESS = '[Map] Remove Layer Success';
export const UPDATE_LAYER_STYLE = '[Layer] Update layer Style';
export const UPDATE_LAYER_STYLE_SUCCESS = '[Layer] Update layer Style Success';

export class LoadLayers implements Action {
  readonly type = LOAD_LAYERS;
}

export class LoadLayersFail implements Action {
  readonly type = LOAD_LAYERS_FAIL;
  constructor(public payload: any) {}
}

export class LoadLayersSuccess implements Action {
  readonly type = LOAD_LAYERS_SUCCESS;
  constructor(public payload: Layer[]) {}
}

export class CreateLayers implements Action {
  readonly type = CREATE_LAYERS;
  constructor(public payload: Layer[]) {}
}

export class CreateLayersFail implements Action {
  readonly type = CREATE_LAYERS_FAIL;
  constructor(public payload: any) {}
}

export class CreateLayersSuccess implements Action {
  readonly type = CREATE_LAYERS_SUCCESS;
  constructor(public payload: Layer) {}
}

export class AddLayers implements Action {
  readonly type = CREATE_LAYERS;
  constructor(public payload: Layer) {}
}

export class AddLayersFail implements Action {
  readonly type = CREATE_LAYERS_FAIL;
  constructor(public payload: any) {}
}

export class AddLayersSuccess implements Action {
  readonly type = CREATE_LAYERS_SUCCESS;
  constructor(public payload: Layer) {}
}

export class RemoveLayers implements Action {
  readonly type = REMOVE_LAYERS;
  constructor(public payload: Layer[]) {}
}

export class RemoveLayersFail implements Action {
  readonly type = REMOVE_LAYERS_FAIL;
  constructor(public payload: any) {}
}

export class RemoveLayersSuccess implements Action {
  readonly type = REMOVE_LAYERS_SUCCESS;
  constructor(public payload: Layer) {}
}

export class UpdateLayerStyle implements Action {
  readonly type = UPDATE_LAYER_STYLE;
  constructor(public payload: any) {}
}

export class UpdateLayerStyleSuccess implements Action {
  readonly type = UPDATE_LAYER_STYLE_SUCCESS;
  constructor(public payload: any) {}
}

// action types
export type LayersAction =
  | LoadLayers
  | LoadLayersFail
  | LoadLayersSuccess
  | CreateLayers
  | CreateLayersFail
  | CreateLayersSuccess
  | RemoveLayers
  | RemoveLayersFail
  | RemoveLayersSuccess
  | UpdateLayerStyle
  | UpdateLayerStyleSuccess;
