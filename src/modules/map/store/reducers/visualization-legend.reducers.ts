import * as fromVisualizationLegend from './../actions/visualization-legend.action';
import { VisualizationLegend } from '../../models/visualization-legend.model';

export interface VisualizationLegendState {
  entities: { [id: string]: VisualizationLegend };
}

export const initialState: VisualizationLegendState = {
  entities: {}
};

export function reducer(
  state = initialState,
  action: fromVisualizationLegend.VisualizationLegendAction
): VisualizationLegendState {
  switch (action.type) {
    case fromVisualizationLegend.INITIALIZE_VISUALIZATION_LEGEND: {
      const visualizationObjectId = action.payload;
      const initialVisualizationLegendState: VisualizationLegend = {
        open: false,
        pinned: false,
        filterSectionOpen: false
      };
      const entities = {
        ...state.entities,
        [visualizationObjectId]: initialVisualizationLegendState
      };
      return {
        ...state,
        entities
      };
    }

    case fromVisualizationLegend.TOGGLE_PIN_VISUALIZATION_LEGEND: {
      const visualizationObjectId = action.payload;
      const pinned = !state.entities[visualizationObjectId].pinned;
      const visualizationLegend = {
        ...state.entities[visualizationObjectId],
        pinned
      };
      const entities = {
        ...state.entities,
        [visualizationObjectId]: visualizationLegend
      };
      return {
        ...state,
        entities
      };
    }
    case fromVisualizationLegend.TOGGLE_OPEN_VISUALIZATION_LEGEND: {
      const visualizationObjectId = action.payload;
      const pinned = state.entities[visualizationObjectId].pinned;
      const open = !state.entities[visualizationObjectId].open;
      if (pinned) {
        return state;
      }
      const visualizationLegend = {
        ...state.entities[visualizationObjectId],
        open
      };
      const entities = {
        ...state.entities,
        [visualizationObjectId]: visualizationLegend
      };
      return {
        ...state,
        entities
      };
    }

    case fromVisualizationLegend.TOGGLE_VISUALIZATION_FILTER_SECTION: {
      const visualizationObjectId = action.payload;
      const filterSectionOpen = !state.entities[visualizationObjectId].filterSectionOpen;
      const visualizationLegend = {
        ...state.entities[visualizationObjectId],
        filterSectionOpen
      };
      const entities = {
        ...state.entities,
        [visualizationObjectId]: visualizationLegend
      };
      return {
        ...state,
        entities
      };
    }

    case fromVisualizationLegend.CLOSE_VISUALIZATION_FILTER_SECTION: {
      const visualizationObjectId = action.payload;
      const filterSectionOpen = false;
      const visualizationLegend = {
        ...state.entities[visualizationObjectId],
        filterSectionOpen
      };
      const entities = {
        ...state.entities,
        [visualizationObjectId]: visualizationLegend
      };
      return {
        ...state,
        entities
      };
    }

    case fromVisualizationLegend.CLOSE_PIN_VISUALIZATION_LEGEND: {
      const visualizationObjectId = action.payload;
      const pinned = false;
      const open = !state.entities[visualizationObjectId].open;
      const visualizationLegend = {
        ...state.entities[visualizationObjectId],
        open,
        pinned
      };
      const entities = {
        ...state.entities,
        [visualizationObjectId]: visualizationLegend
      };
      return {
        ...state,
        entities
      };
    }
  }
  return state;
}

export const getVisualizationLegendEntities = (state: VisualizationLegendState) => state.entities;
