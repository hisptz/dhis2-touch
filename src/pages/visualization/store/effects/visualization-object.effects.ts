import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import * as _ from 'lodash';
import {
  InitializeVisualizationObjectAction, LoadVisualizationFavoriteAction,
  LoadVisualizationFavoriteSuccessAction,
  UpdateVisualizationObjectAction,
  VisualizationObjectActionTypes
} from '../actions/visualization-object.actions';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { VisualizationState, getVisualizationObjectEntities } from '../reducers';
import { Visualization } from '../../models/visualization.model';
import { FavoriteService } from '../../services/favorite.service';
import { of } from 'rxjs/observable/of';
import { getSelectionDimensionsFromFavorite } from '../../helpers/get-selection-dimensions-from-favorite.helper';
import { AddVisualizationLayerAction, LoadVisualizationAnalyticsAction } from '../actions/visualization-layer.actions';
import { VisualizationLayer } from '../../models/visualization-layer.model';
import {
  AddVisualizationConfigurationAction,
  UpdateVisualizationConfigurationAction
} from '../actions/visualization-configuration.actions';
import { getVisualizationLayerType } from '../../helpers/get-visualization-layer-type.helper';
import { getStandardizedVisualizationType } from '../../helpers/get-standardized-visualization-type.helper';

@Injectable()
export class VisualizationObjectEffects {
  constructor(private actions$: Actions, private store: Store<VisualizationState>,
    private favoriteService: FavoriteService) {
  }

  @Effect({dispatch: false}) initializeVisualizationObject$ = this.actions$.ofType(
    VisualizationObjectActionTypes.INITIALIZE_VISUALIZATION_OBJECT).
    pipe(withLatestFrom(this.store.select(getVisualizationObjectEntities)), tap(
      ([action, visualizationObjectEntities]: [InitializeVisualizationObjectAction, {[id: string]: Visualization}]) => {
        const visualizationObject: Visualization = visualizationObjectEntities[action.id];
        if (visualizationObject && visualizationObject.progress && visualizationObject.progress.percent === 0) {
          // set initial global visualization configurations
          this.store.dispatch(new AddVisualizationConfigurationAction(
            {
              id: visualizationObject.visualizationConfigId,
              type: visualizationObject.type,
              currentType: getStandardizedVisualizationType(visualizationObject.type),
              name: visualizationObject.favorite ? visualizationObject.favorite.name : ''
            }));

          // Load favorite information
          if (visualizationObject.favorite) {
            this.store.dispatch(
              new LoadVisualizationFavoriteAction(visualizationObject));
          }
        }
      }));

  @Effect() loadFavorite$ = this.actions$.ofType(VisualizationObjectActionTypes.LOAD_VISUALIZATION_FAVORITE).pipe(
    mergeMap(
      (action: LoadVisualizationFavoriteAction) => this.favoriteService.getFavorite(action.visualization.favorite).
        pipe(map((favorite: any) => new LoadVisualizationFavoriteSuccessAction(action.visualization, favorite)),
          catchError((error) => of(new UpdateVisualizationObjectAction(action.visualization.id, {
              progress: {
                statusCode: error.status,
                statusText: 'Error',
                percent: 100,
                message: error.error
              }
            })
          )))));

  @Effect({dispatch: false}) loadFavoriteSuccess$ = this.actions$.ofType(
    VisualizationObjectActionTypes.LOAD_VISUALIZATION_FAVORITE_SUCCESS).
    pipe(tap((action: LoadVisualizationFavoriteSuccessAction) => {
      const visualizationFavoriteOptions = action.visualization && action.visualization.favorite ?
        action.visualization.favorite : null;

      if (visualizationFavoriteOptions && action.favorite) {
        if (visualizationFavoriteOptions.requireAnalytics) {
          // update global visualization configurations
          this.store.dispatch(new UpdateVisualizationConfigurationAction(
            action.visualization.visualizationConfigId, {
              basemap: action.favorite.basemap,
              zoom: action.favorite.zoom,
              latitude: action.favorite.latitude,
              longitude: action.favorite.longitude,
            }));

          // generate visualization layers
          const visualizationLayers: VisualizationLayer[] = _.map(action.favorite.mapViews || [action.favorite],
            (favoriteLayer: any) => {
              const dataSelections = getSelectionDimensionsFromFavorite(favoriteLayer);
              return {
                id: favoriteLayer.id,
                dataSelections,
                layerType: getVisualizationLayerType(action.visualization.favorite.type, favoriteLayer),
                analytics: null,
                config: {...favoriteLayer, visualizationType: action.visualization.type}
              };
            });

          // Add visualization Layers
          _.each(visualizationLayers, visualizationLayer => {
            this.store.dispatch(new AddVisualizationLayerAction(visualizationLayer));
          });

          // Update visualization object
          this.store.dispatch(new UpdateVisualizationObjectAction(action.visualization.id, {
            layers: _.map(visualizationLayers, visualizationLayer => visualizationLayer.id),
            progress: {
              statusCode: 200,
              statusText: 'OK',
              percent: 50,
              message: 'Favorite information has been loaded'
            }
          }));

          //Load analytics for visualization layers
          this.store.dispatch(new LoadVisualizationAnalyticsAction(action.visualization.id, visualizationLayers));
        } else {
          const visualizationLayers: VisualizationLayer[] = _.map([action.favorite], favoriteLayer => {
            return {
              id: favoriteLayer.id,
              analytics: {
                rows: favoriteLayer[visualizationFavoriteOptions.type]
              }
            };
          });

          // Update visualization object
          this.store.dispatch(new UpdateVisualizationObjectAction(action.visualization.id, {
            layers: _.map(visualizationLayers, visualizationLayer => visualizationLayer.id),
            progress: {
              statusCode: 200,
              statusText: 'OK',
              percent: 100,
              message: 'Information has been loaded'
            }
          }));

          // Add visualization Layers
          _.each(visualizationLayers, visualizationLayer => {
            this.store.dispatch(new AddVisualizationLayerAction(visualizationLayer));
          });
        }
      } else {
        // Update visualization object
        this.store.dispatch(new UpdateVisualizationObjectAction(action.visualization.id, {
          layers: [visualizationFavoriteOptions.id],
          progress: {
            statusCode: 200,
            statusText: 'OK',
            percent: 100,
            message: 'Information has been loaded'
          }
        }));
      }
    }));
}
