import { Action } from '@ngrx/store';
import { LegendSet } from '../../models/Legend-set.model';
import * as fromBaseLayers from '../actions/base-layer.action';

export interface BaseLayerState {
  entities: { [id: string]: LegendSet };
  loading: boolean;
  loaded: boolean;
}

export const initialState: BaseLayerState = {
  entities: {},
  loaded: false,
  loading: false
};

export function reducer(
  state = initialState,
  action: fromBaseLayers.BaseLayerAction
): BaseLayerState {
  switch (action.type) {
    case fromBaseLayers.ADD_BASELAYER:
    case fromBaseLayers.UPDATE_BASELAYER: {
      return {
        ...state,
        loading: true
      };
    }
    case fromBaseLayers.ADD_BASELAYER_SUCCESS:
    case fromBaseLayers.UPDATE_BASELAYER_SUCCESS: {
      const basemap = action.payload;
      const entities = {
        ...state.entities,
        ...basemap
      };
      return {
        ...state,
        loading: false,
        loaded: true,
        entities
      };
    }

    case fromBaseLayers.ADD_BASELAYER_FAIL:
    case fromBaseLayers.UPDATE_BASELAYER_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }
  }
  return state;
}

export const getBaseLayerLoading = (state: BaseLayerState) => state.loading;
export const getBaseLayerLoaded = (state: BaseLayerState) => state.loaded;
export const getBaseLayerEntities = (state: BaseLayerState) => state.entities;
