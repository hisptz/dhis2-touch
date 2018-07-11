import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { Store } from '@ngrx/store';
import { map, switchMap, catchError, combineLatest } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import * as legendSetAction from '../actions/legend-set.action';
import * as visualizationObjectActions from '../actions/visualization-object.action';
import * as fromServices from '../../services';
import { tap } from 'rxjs/operators/tap';
import * as fromStore from '../../store';

@Injectable()
export class LegendSetEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromStore.MapState>,
    private legendSetService: fromServices.LegendSetService
  ) {}

  @Effect()
  loadLegendSets$ = this.actions$.ofType(legendSetAction.LOAD_LEGEND_SET).pipe(
    switchMap((action: visualizationObjectActions.CreateVisualizationObjectSuccess) => {
      const layers = action.payload.layers;
      const legendSetLayers = {};
      const legendIds = [];
      layers.map(layer => {
        const { dataSelections } = layer;
        const { legendSet } = dataSelections;
        if (legendSet) {
          legendSetLayers[legendSet.id] = layer.id;
          legendIds.push(legendSet.id);
        }
      });
      const sources = legendIds.map(id => this.legendSetService.getMapLegendSet(id));
      return Observable.combineLatest(sources).pipe(
        map(lgSets => {
          const entity = lgSets.reduce((entities, currentVal, index) => {
            entities[legendSetLayers[currentVal.id]] = currentVal;
            return entities;
          }, {});
          const legendSets = {
            ...action.payload.legendSets,
            ...entity
          };
          const vizObject = {
            ...action.payload,
            legendSets
          };
          return new visualizationObjectActions.AddLegendVizObj(vizObject);
        }),
        catchError(error => of(new visualizationObjectActions.CreateVisualizationObjectFail(error)))
      );
    })
  );

  @Effect()
  loadAllLegendSets$ = this.actions$.ofType(legendSetAction.LOAD_LEGEND_SET_ALL).pipe(
    switchMap((action: legendSetAction.LoadAllLegendSet) => {
      return this.legendSetService.getAllLegendSets().pipe(
        map(legendSets => {
          return new legendSetAction.LoadAllLegendSetSuccess(legendSets);
        }),
        catchError(error => of(new legendSetAction.LoadAllLegendSetFail(error)))
      );
    })
  );

  @Effect()
  addLegendSets$ = this.actions$
    .ofType(legendSetAction.ADD_LEGEND_SET)
    .pipe(
      map(
        (action: legendSetAction.AddLegendSetSuccess) =>
          new legendSetAction.AddLegendSetSuccess(action.payload)
      ),
      catchError(error => of(new legendSetAction.AddLegendSetFail(error)))
    );

  @Effect()
  updateLegendSets$ = this.actions$
    .ofType(legendSetAction.UPDATE_LEGEND_SET)
    .pipe(
      map(
        (action: legendSetAction.UpdateLegendSet) =>
          new legendSetAction.UpdateLegendSetSuccess(action.payload)
      ),
      catchError(error => of(new legendSetAction.UpdateLegendSetFail(error)))
    );

  @Effect()
  changeOpacity$ = this.actions$
    .ofType(legendSetAction.CHANGE_LEGEND_SET_LAYER_OPACITY)
    .pipe(
      map(
        (action: legendSetAction.ChangeLegendSetLayerOpacity) =>
          new legendSetAction.UpdateLegendSetSuccess(action.payload)
      ),
      catchError(error => of(new legendSetAction.UpdateLegendSetFail(error)))
    );

  @Effect({ dispatch: false })
  changeLayerVisibility$ = this.actions$
    .ofType(legendSetAction.CHANGE_LEGEND_SET_LAYER_VISIBILITY)
    .pipe(
      map((action: legendSetAction.ChangeLegendSetLayerVisibility) => {
        console.log(action.payload);
      }),
      catchError(error => of(new legendSetAction.UpdateLegendSetFail(error)))
    );
}
