import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import * as visualizationObjectActions from '../actions/visualization-object.action';
import * as layersActions from '../actions/layers.action';
import * as fromServices from '../../services';

@Injectable()
export class AnalyticsEffects {
  constructor(private actions$: Actions, private analyticsService: fromServices.AnalyticsService) {}

  @Effect()
  addAnalytics$ = this.actions$.ofType(visualizationObjectActions.LOAD_ANALYTICS).pipe(
    switchMap((action: visualizationObjectActions.LoadAnalyticsVizObj) => {
      const layerIds = [];
      const layersParams = action.payload.layers.map(layer => {
        const requestParams = [
          ...layer.dataSelections.rows,
          ...layer.dataSelections.columns,
          ...layer.dataSelections.filters
        ];
        const noAnalyticsLayers = ['boundary', 'facility', 'external', 'event'];
        const layerName = layer.type;
        if (noAnalyticsLayers.indexOf(layerName) === -1) {
          layerIds.push(layer.id);
          return requestParams
            .map((param, paramIndex) => {
              return `dimension=${param.dimension}:${param.items.map(item => item.id).join(';')}`;
            })
            .join('&');
        }

        if (layerName === 'event') {
          layerIds.push(layer.id);
          const data = requestParams
            .map((param, paramIndex) => {
              const dimension = `dimension=${param.dimension}`;
              if (param.items.length) {
                return `${dimension}:${param.items.map(item => item.id).join(';')}`;
              }
              return dimension;
            })
            .join('&');
          let url = `/events/query/${layer.dataSelections.program.id}.json?stage=${
            layer.dataSelections.programStage.id
          }&${data}`;
          if (layer.dataSelections.endDate) {
            url += `&endDate=${layer.dataSelections.endDate.split('T')[0]}`;
          }
          if (layer.dataSelections.startDate) {
            url += `&startDate=${layer.dataSelections.startDate.split('T')[0]}`;
          }
          return url;
        }
      });
      const sources = [];
      layersParams.map(param => {
        if (param) {
          if (param.startsWith('/events')) {
            sources.push(this.analyticsService.getEventsAnalytics(param));
          } else {
            sources.push(this.analyticsService.getAnalytics(param));
          }
        }
      });

      const newSources = sources.length ? sources : Observable.create([]);

      return Observable.combineLatest(newSources).pipe(
        map((data, index) => {
          let analytics = {};
          if (data.length) {
            const analyticObj = data.reduce((obj, cur, i) => {
              obj[layerIds[i]] = cur;
              return obj;
            }, {});
            analytics = {
              ...action.payload.analytics,
              ...analyticObj
            };
          }
          const vizObject = {
            ...action.payload,
            analytics
          };
          return new visualizationObjectActions.UpdateVizAnalytics(vizObject);
        }),
        catchError(error => of(new visualizationObjectActions.UpdateVisualizationObjectFail(error)))
      );
    })
  );
}
