import { Injectable } from "@angular/core";
import { Actions, Effect } from "@ngrx/effects";
import * as _ from "lodash";
import { map, tap, switchMap, flatMap } from "rxjs/operators";
import { catchError } from "rxjs/operators/catchError";
import { of } from "rxjs/observable/of";
import { Observable } from "rxjs/Observable";
import { Store } from "@ngrx/store";

import { ApplicationState } from "../reducers";
import { HttpClientProvider } from "../../providers/http-client/http-client";
import { Visualization } from "../../models/visualization";
import * as fromVisualizationHelpers from "../helpers";
import * as fromDashboardActions from "../actions/dashboard.actions";
import * as fromVisualizationActions from "../actions/visualization.actions";

import { Dashboard } from "../../models/dashboard";

@Injectable()
export class VisualizationEffects {
  constructor(
    private actions$: Actions,
    private store: Store<ApplicationState>,
    private httpClient: HttpClientProvider
  ) { }

  @Effect({ dispatch: false })
  setInitialVisualizations$ = this.actions$
    .ofType<fromDashboardActions.SetCurrentAction>(
    fromDashboardActions.DashboardActions.SET_CURRENT
    )
    .withLatestFrom(this.store)
    .pipe(
    tap(([action, state]: [any, ApplicationState]) => {
      const visualizationObjects: Visualization[] =
        state.visualization.visualizationObjects;
      const currentDashboard: Dashboard = _.find(state.dashboard.dashboards, [
        "id",
        action.payload
      ]);
      if (currentDashboard) {
        const initialVisualizations: Visualization[] = currentDashboard.dashboardItems
          .map(
          (dashboardItem: any) =>
            !_.find(visualizationObjects, ["id", dashboardItem.id])
              ? fromVisualizationHelpers.mapDashboardItemToVisualization(
                dashboardItem,
                currentDashboard.id,
                state.currentUser.data
              )
              : null
          )
          .filter((visualizationObject: Visualization) => visualizationObject)
          .map(
          (visualizationObject: any, visualizationObjectIndex: number) => {
            return {
              ...visualizationObject,
              details: {
                ...visualizationObject.details,
                expanded: visualizationObjectIndex === 0
              }
            };
          }
          );

        /**
         * Update store with initial visualization objects
         */
        if (initialVisualizations.length > 0) {
          this.store.dispatch(
            new fromVisualizationActions.SetInitialAction(
              initialVisualizations
            )
          );

          /**
           * Update first visualization with favorites
           */
          const firstVisualizationObject: Visualization =
            initialVisualizations[0];
          this.store.dispatch(
            new fromVisualizationActions.LoadFavoriteAction(
              initialVisualizations[0]
            )
          );
        }
      }
    })
    );

  @Effect({ dispatch: false })
  toggleVisualization$ = this.actions$
    .ofType<fromVisualizationActions.ToggleVisualizationAction>(
    fromVisualizationActions.VisualizationActions.TOGGLE_VISUALIZATION)
    .pipe(
    tap((action: fromVisualizationActions.ToggleVisualizationAction) => {
      const toggledVisualization: Visualization = action.payload;
      if (toggledVisualization && !toggledVisualization.details.loaded && !toggledVisualization.details.expanded) {
        this.store.dispatch(new fromVisualizationActions.LoadFavoriteAction({
          ...toggledVisualization,
          details: {
            ...toggledVisualization.details,
            expanded: !toggledVisualization.details.expanded
          }
        }))
      }
    })
    );

  @Effect()
  laodFavorite$ = this.actions$
    .ofType<fromVisualizationActions.LoadFavoriteAction>(
    fromVisualizationActions.VisualizationActions.LOAD_FAVORITE
    )
    .flatMap((action: any) => {
      const favoriteUrl = fromVisualizationHelpers.getVisualizationFavoriteUrl(
        action.payload.details.favorite
      );

      const favoritePromise =
        favoriteUrl !== ""
          ? this.httpClient.get(favoriteUrl, true)
          : Observable.of({});

      return favoritePromise.map((favorite: any) =>
        fromVisualizationHelpers.updateVisualizationWithSettings(
          action.payload,
          favorite
        )
      );
    })
    .map(
    (visualizationObject: any) =>
      new fromVisualizationActions.LoadAnalyticsAction(visualizationObject)
    );

