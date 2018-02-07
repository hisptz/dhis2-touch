import { VisualizationObject } from '../../models/visualization-object.model';
import { Layer } from '../../models/layer.model';
import * as fromVisualizationObject from '../actions/visualization-object.action';

export interface VisualizationObjectState {
  entities: { [id: number]: VisualizationObject };
  currentLayer: string;
  currentMap: string;
  loading: boolean;
  loaded: boolean;
}

export const initialState: VisualizationObjectState = {
  entities: {},
  currentLayer: null,
  currentMap: null,
  loaded: false,
  loading: false
};

export function reducer(
  state = initialState,
  action: fromVisualizationObject.VisualizationObjectAction
): VisualizationObjectState {
  switch (action.type) {
    case fromVisualizationObject.LOAD_VISUALIZATION_OBJECT:
    case fromVisualizationObject.LOAD_VIZ_OBJ_GEOFEATURE:
    case fromVisualizationObject.LOAD_ANALYTICS:
    case fromVisualizationObject.ADD_VISUALIZATION_OBJECT_COMPLETE: {
      return {
        ...state,
        loaded: false,
        loading: true
      };
    }
    case fromVisualizationObject.LOAD_VISUALIZATION_OBJECT_SUCCESS: {
      const vizObjs = action.payload;
      const entities = vizObjs.reduce(
        (entitie: { [id: string]: VisualizationObject }, vizObj: VisualizationObject) => {
          return {
            ...entitie,
            [vizObj.componentId]: vizObj
          };
        },
        {
          ...state.entities
        }
      );
      return {
        ...state,
        loaded: true,
        loading: false,
        entities
      };
    }

    case fromVisualizationObject.ADD_VISUALIZATION_OBJECT_COMPLETE_SUCCESS: {
      const vizObj = action.payload;
      const entities = {
        ...state.entities,
        [vizObj.componentId]: vizObj
      };

      return {
        ...state,
        loaded: true,
        loading: false,
        entities
      };
    }

    case fromVisualizationObject.LOAD_VISUALIZATION_OBJECT_FAIL:
    case fromVisualizationObject.LOAD_VIZ_OBJ_GEOFEATURE_FAIL: {
      return {
        ...state,
        loaded: false,
        loading: false
      };
    }

    case fromVisualizationObject.CREATE_VISUALIZATION_OBJECT_SUCCESS:
    case fromVisualizationObject.UPDATE_VISUALIZATION_OBJECT_SUCCESS: {
      const visualizationObject = action.payload;
      const currentLayer = visualizationObject.layers[0].id;
      const currentMap = visualizationObject.componentId;
      const entities = {
        ...state.entities,
        [visualizationObject.componentId]: visualizationObject
      };
      return {
        ...state,
        currentLayer,
        currentMap,
        loaded: true,
        loading: false,
        entities
      };
    }

    case fromVisualizationObject.ADD_GEOFEATURES_VIZ: {
      const { componentId, mapConfiguration, geofeatures } = action.payload;
      const visualizationObject = {
        ...state.entities[componentId],
        geofeatures
      };
      const entities = {
        ...state.entities,
        [componentId]: visualizationObject
      };
      return {
        ...state,
        loaded: true,
        loading: false,
        entities
      };
    }

    case fromVisualizationObject.ADD_LEGEND_SET_VIZ: {
      const { componentId, mapConfiguration, legendSets } = action.payload;
      const visualizationObject = {
        ...state.entities[componentId],
        legendSets
      };
      const entities = {
        ...state.entities,
        [componentId]: visualizationObject
      };
      return {
        ...state,
        loaded: true,
        loading: false,
        entities
      };
    }

    case fromVisualizationObject.ADD_ANALYTICS_VIZ: {
      const { componentId, mapConfiguration, analytics } = action.payload;
      const visualizationObject = {
        ...state.entities[componentId],
        analytics
      };
      const entities = {
        ...state.entities,
        [componentId]: visualizationObject
      };
      return {
        ...state,
        loaded: true,
        loading: false,
        entities
      };
    }
  }
  return state;
}

export const getVisualizationObjectsEntities = (state: VisualizationObjectState) => state.entities;
export const getVisualizationObjectsLoading = (state: VisualizationObjectState) => state.loading;
export const getCurentlayerLoading = (state: VisualizationObjectState) => state.currentLayer;
export const getVisualizationObjectsLoaded = (state: VisualizationObjectState) => state.loaded;
export const getCurrentMap = (state: VisualizationObjectState) => {
  return state.currentMap;
};
