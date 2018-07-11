import { Layer } from '../../models/layer.model';
import * as fromLayers from './../actions/layers.action';

export interface LayerState {
  entities: { [id: number]: Layer };
  loading: boolean;
  loaded: boolean;
}

export const initialState: LayerState = {
  entities: {},
  loaded: false,
  loading: false
};

export function reducer(state = initialState, action: fromLayers.LayersAction): LayerState {
  switch (action.type) {
    case fromLayers.LOAD_LAYERS: {
      return {
        ...state,
        loading: true
      };
    }
    case fromLayers.LOAD_LAYERS_SUCCESS: {
      const layers = action.payload;
      const entities = layers.reduce(
        // tslint:disable-next-line
        (entities: { [id: string]: Layer }, layer: Layer) => {
          return {
            ...entities,
            [layer.id]: layer
          };
        },
        {
          ...state.entities
        }
      );
      return {
        ...state,
        loading: false,
        loaded: true,
        entities
      };
    }

    case fromLayers.LOAD_LAYERS_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }
  }
  return state;
}

export const getLayerLoading = (state: LayerState) => state.loading;
export const getLayerLoaded = (state: LayerState) => state.loaded;
export const getLayersEntities = (state: LayerState) => state.entities;
