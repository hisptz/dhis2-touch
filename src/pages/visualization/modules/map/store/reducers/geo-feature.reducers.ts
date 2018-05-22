import { Action } from '@ngrx/store';
import { GeoFeature } from '../../models/geo-feature.model';
import * as fromGeofeatures from '../actions/geo-features.action';

export interface GeoFeatureState {
  geofeatures: GeoFeature[];
  loading: boolean;
  loaded: boolean;
}

export const initialState: GeoFeatureState = {
  geofeatures: [],
  loaded: false,
  loading: false
};

export function reducer(
  state = initialState,
  action: fromGeofeatures.GeoFeatuesAction
): GeoFeatureState {
  switch (action.type) {
    case fromGeofeatures.LOAD_GEOFEATURE: {
      return {
        ...state,
        loading: true
      };
    }
    case fromGeofeatures.LOAD_GEOFEATURE_SUCCESS: {
      const geofeatures = action.payload;
      return {
        ...state,
        loading: false,
        loaded: true,
        geofeatures
      };
    }

    case fromGeofeatures.LOAD_GEOFEATURE_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }
  }
  return state;
}

export const getGeofeatureLoading = (state: GeoFeatureState) => state.loading;
export const getGeofeatureLoaded = (state: GeoFeatureState) => state.loaded;
export const getGeofeatures = (state: GeoFeatureState) => state.geofeatures;