  @Effect()
  loadAnalytics$ = this.actions$
    .ofType<fromVisualizationActions.LoadAnalyticsAction>(
    fromVisualizationActions.VisualizationActions.LOAD_ANALYTICS
    )
    .flatMap((action: any) => {
      const visualizationObject: Visualization = { ...action.payload };
      const visualizationDetails: any = { ...visualizationObject.details };
      const visualizationLayers: any[] = [...visualizationObject.layers];
      const analyticsPromises = _.map(
        visualizationLayers,
        (visualizationLayer: any) => {
          const visualizationFilter = _.find(visualizationDetails.filters, [
            "id",
            visualizationLayer.settings.id
          ]);
          const analyticsUrl = fromVisualizationHelpers.constructAnalyticsUrl(
            visualizationObject.type,
            visualizationLayer.settings,
            visualizationFilter ? visualizationFilter.filters : []
          );
          return analyticsUrl !== ""
            ? this.httpClient.get(analyticsUrl, true)
            : Observable.of(null);
        }
      );

      return new Observable(observer => {
        Observable.forkJoin(analyticsPromises).subscribe(
          (analyticsResponse: any[]) => {
            visualizationDetails.loaded = true;
            visualizationObject.layers = [
              ..._.map(
                visualizationLayers,
                (visualizationLayer: any, layerIndex: number) => {
                  const newVisualizationLayer: any = { ...visualizationLayer };
                  const visualizationFilter = _.find(
                    visualizationDetails.filters,
                    ["id", visualizationLayer.settings.id]
                  );
                  const analytics = fromVisualizationHelpers.getSanitizedAnalytics(
                    { ...analyticsResponse[layerIndex] },
                    visualizationFilter ? visualizationFilter.filters : []
                  );

                  if (analytics.headers) {
                    newVisualizationLayer.analytics = analytics;
                  }
                  return newVisualizationLayer;
                }
              )
            ];

            visualizationObject.details = { ...visualizationDetails };
            observer.next(visualizationObject);
            observer.complete();
          },
          error => {
            visualizationDetails.loaded = true;
            visualizationDetails.hasError = true;
            visualizationDetails.errorMessage = error;
            visualizationObject.details = { ...visualizationDetails };
            observer.next(visualizationObject);
            observer.complete();
          }
        );
      });
    })
    .map((visualizationObject: Visualization) => {
      visualizationObject.operatingLayers = [...visualizationObject.layers];
      // if (visualizationObject.details.currentVisualization === 'MAP') {
      //   return new fromVisualizationActions.UpdateVisualizationWithMapSettingsAction(
      //     visualizationObject
      //   );
      // } else if (
      //   visualizationObject.details.type === 'MAP' &&
      //   visualizationObject.details.currentVisualization !== 'MAP'
      // ) {
      //   // TODO find best way to merge visualization object
      //   // visualizationObject = this.visualizationObjectService.mergeVisualizationObject(visualization);
      // }
      return new fromVisualizationActions.AddOrUpdateAction({
        visualizationObject: visualizationObject,
        placementPreference: "normal"
      });
    });

  @Effect()
  visualizationWithMapSettings$ = this.actions$
    .ofType<fromVisualizationActions.UpdateVisualizationWithMapSettingsAction>(
    fromVisualizationActions.VisualizationActions
      .UPDATE_VISUALIZATION_WITH_MAP_SETTINGS
    )
    .flatMap(action => this._updateVisualizationWithMapSettings(action.payload))
    .map(
    (visualizationObject: Visualization) =>
      new fromVisualizationActions.AddOrUpdateAction({
        visualizationObject: visualizationObject,
        placementPreference: "normal"
      })
    );

