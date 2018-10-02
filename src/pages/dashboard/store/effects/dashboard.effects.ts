import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import * as _ from 'lodash';
import {
  DashboardActionTypes,
  LoadDashboardsFailAction,
  LoadDashboardsSuccessAction,
  SetCurrentDashboardAction
} from '../actions/dashboard.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { DashboardService } from '../../services/dashboard.service';
import { of } from 'rxjs/observable/of';
import { AddAllDashboardVisualizationAction } from '../actions/dashboard-visualization.actions';
import { getStandardizedVisualizationObject } from '../../../visualization';
import { AddAllVisualizationObjectsAction } from '../../../visualization/store/actions/visualization-object.actions';
import { AddAllVisualizationUiConfigurationsAction } from '../../../visualization/store/actions/visualization-ui-configuration.actions';
import { getStandardizedVisualizationUiConfig } from '../../../visualization/helpers/get-standardized-visualization-ui-config.helper';
import { DashboardState } from '../reducers/index';

@Injectable()
export class DashboardEffects {
  constructor(
    private actions$: Actions,
    private store: Store<DashboardState>,
    private dashboardService: DashboardService
  ) {}

  @Effect()
  loadDashboards$ = this.actions$
    .ofType(DashboardActionTypes.LOAD_DASHBOARDS)
    .pipe(
      switchMap(() =>
        this.dashboardService.loadAll().pipe(
          map(dashboards => new LoadDashboardsSuccessAction(dashboards)),
          catchError(error => of(new LoadDashboardsFailAction(error)))
        )
      )
    );

  @Effect({ dispatch: false })
  loadDashboardSuccess$ = this.actions$
    .ofType(DashboardActionTypes.LOAD_DASHBOARDS_SUCCESS)
    .pipe(
      tap((action: LoadDashboardsSuccessAction) => {
        // Set current dashboard
        const currentDashboard =
          action.dashboards && action.dashboards.length > 0
            ? action.dashboards[0].id
            : '';
        if (currentDashboard !== '') {
          this.store.dispatch(new SetCurrentDashboardAction(currentDashboard));
        }

        // Set dashboard visualizations
        const dashboardVisualizations = _.map(
          action.dashboards || [],
          dashboard => {
            return {
              id: dashboard.id,
              items: _.map(
                dashboard.dashboardItems,
                dashboardItem => dashboardItem.id
              )
            };
          }
        );

        if (dashboardVisualizations.length > 0) {
          this.store.dispatch(
            new AddAllDashboardVisualizationAction(dashboardVisualizations)
          );
        }

        // Set visualization objects
        const dashboardItems = _.flatten(
          _.map(action.dashboards || [], dashboard =>
            _.map(
              dashboard.dashboardItems,
              (dashboardItem, dashboardItemIndex: number) => {
                return {
                  ...dashboardItem,
                  isOpen: dashboardItemIndex === 0,
                  dashboardId: dashboard.id
                };
              }
            )
          )
        );
        if (dashboardItems.length > 0) {
          this.store.dispatch(
            new AddAllVisualizationObjectsAction(
              _.map(dashboardItems, dashboardItem =>
                getStandardizedVisualizationObject(dashboardItem)
              )
            )
          );
          this.store.dispatch(
            new AddAllVisualizationUiConfigurationsAction(
              _.map(dashboardItems, dashboardItem =>
                getStandardizedVisualizationUiConfig(dashboardItem)
              )
            )
          );
        }
      })
    );
}
