import { Action } from '@ngrx/store';

import { VisualizationObject } from '../../models/visualization-object.model';
import { GeoFeature } from '../../models/geo-feature.model';
// load GeoFeatues
export const LOAD_VIZ_OBJ_GEOFEATURE = '[Map] Load Visualization Object';
export const LOAD_VIZ_OBJ_GEOFEATURE_FAIL = '[Map] Load Visualization Object Geofeature Fail';
export const LOAD_VIZ_OBJ_GEOFEATURE_SUCCESS = '[Map] Load Visualization Object Geofeature Success';
export const CREATE_VISUALIZATION_OBJECT = '[Map] Create visualization object';
export const LOAD_ANALYTICS = '[Map] Load analytics object';
export const ADD_LEGEND_SET_VIZ = '[Map] Add Legend to Visualization object';
export const ADD_ANALYTICS_VIZ = '[Map] Add Analytics to Visualization object';
export const ADD_ORGANIZATIONUNITGROUPSET = '[Map] Add Organization Group set object';
export const CREATE_VISUALIZATION_OBJECT_FAIL = '[Map] Create visualization object Fail';
export const CREATE_VISUALIZATION_OBJECT_SUCCESS = '[Map] Create visualization object Success';
export const UPDATE_VISUALIZATION_OBJECT = '[Map] Update visualization object';
export const UPDATE_VISUALIZATION_OBJECT_FAIL = '[Map] Update visualization object Fail';
export const UPDATE_VISUALIZATION_OBJECT_SUCCESS = '[Map] Update visualization object Success';
export const ADD_LAYER = '[Map] Add Layer to visualization object';
export const ADD_GEOFEATURES_VIZ = '[Map] Add Geofeatures to visualization object';
export const REMOVE_LAYER = '[Map] Remove Layer from visualization object';
export const HIDE_LAYER = '[Map] Hide Layer';
export const ADD_VISUALIZATION_OBJECT_COMPLETE = '[Map] Add complete visualization object';
export const ADD_VISUALIZATION_OBJECT_COMPLETE_SUCCESS =
  '[Map] Add complete visualization object success';
export const ADD_VISUALIZATION_OBJECT_COMPLETE_FAIL =
  '[Map] Add complete visualization object fail';
export const LOAD_VISUALIZATION_OBJECT = '[Map] Load visualization object';
export const LOAD_VISUALIZATION_OBJECT_SUCCESS = '[Map] Load visualization object success';
export const LOAD_VISUALIZATION_OBJECT_FAIL = '[Map] Load visualization object Fail';

export class CreateVisualizationObject implements Action {
  readonly type = CREATE_VISUALIZATION_OBJECT;
  constructor(public payload: VisualizationObject) {}
}

export class CreateVisualizationObjectFail implements Action {
  readonly type = CREATE_VISUALIZATION_OBJECT_FAIL;
  constructor(public payload: any) {}
}

export class LoadVizObjectGeoFeature implements Action {
  readonly type = LOAD_VIZ_OBJ_GEOFEATURE;
  constructor(public payload: any) {}
}

export class LoadVizObjectGeoFeatureFail implements Action {
  readonly type = LOAD_VIZ_OBJ_GEOFEATURE_FAIL;
  constructor(public payload: any) {}
}

export class LoadVizObjectGeoFeatureSuccess implements Action {
  readonly type = LOAD_VIZ_OBJ_GEOFEATURE_SUCCESS;
  constructor(public payload: GeoFeature[]) {}
}

export class CreateVisualizationObjectSuccess implements Action {
  readonly type = CREATE_VISUALIZATION_OBJECT_SUCCESS;
  constructor(public payload: VisualizationObject) {}
}

export class UpdateVisualizationObject implements Action {
  readonly type = UPDATE_VISUALIZATION_OBJECT;
  constructor(public payload: VisualizationObject) {}
}

export class UpdateVisualizationObjectFail implements Action {
  readonly type = UPDATE_VISUALIZATION_OBJECT_FAIL;
  constructor(public payload: any) {}
}

export class UpdateVisualizationObjectSuccess implements Action {
  readonly type = UPDATE_VISUALIZATION_OBJECT_SUCCESS;
  constructor(public payload: VisualizationObject) {}
}

export class AddLayerVizObj implements Action {
  readonly type = ADD_LAYER;
  constructor(public payload: any) {}
}

export class AddLegendVizObj implements Action {
  readonly type = ADD_LEGEND_SET_VIZ;
  constructor(public payload: VisualizationObject) {}
}

export class UpdateVizAnalytics implements Action {
  readonly type = ADD_ANALYTICS_VIZ;
  constructor(public payload: VisualizationObject) {}
}

export class LoadAnalyticsVizObj implements Action {
  readonly type = LOAD_ANALYTICS;
  constructor(public payload: any) {}
}

export class AddOrgUnitGroupSetVizObj implements Action {
  readonly type = ADD_ORGANIZATIONUNITGROUPSET;
  constructor(public payload: any) {}
}

export class RemoveLayerVizObj implements Action {
  readonly type = REMOVE_LAYER;
  constructor(public payload: any) {}
}

export class AddGeoFeaturesVizObj implements Action {
  readonly type = ADD_GEOFEATURES_VIZ;
  constructor(public payload: VisualizationObject) {}
}

export class HideLayerVizObj implements Action {
  readonly type = HIDE_LAYER;
  constructor(public payload: any) {}
}

export class LoadVisualizationObject implements Action {
  readonly type = LOAD_VISUALIZATION_OBJECT;
}

export class LoadVisualizationObjectSuccess implements Action {
  readonly type = LOAD_VISUALIZATION_OBJECT_SUCCESS;
  constructor(public payload: VisualizationObject[]) {}
}

export class LoadVisualizationObjectFail implements Action {
  readonly type = LOAD_VISUALIZATION_OBJECT_FAIL;
  constructor(public payload: VisualizationObject) {}
}

export class AddVisualizationObjectComplete implements Action {
  readonly type = ADD_VISUALIZATION_OBJECT_COMPLETE;
  constructor(public payload: VisualizationObject) {}
}

export class AddVisualizationObjectCompleteSuccess implements Action {
  readonly type = ADD_VISUALIZATION_OBJECT_COMPLETE_SUCCESS;
  constructor(public payload: VisualizationObject) {}
}

export class AddVisualizationObjectCompleteFail implements Action {
  readonly type = ADD_VISUALIZATION_OBJECT_COMPLETE_FAIL;
  constructor(public payload: any) {}
}

export type VisualizationObjectAction =
  | CreateVisualizationObject
  | CreateVisualizationObjectSuccess
  | CreateVisualizationObjectFail
  | UpdateVisualizationObject
  | UpdateVisualizationObjectFail
  | UpdateVisualizationObjectSuccess
  | AddLayerVizObj
  | AddGeoFeaturesVizObj
  | RemoveLayerVizObj
  | HideLayerVizObj
  | LoadVisualizationObject
  | LoadVisualizationObjectFail
  | LoadVisualizationObjectSuccess
  | LoadAnalyticsVizObj
  | AddOrgUnitGroupSetVizObj
  | AddLegendVizObj
  | UpdateVizAnalytics
  | LoadVizObjectGeoFeature
  | LoadVizObjectGeoFeatureFail
  | LoadVizObjectGeoFeatureSuccess
  | AddVisualizationObjectComplete
  | AddVisualizationObjectCompleteSuccess
  | AddVisualizationObjectCompleteFail;