  @Effect()
  visualizationChange$ = this.actions$
    .ofType<fromVisualizationActions.VisualizationChangeAction>(
    fromVisualizationActions.VisualizationActions.VISUALIZATION_CHANGE
    )
    .withLatestFrom(this.store)
    .switchMap(([action, state]: [any, ApplicationState]) => {
      const correspondingVisualizationObject: Visualization = _.find(
        state.visualization.visualizationObjects,
        ["id", action.payload.id]
      );

      return new Observable(observer => {
        if (correspondingVisualizationObject) {
          if (action.payload.type === "MAP") {
            // TODO perform map related actions
            observer.next({
              ...correspondingVisualizationObject,
              details: {
                ...correspondingVisualizationObject.details,
                currentVisualization: action.payload.type
              },
              layers: [...correspondingVisualizationObject.operatingLayers]
            });
            observer.complete();
          } else {
            observer.next({
              ...correspondingVisualizationObject,
              details: {
                ...correspondingVisualizationObject.details,
                currentVisualization: action.payload.type
              },
              layers: [...correspondingVisualizationObject.operatingLayers]
            });
            observer.complete();
          }
        } else {
          observer.next(null);
          observer.complete();
        }
      });
    })
    .map(
    (visualizationObject: Visualization) =>
      new fromVisualizationActions.AddOrUpdateAction({
        visualizationObject: visualizationObject,
        placementPreference: "normal"
      })
    );

  @Effect()
  localFilterChange$ = this.actions$
    .ofType<fromVisualizationActions.LocalFilterChangeAction>(
    fromVisualizationActions.VisualizationActions.LOCAL_FILTER_CHANGE
    )
    .flatMap((action: any) =>
      Observable.of(
        fromVisualizationHelpers.updateVisualizationWithCustomFilters(
          action.payload.visualizationObject,
          fromVisualizationHelpers.getSanitizedCustomFilterObject(
            action.payload.filterValue
          )
        )
      )
    )
    .map(
    (visualizationObject: Visualization) =>
      new fromVisualizationActions.LoadAnalyticsAction(visualizationObject)
    );
  //
  // @Effect({dispatch: false})
  // globalFilterChanges$ = this.actions$
  //   .ofType<visualization.GlobalFilterChangeAction>(visualization.VisualizationActions.GLOBAL_FILTER_CHANGE)
  //   .withLatestFrom(this.store)
  //   .pipe(
  //     tap(([action, state]: [any, AppState]) => {
  //       _.each(state.visualization.visualizationObjects, (visualizationObject: Visualization) => {
  //         this.store.dispatch(new visualization.LocalFilterChangeAction({
  //           visualizationObject: visualizationObject,
  //           filterValue: action.payload
  //         }));
  //       });
  //     })
  //   );
  //
  // @Effect({dispatch: false})
  // resizeAction$ = this.actions$
  //   .ofType<visualization.ResizeAction>(
  //     visualization.VisualizationActions.RESIZE
  //   )
  //   .switchMap((action: any) =>
  //     this._resize(action.payload.visualizationId, action.payload.shape)
  //   )
  //   .map(() => new visualization.ResizeSuccessAction());
  //
  // @Effect()
  // deleteActions$ = this.actions$
  //   .ofType<visualization.DeleteAction>(
  //     visualization.VisualizationActions.DELETE
  //   )
  //   .pipe(
  //     map((action: visualization.DeleteAction) => action.payload),
  //     switchMap(({dashboardId, visualizationId}) =>
  //       this._delete(dashboardId, visualizationId).pipe(
  //         map(
  //           () =>
  //             new visualization.DeleteSuccessAction({
  //               dashboardId,
  //               visualizationId
  //             })
  //         ),
  //         catchError(() =>
  //           of(new visualization.DeleteFailAction(visualizationId))
  //         )
  //       )
  //     )
  //   );
  //
  // @Effect()
  // deleteSuccess$ = this.actions$
  //   .ofType<visualization.DeleteSuccessAction>(
  //     visualization.VisualizationActions.DELETE_SUCCESS
  //   )
  //   .pipe(
  //     map((action: visualization.DeleteSuccessAction) => action.payload),
  //     map(
  //       ({dashboardId, visualizationId}) =>
  //         new fromDashboardActions.DeleteItemSuccessAction({
  //           dashboardId,
  //           visualizationId
  //         })
  //     )
  //   );

