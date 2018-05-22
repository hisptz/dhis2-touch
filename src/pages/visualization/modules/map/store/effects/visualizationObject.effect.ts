import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { Store } from '@ngrx/store';
import { map, switchMap, catchError, combineLatest, flatMap, mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/zip';

import * as visualizationObjectActions from '../actions/visualization-object.action';
import * as legendSetActions from '../actions/legend-set.action';
import * as layerActions from '../actions/layers.action';
import * as fromServices from '../../services';
import * as fromStore from '../../store';
import * as fromUtils from '../../utils';
import { tap } from 'rxjs/operators/tap';
import { Layer } from '../../models/layer.model';
import { mergeAll } from 'rxjs/operators/mergeAll';
import { toGeoJson } from '../../utils/layers';
import { timeFormat } from 'd3-time-format';

@Injectable()
export class VisualizationObjectEffects {
  private program: string;
  private programStage: string;

  constructor(
    private actions$: Actions,
    private store: Store<fromStore.MapState>,
    private geofeatureService: fromServices.GeoFeatureService,
    private analyticsService: fromServices.AnalyticsService,
    private systemService: fromServices.SystemService
  ) {}
  @Effect()
  createVisualizationObjet$ = this.actions$
    .ofType(visualizationObjectActions.CREATE_VISUALIZATION_OBJECT)
    .pipe(
      map(
        (action: visualizationObjectActions.CreateVisualizationObject) =>
          new visualizationObjectActions.CreateVisualizationObjectSuccess(action.payload)
      ),
      catchError(error => of(new visualizationObjectActions.CreateVisualizationObjectFail(error)))
    );

  @Effect()
  updateStyleVisualizationObjet$ = this.actions$
    .ofType(layerActions.UPDATE_LAYER_STYLE)
    .pipe(
      map(
        (action: visualizationObjectActions.UpdateVisualizationObject) =>
          new visualizationObjectActions.UpdateVisualizationObjectSuccess(action.payload)
      ),
      catchError(error => of(new visualizationObjectActions.UpdateVisualizationObjectFail(error)))
    );

  @Effect({ dispatch: false })
  dispatchCreateAnalytics$ = this.actions$
    .ofType(visualizationObjectActions.CREATE_VISUALIZATION_OBJECT_SUCCESS)
    .pipe(
      map((action: visualizationObjectActions.CreateVisualizationObjectSuccess) => {
        const layers = action.payload.layers;
        const needsAnalytics = layers.filter(
          layer => layer && (layer.type === 'event' || layer.type === 'thematic')
        );

        if (needsAnalytics.length) {
          this.store.dispatch(new visualizationObjectActions.LoadAnalyticsVizObj(action.payload));
        }
      })
    );

  @Effect({ dispatch: false })
  dispatchAddOrgUnitGroupSet$ = this.actions$
    .ofType(visualizationObjectActions.CREATE_VISUALIZATION_OBJECT_SUCCESS)
    .pipe(
      tap((action: visualizationObjectActions.CreateVisualizationObjectSuccess) => {
        const layers = action.payload.layers;
        const needsOrgUnitGroupSet = layers.filter(
          layer => layer && layer.dataSelections.organisationUnitGroupSet
        );
        if (needsOrgUnitGroupSet.length) {
          this.store.dispatch(
            new visualizationObjectActions.AddOrgUnitGroupSetVizObj(action.payload)
          );
        }
      })
    );

  @Effect({ dispatch: false })
  dispatchAddLegendSetSet$ = this.actions$
    .ofType(visualizationObjectActions.CREATE_VISUALIZATION_OBJECT_SUCCESS)
    .pipe(
      tap((action: visualizationObjectActions.CreateVisualizationObjectSuccess) => {
        const layers = action.payload.layers;
        const needsLegendSets = layers.filter(layer => layer && layer.dataSelections.legendSet);
        if (needsLegendSets.length) {
          this.store.dispatch(new legendSetActions.LoadLegendSet(action.payload));
        }
      })
    );

  @Effect({ dispatch: false })
  dispatchCreateGeoFeatures$ = this.actions$
    .ofType(visualizationObjectActions.CREATE_VISUALIZATION_OBJECT_SUCCESS)
    .pipe(
      tap((action: visualizationObjectActions.CreateVisualizationObjectSuccess) => {
        const { layers } = action.payload;
        const entities = this.getParameterEntities(layers);
        const values = Object.keys(entities).map(key => entities[key]);
        this.geofeatureService
          .getGeoFeaturesArray(values)
          .pipe(map(geofeature => console.log(geofeature)));
      })
    );

  @Effect()
  dispatchAddGeoFeatures$ = this.actions$
    .ofType(visualizationObjectActions.CREATE_VISUALIZATION_OBJECT)
    .pipe(
      map((action: visualizationObjectActions.CreateVisualizationObjectSuccess) => action.payload),
      switchMap(vizObject => {
        const { layers } = vizObject;
        const entities = this.getParameterEntities(layers);
        const values = Object.keys(entities).map(key => entities[key]);
        return this.geofeatureService.getGeoFeaturesArray(values).pipe(
          map(geofeature => {
            const geofeatures = Object.keys(entities).reduce((arr = {}, key, index) => {
              return { ...arr, [key]: geofeature[index] };
            }, {});
            return new visualizationObjectActions.AddGeoFeaturesVizObj({
              ...vizObject,
              geofeatures
            });
          }),
          catchError(error =>
            of(new visualizationObjectActions.AddVisualizationObjectCompleteFail(error))
          )
        );
      })
    );

  @Effect({ dispatch: false })
  dispatchAddGeoFeaturescomplete$ = this.actions$
    .ofType(visualizationObjectActions.ADD_VISUALIZATION_OBJECT_COMPLETE)
    .pipe(
      switchMap((action: visualizationObjectActions.AddVisualizationObjectComplete) => {
        const vizObject = action.payload;
        const { layers } = vizObject;
        const _layers = layers.map(layer => {
          const { layerOptions } = layer;
          if (layerOptions.serverClustering) {
            const url = this.getEventLayerUrl(layer);
            const { dataSelections } = layer;
            this.program = dataSelections.program && dataSelections.program.displayName;
            this.programStage =
              dataSelections.programStage && dataSelections.programStage.displayName;
            const load = (params, callback) => {
              const serverSide = `/events/cluster/${url}&clusterSize=${params.clusterSize}&bbox=${
                params.bbox
              }&coordinatesOnly=true&includeClusterPoints=${params.includeClusterPoints}`;
              this.analyticsService
                .getEventsAnalytics(serverSide)
                .subscribe(data => callback(params.tileId, toGeoJson(data)));
            };
            const popup = this.onEventClick.bind(this);
            const serverSideConfig = { ...layerOptions.serverSideConfig, load, popup };
            const _layerOptions = { ...layerOptions, serverSideConfig };
            return { ...layer, layerOptions: _layerOptions };
          }
          if (layer.type === 'earthEngine') {
            const accessToken = callback =>
              this.systemService.getGoogleEarthToken().subscribe(json => callback(json));
            const earthEngineConfig = { ...layerOptions.earthEngineConfig, accessToken };
            const _layerOptions = { ...layerOptions, earthEngineConfig };
            return { ...layer, layerOptions: _layerOptions };
          }
          return layer;
        });

        const entities = this.getParameterEntities(layers);
        const parameters = Object.keys(entities).map(key => entities[key]);
        const sources = parameters.map(param => {
          return this.geofeatureService.getGeoFeatures(param);
        });

        if (sources.length === 0) {
          this.store.dispatch(
            new visualizationObjectActions.AddVisualizationObjectCompleteSuccess({
              ...vizObject,
              layers: _layers
            })
          );
        }

        // This is a hack find a way not to subscribe please!
        // TODO: remove this hack;
        Observable.combineLatest(sources).subscribe(geofeature => {
          if (geofeature) {
            const geofeatures = Object.keys(entities).reduce((arr = {}, key, index) => {
              return { ...arr, [key]: geofeature[index] };
            }, {});
            this.store.dispatch(
              new visualizationObjectActions.AddVisualizationObjectCompleteSuccess({
                ...vizObject,
                layers: _layers,
                geofeatures
              })
            );
          }
        });
        return Observable.zip(sources);
      })
    );

  getParameterEntities(layers: Layer[]) {
    let globalEntities = {};
    layers.reduce((entities = {}, layer, index) => {
      const { rows, columns, filters } = layer.dataSelections;
      const isFacility = layer.type === 'facility';
      if (layer.type === 'external' || layer.type === 'earthEngine') {
        return;
      }
      const requestParams = [...rows, ...columns, ...filters];
      const data = requestParams.filter(dimension => dimension.dimension === 'ou');
      const parameter = data
        .map((param, paramIndex) => {
          return `ou=${param.dimension}:${param.items
            .map(item => item.id || item.dimensionItem)
            .join(';')}`;
        })
        .join('&');
      const url = isFacility
        ? `${parameter}&displayProperty=SHORTNAME&includeGroupSets=true`
        : `${parameter}&displayProperty=NAME`;
      const entity = { [layer.id]: url };

      globalEntities = { ...globalEntities, ...entity };
      return { ...entities, ...entity };
    }, {});
    return globalEntities;
  }

  private onEventClick(event) {
    const layer = event.layer;
    const feature = layer._feature;
    const coord = feature.geometry.coordinates;
    this.analyticsService.getEventInformation(feature.id).subscribe(data => {
      const { orgUnitName, dataValues, eventDate, coordinate } = data;
      const content = `<table><tbody> <tr>
                      <th>Organisation unit: </th><td>${orgUnitName}</td></tr>
                    <tr><th>Event time: </th>
                      <td>${timeFormat('%Y-%m-%d')(new Date(eventDate))}</td>
                    </tr>
                    <tr><th>Program Stage: </th>
                      <td>${this.programStage}</td>
                    </tr>
                    <tr>
                      <th>Event location: </th>
                      <td>${Number(coordinate.latitude).toFixed(6)}, ${Number(
        coordinate.longitude
      ).toFixed(6)}</td>
                    </tr></tbody></table>`;
      // Close any popup if there is one
      layer.closePopup();
      // Bind new popup to the layer
      layer.bindPopup(content);
      // Open the binded popup
      layer.openPopup();
    });
  }

  private getEventLayerUrl(layer) {
    const requestParams = [
      ...layer.dataSelections.rows,
      ...layer.dataSelections.columns,
      ...layer.dataSelections.filters
    ];
    const dimensions = [];

    requestParams.map(param => {
      const dimension = `dimension=${param.dimension}`;
      if (param.items.length) {
        dimensions.push(`${dimension}:${param.items.map(item => item.dimensionItem).join(';')}`);
      } else {
        if (param.dimension !== 'dx' && param.dimension !== 'pe') {
          dimensions.push(dimension);
        }
      }
    });
    let url = `${layer.dataSelections.program.id}.json?stage=${
      layer.dataSelections.programStage.id
    }&${dimensions.join('&')}`;
    if (layer.dataSelections.endDate) {
      url += `&endDate=${layer.dataSelections.endDate.split('T')[0]}`;
    }
    if (layer.dataSelections.startDate) {
      url += `&startDate=${layer.dataSelections.startDate.split('T')[0]}`;
    }
    return url;
  }
}
