import { Action } from '@ngrx/store';
import { LegendSet } from '../../models/Legend-set.model';
import * as fromLegendSets from '../actions/legend-set.action';

export interface LegendSetState {
  entities: { [id: string]: { [id: string]: LegendSet } };
  legendSets: any;
  loading: boolean;
  loaded: boolean;
}

export const initialState: LegendSetState = {
  entities: {},
  legendSets: [],
  loaded: false,
  loading: false
};

export function reducer(
  state = initialState,
  action: fromLegendSets.LegendSetAction
): LegendSetState {
  switch (action.type) {
    case fromLegendSets.ADD_LEGEND_SET_SUCCESS: {
      const legendSet = action.payload;
      const entities = {
        ...state.entities,
        ...legendSet
      };
      return {
        ...state,
        loading: false,
        loaded: true,
        entities
      };
    }
    case fromLegendSets.UPDATE_LEGEND_SET_SUCCESS: {
      const { componentId, legend } = action.payload;
      const legends = {
        ...state.entities[componentId],
        ...legend
      };
      const entity = { [componentId]: { ...legends } };
      const entities = {
        ...state.entities,
        ...entity
      };
      return {
        ...state,
        loading: false,
        loaded: true,
        entities
      };
    }

    case fromLegendSets.LOAD_LEGEND_SET_ALL_SUCCESS: {
      const { legendSets } = action.payload;
      return { ...state, legendSets };
    }

    case fromLegendSets.ADD_LEGEND_SET_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }
  }
  return state;
}

export const getLegendSetLoading = (state: LegendSetState) => state.loading;
export const getLegendSetLoaded = (state: LegendSetState) => state.loaded;
export const getLegendSetEntities = (state: LegendSetState) => state.entities;
export const getAlllegendSets = (state: LegendSetState) => state.legendSets;