  private _delete(dashboardId: string, visualizationId: string) {
    return this.httpClient.delete(
      "dashboards/" + dashboardId + "/items/" + visualizationId
    );
  }

  private _updateVisualizationWithMapSettings(
    visualizationObject: Visualization
  ) {
    const newVisualizationObject: Visualization =
      visualizationObject.details.type !== "MAP"
        ? fromVisualizationHelpers.getSplitedVisualization(visualizationObject)
        : { ...visualizationObject };

    const newVisualizationObjectDetails: any = {
      ...newVisualizationObject.details
    };

    const dimensionArea = this._findOrgUnitDimension(
      newVisualizationObject.details.layouts[0].layout
    );
    return new Observable(observer => {
      newVisualizationObjectDetails.mapConfiguration = fromVisualizationHelpers.getMapConfiguration(
        visualizationObject
      );
      const geoFeaturePromises = _.map(
        newVisualizationObject.layers,
        (layer: any) => {
          const visualizationFilters = fromVisualizationHelpers.getDimensionValues(
            layer.settings[dimensionArea],
            []
          );
          const orgUnitFilterObject = _.find(
            visualizationFilters ? visualizationFilters : [],
            ["name", "ou"]
          );
          const orgUnitFilterValue = orgUnitFilterObject
            ? orgUnitFilterObject.value
            : "";
          /**
           * Get geo feature
           * @type {string}
           */
          // TODO find best way to reduce number of geoFeature calls
          const geoFeatureUrl = fromVisualizationHelpers.getGeoFeatureUrl(
            orgUnitFilterValue
          );
          return geoFeatureUrl !== ""
            ? this.httpClient.get(geoFeatureUrl, true)
            : Observable.of(null);
        }
      );

      Observable.forkJoin(geoFeaturePromises).subscribe(
        (geoFeatureResponse: any[]) => {
          newVisualizationObject.layers = newVisualizationObject.layers.map(
            (layer: any, layerIndex: number) => {
              const newSettings: any = { ...layer.settings };
              if (geoFeatureResponse[layerIndex] !== null) {
                newSettings.geoFeature = [...geoFeatureResponse[layerIndex]];
              }
              return { ...layer, settings: newSettings };
            }
          );
          newVisualizationObjectDetails.loaded = true;
          observer.next({
            ...newVisualizationObject,
            details: newVisualizationObjectDetails
          });
          observer.complete();
        },
        error => {
          newVisualizationObjectDetails.hasError = true;
          newVisualizationObjectDetails.errorMessage = error;
          newVisualizationObjectDetails.loaded = true;
          observer.next({
            ...newVisualizationObject,
            details: newVisualizationObjectDetails
          });
          observer.complete();
        }
      );
    });
  }

  private _findOrgUnitDimension(visualizationLayout: any) {
    let dimensionArea = "";

    if (_.find(visualizationLayout.columns, ["value", "ou"])) {
      dimensionArea = "columns";
    } else if (_.find(visualizationLayout.rows, ["value", "ou"])) {
      dimensionArea = "rows";
    } else {
      dimensionArea = "filters";
    }

    return dimensionArea;
  }

  private _resize(visualizationId: string, shape: string) {
    return this.httpClient.put(
      "dashboardItems/" + visualizationId + "/shape/" + shape,
      ""
    );
  }
}
