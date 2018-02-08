import * as _ from 'lodash';
import { Visualization } from '../../models/visualization';
import * as fromVisualizationActions from '../actions/visualization.actions';
import * as fromVisualizationHelpers from '../helpers';

export interface VisualizationState {
  currentVisualization: string;
  visualizationObjects: Visualization[];
}

export const INITIAL_VISUALIZATION_STATE: VisualizationState = {
  currentVisualization: undefined,
  visualizationObjects: []
}

export function visualizationReducer(
  state: VisualizationState = INITIAL_VISUALIZATION_STATE,
  action: fromVisualizationActions.VisualizationAction
) {
  switch (action.type) {
    case fromVisualizationActions.VisualizationActions.SET_INITIAL:
      return {
        ...state,
        visualizationObjects: [...state.visualizationObjects, ...action.payload]
      };
    case fromVisualizationActions.VisualizationActions.ADD_OR_UPDATE:
      const visualizationIndex = state.visualizationObjects.indexOf(
        _.find(state.visualizationObjects, [
          'id',
          action.payload.visualizationObject
            ? action.payload.visualizationObject.id
            : undefined
        ])
      );

      return visualizationIndex !== -1
        ? {
          ...state,
          visualizationObjects:
            action.payload.placementPreference === 'first'
              ? [
                action.payload.visualizationObject,
                ...state.visualizationObjects.slice(0, visualizationIndex),
                ...state.visualizationObjects.slice(visualizationIndex + 1)
              ]
              : [
                ...state.visualizationObjects.slice(0, visualizationIndex),
                action.payload.visualizationObject,
                ...state.visualizationObjects.slice(visualizationIndex + 1)
              ]
        }
        : {
          ...state,
          visualizationObjects:
            action.payload.placementPreference === 'first'
              ? [
                action.payload.visualizationObject,
                ...state.visualizationObjects
              ]
              : [
                ...state.visualizationObjects,
                action.payload.visualizationObject
              ]
        };

    case fromVisualizationActions.VisualizationActions.SET_CURRENT:
      return { ...state, currentVisualization: action.payload };
    case fromVisualizationActions.VisualizationActions.UNSET_CURRENT:
      return { ...state, currentVisualization: undefined };
    case fromVisualizationActions.VisualizationActions.RESIZE: {
      const visualizationObject: Visualization = _.find(
        state.visualizationObjects,
        ['id', action.payload.visualizationId]
      );
      const visualizationObjectIndex = state.visualizationObjects.indexOf(
        visualizationObject
      );
      return visualizationObjectIndex !== -1
        ? {
          ...state,
          visualizationObjects: [
            ...state.visualizationObjects.slice(0, visualizationObjectIndex),
            {
              ...visualizationObject,
              shape: action.payload.shape,
              details: {
                ...visualizationObject.details,
                width: fromVisualizationHelpers.getVisualizationWidthFromShape(
                  action.payload.shape
                ),
                shape: action.payload.shape
              }
            },
            ...state.visualizationObjects.slice(visualizationObjectIndex + 1)
          ]
        }
        : state;
    }
    case fromVisualizationActions.VisualizationActions.TOGGLE_INTERPRETATION: {
      const visualizationObject: Visualization = _.find(
        state.visualizationObjects,
        ['id', action.payload]
      );
      const visualizationObjectIndex = state.visualizationObjects.indexOf(
        visualizationObject
      );
      /**
       * Change size of the dashboard item
       */

      const newShape = visualizationObject
        ? visualizationObject.details.showInterpretationBlock
          ? visualizationObject.details.shape
          : visualizationObject.shape === 'NORMAL'
            ? 'DOUBLE_WIDTH'
            : 'FULL_WIDTH'
        : '';

      return visualizationObjectIndex !== -1
        ? {
          ...state,
          visualizationObjects: [
            ...state.visualizationObjects.slice(0, visualizationObjectIndex),
            {
              ...visualizationObject,
              shape: newShape,
              details: {
                ...visualizationObject.details,
                width: fromVisualizationHelpers.getVisualizationWidthFromShape(
                  newShape
                ),
                showInterpretationBlock: !visualizationObject.details
                  .showInterpretationBlock,
                shape: visualizationObject.shape
              }
            },
            ...state.visualizationObjects.slice(visualizationObjectIndex + 1)
          ]
        }
        : state;
    }

    case fromVisualizationActions.VisualizationActions.DELETE: {
      const visualizationObject: Visualization = _.find(
        state.visualizationObjects,
        ['id', action.payload.visualizationId]
      );
      const visualizationObjectIndex = state.visualizationObjects.indexOf(
        visualizationObject
      );
      return visualizationObjectIndex !== -1
        ? {
          ...state,
          visualizationObjects: [
            ...state.visualizationObjects.slice(0, visualizationObjectIndex),
            {
              ...visualizationObject,
              details: { ...visualizationObject.details, deleting: true }
            },
            ...state.visualizationObjects.slice(visualizationObjectIndex + 1)
          ]
        }
        : state;
    }

    case fromVisualizationActions.VisualizationActions.DELETE_SUCCESS: {
      const visualizationObject: Visualization = _.find(
        state.visualizationObjects,
        ['id', action.payload.visualizationId]
      );
      const visualizationObjectIndex = state.visualizationObjects.indexOf(
        visualizationObject
      );

      return visualizationObjectIndex !== -1
        ? {
          ...state,
          visualizationObjects: [
            ...state.visualizationObjects.slice(0, visualizationObjectIndex),
            ...state.visualizationObjects.slice(visualizationObjectIndex + 1)
          ]
        }
        : state;
    }

    case fromVisualizationActions.VisualizationActions.DELETE_FAIL: {
      const visualizationObject: Visualization = _.find(
        state.visualizationObjects,
        ['id', action.payload]
      );
      const visualizationObjectIndex = state.visualizationObjects.indexOf(
        visualizationObject
      );
      return visualizationObjectIndex !== -1
        ? {
          ...state,
          visualizationObjects: [
            ...state.visualizationObjects.slice(0, visualizationObjectIndex),
            {
              ...visualizationObject,
              details: {
                ...visualizationObject.details,
                deleting: false,
                deleteFail: true
              }
            },
            ...state.visualizationObjects.slice(visualizationObjectIndex + 1)
          ]
        }
        : state;
    }

    case fromVisualizationActions.VisualizationActions.TOGGLE_DELETE_DIALOG: {
      const visualizationObject: Visualization = _.find(
        state.visualizationObjects,
        ['id', action.payload]
      );
      const visualizationObjectIndex = state.visualizationObjects.indexOf(
        visualizationObject
      );
      return visualizationObjectIndex !== -1
        ? {
          ...state,
          visualizationObjects: [
            ...state.visualizationObjects.slice(0, visualizationObjectIndex),
            {
              ...visualizationObject,
              details: {
                ...visualizationObject.details,
                showDeleteDialog: !visualizationObject.details
                  .showDeleteDialog
              }
            },
            ...state.visualizationObjects.slice(visualizationObjectIndex + 1)
          ]
        }
        : state;
    }

    case fromVisualizationActions.VisualizationActions.TOGGLE_VISUALIZATION: {
      const visualizationObject: Visualization = _.find(
        state.visualizationObjects,
        ['id', action.payload.id]
      );
      const visualizationObjectIndex = state.visualizationObjects.indexOf(
        visualizationObject
      );
      return visualizationObjectIndex !== -1
        ? {
          ...state,
          visualizationObjects: [
            ...state.visualizationObjects.slice(0, visualizationObjectIndex),
            {
              ...visualizationObject,
              details: {
                ...visualizationObject.details,
                expanded: !visualizationObject.details.expanded
              }
            },
            ...state.visualizationObjects.slice(visualizationObjectIndex + 1)
          ]
        }
        : state;
    }
    default:
      return state;
  }
}

export const getVisualizationObjectState = (state: VisualizationState) => state.visualizationObjects;
export const getCurrentVisualizationState = (state: VisualizationState) => state.currentVisualization;
