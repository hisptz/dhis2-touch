import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import * as visualizationObjectActions from '../actions/visualization-object.action';
import * as dataSelectionAction from '../actions/data-selection.action';
import * as layersActions from '../actions/layers.action';
import * as fromServices from '../../services';
import * as fromStore from '../../store';
import { getDimensionItems } from '../../utils/analytics';
import { toGeoJson } from '../../utils/layers';
@Injectable()
export class AnalyticsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromStore.MapState>,
    private analyticsService: fromServices.AnalyticsService
  ) {}

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

  @Effect({ dispatch: false })
  updateOu$ = this.actions$
    .ofType(
      dataSelectionAction.UPDATE_OU_SELECTION,
      dataSelectionAction.UPDATE_DX_SELECTION,
      dataSelectionAction.UPDATE_PE_SELECTION
    )
    .pipe(
      map((action: dataSelectionAction.UpdateDXSelection) => action.payload),
      switchMap(payload => {
        const { componentId, layer, newdimension } = payload;
        const { params, newLayer } = this.createParams(payload);
        if (params.length) {
          return this.analyticsService.getAnalytics(params.join('&')).pipe(
            map(analytics =>
              this.store.dispatch(
                new visualizationObjectActions.UpdateFilterAnalytics({
                  analytics: { [layer.id]: analytics },
                  componentId,
                  layer: newLayer
                })
              )
            ),
            catchError(error =>
              of(new visualizationObjectActions.UpdateVisualizationObjectFail(error))
            )
          );
        }
      }),
      catchError(error => of(new visualizationObjectActions.UpdateVisualizationObjectFail(error)))
    );

  createParams(payload) {
    const { componentId, layer, params, filterType, newdimension } = payload;
    const layerName = layer.type;
    const dataselections = [
      ...layer.dataSelections.rows,
      ...layer.dataSelections.columns,
      ...layer.dataSelections.filters
    ];
    const newparam = `dimension=${filterType}:${params}`;
    const noAnalyticsLayers = ['boundary', 'facility', 'external', 'event'];
    const oldDataselections = { ...layer.dataSelections };
    let newDatas = {};
    const newDataSelection = ['rows', 'columns', 'filters'].map(key => {
      const oldObj = oldDataselections[key].map(item => {
        if (item.dimension === filterType) {
          return { ...newdimension };
        }
        return item;
      });
      const keyValue = { [key]: [...oldObj] };
      newDatas = { ...newDatas, ...keyValue };
    });

    const dataSelections = { ...oldDataselections, ...newDatas };
    if (noAnalyticsLayers.indexOf(layerName) === -1) {
      const oldSelection = dataselections.filter(
        dataselection => dataselection.dimension !== filterType
      );
      const getOldParams = oldSelection.map(
        dataselection =>
          `dimension=${dataselection.dimension}:${dataselection.items
            .map(item => item.dimensionItem || item.id)
            .join(';')}`
      );
      return {
        params: [...getOldParams, newparam],
        newLayer: { ...layer, dataSelections }
      };
    }
    return {
      newLayer: { ...layer, dataSelections },
      params: []
    };
  }
}
