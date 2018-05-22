import { Action } from '@ngrx/store';
import { GeoFeature } from '../../models/geo-feature.model';
// load GeoFeatues
export const LOAD_GEOFEATURE = '[Map] Load Geofeature';
export const LOAD_GEOFEATURE_FAIL = '[Map] Load Geofeature Fail';
export const LOAD_GEOFEATURE_SUCCESS = '[Map] Load Geofeature Success';

export class LoadGeoFeature implements Action {
  readonly type = LOAD_GEOFEATURE;
  constructor(public payload: any) {}
}

export class LoadGeoFeatureFail implements Action {
  readonly type = LOAD_GEOFEATURE_FAIL;
  constructor(public payload: any) {}
}

export class LoadGeoFeatureSuccess implements Action {
  readonly type = LOAD_GEOFEATURE_SUCCESS;
  constructor(public payload: GeoFeature[]) {}
}

// export type geofeatures

export type GeoFeatuesAction =
  | LoadGeoFeature
  | LoadGeoFeatureFail
  | LoadGeoFeatureSuccess;
