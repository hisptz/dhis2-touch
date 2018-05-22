import { Action } from '@ngrx/store';
// load GeoFeatues
export const ADD_BASELAYER = '[Map] Add Basemap Layer';
export const ADD_BASELAYER_FAIL = '[Map] Add Basemap Layer Fail';
export const ADD_BASELAYER_SUCCESS = '[Map] Add Basemap Layer Success';
export const UPDATE_BASELAYER = '[Map] Update Basemap Layer';
export const UPDATE_BASELAYER_FAIL = '[Map] Update Basemap Layer Fail';
export const UPDATE_BASELAYER_SUCCESS = '[Map] Update Basemap Layer Success';

export class AddBaseLayer implements Action {
  readonly type = ADD_BASELAYER;
  constructor(public payload: any) {}
}

export class AddBaseLayerFail implements Action {
  readonly type = ADD_BASELAYER_FAIL;
  constructor(public payload: any) {}
}

export class AddBaseLayerSuccess implements Action {
  readonly type = ADD_BASELAYER_SUCCESS;
  constructor(public payload: any) {}
}

export class UpdateBaseLayer implements Action {
  readonly type = UPDATE_BASELAYER;
  constructor(public payload: any) {}
}

export class UpdateBaseLayerFail implements Action {
  readonly type = UPDATE_BASELAYER_FAIL;
  constructor(public payload: any) {}
}

export class UpdateBaseLayerSuccess implements Action {
  readonly type = UPDATE_BASELAYER_SUCCESS;
  constructor(public payload: any) {}
}

// export type BaseLayers

export type BaseLayerAction =
  | AddBaseLayer
  | AddBaseLayerFail
  | AddBaseLayerSuccess
  | UpdateBaseLayer
  | UpdateBaseLayerFail
  | UpdateBaseLayerSuccess;
