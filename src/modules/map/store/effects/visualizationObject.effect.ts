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
import * as fromServices from '../../services';
import * as fromStore from '../../store';
import { tap } from 'rxjs/operators/tap';
import { Layer } from '../../models/layer.model';
import { mergeAll } from 'rxjs/operators/mergeAll';

@Injectable()
export class VisualizationObjectEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromStore.MapState>,
    private geofeatureService: fromServices.GeoFeatureService
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

  // @Effect({ dispatch: false })
  // dispatchCreateVizObjectComplete$ = this.actions$
  //   .ofType(visualizationObjectActions.ADD_VISUALIZATION_OBJECT_COMPLETE)
  //   .pipe(
  //     tap((action: visualizationObjectActions.AddVisualizationObjectComplete) => {
  //       const visualizationObject = action.payload;
  //       // console.log('Is actually Listening:::', visualizationObject);
  //       this.store.dispatch(new visualizationObjectActions.AddVisualizationObjectCompleteSuccess(visualizationObject));
  //     })
  //   );

  @Effect({ dispatch: false })
  dispatchAddGeoFeaturescomplete$ = this.actions$
    .ofType(visualizationObjectActions.ADD_VISUALIZATION_OBJECT_COMPLETE)
    .pipe(
      switchMap((action: visualizationObjectActions.AddVisualizationObjectComplete) => {
        const vizObject = action.payload;
        const { layers } = vizObject;
        const entities = this.getParameterEntities(layers);
        const parameters = Object.keys(entities).map(key => entities[key]);
        const sources = parameters.map(param => {
          return this.geofeatureService.getGeoFeatures(param);
        });

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
      if (layer.type === 'external') {
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
}
