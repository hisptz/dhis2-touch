import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../reducers/index';
import {HttpClientProvider} from '../../providers/http-client/http-client';
import {switchMap, map, catchError} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';

import * as fromCurrentUserActions from '../actions/currentUser.actons';
import * as fromDashboardActions from '../actions/dashboard.actions';
import {Dashboard} from '../../models/dashboard';
import {CurrentUser} from '../../models/currentUser';
import {of} from 'rxjs/observable/of';

@Injectable()
export class DashboardEffects {
  constructor(private actions$: Actions,
              private store: Store<ApplicationState>,
              private httpClient: HttpClientProvider) {
  }

  @Effect()
  currentUserLoaded$ = this.actions$
    .ofType<fromCurrentUserActions.LoadedCurrentUser>(
      fromCurrentUserActions.LOADED_CURRENT_USER
    ).pipe(
      switchMap((action: fromCurrentUserActions.LoadedCurrentUser) =>
        this._loadAll().pipe(
          map((dashboards: Dashboard[]) => new fromDashboardActions.LoadSuccessAction({
              dashboards,
              currentUser: action.payload
            })
          ),
          catchError((error) => of(new fromDashboardActions.LoadFailAction(error)))
        ))
    );


  @Effect()
  dashboardsLoaded$ = this.actions$
    .ofType<fromDashboardActions.LoadSuccessAction>(
      fromDashboardActions.DashboardActions.LOAD_SUCCESS
    ).pipe(
      map((action: fromDashboardActions.LoadSuccessAction) => {
        const dashboards = action.payload.dashboards;

        return dashboards.length > 0 ? dashboards[0].id : '';
      }),
      map((currentDashboardId: string) => new fromDashboardActions.SetCurrentAction(currentDashboardId))
    );
  //
  // @Effect()
  // createDashboard$ = this.actions$
  //   .ofType<dashboard.CreateAction>(dashboard.DashboardActions.CREATE)
  //   .switchMap((action: any) => this._create(action.payload))
  //   .map(
  //     (dashboardObject: any) =>
  //       new dashboard.CreateSuccessAction(dashboardObject)
  //   );
  // // TODO deal with errors when dashboard creation fails
  //
  // @Effect()
  // renameDashboard$ = this.actions$
  //   .ofType<dashboard.RenameAction>(dashboard.DashboardActions.RENAME)
  //   .switchMap((action: any) => this._rename(action.payload))
  //   .map(
  //     (dashboardObject: any) =>
  //       new dashboard.RenameSuccessAction(dashboardObject)
  //   );
  //
  // @Effect({ dispatch: false })
  // dashboardCreated$ = this.actions$
  //   .ofType<dashboard.CreateSuccessAction>(
  //     dashboard.DashboardActions.CREATE_SUCCESS
  //   )
  //   .switchMap((action: any) => {
  //     this.router.navigate([`/dashboards/${action.payload.id}`]);
  //     return Observable.of(null);
  //   });
  //
  // @Effect()
  // deleteDashboard$ = this.actions$
  //   .ofType<dashboard.DeleteAction>(dashboard.DashboardActions.DELETE)
  //   .switchMap((action: any) => this._delete(action.payload))
  //   .map(
  //     (dashboardId: string) => new dashboard.DeleteSuccessAction(dashboardId)
  //   );
  //
  // @Effect({ dispatch: false })
  // dashboardDeleted$ = this.actions$
  //   .ofType<dashboard.DeleteSuccessAction>(
  //     dashboard.DashboardActions.DELETE_SUCCESS
  //   )
  //   .withLatestFrom(this.store)
  //   .switchMap(([action, store]: [any, AppState]) => {
  //     const dashboardIndex = _.findIndex(
  //       store.dashboard.dashboards,
  //       _.find(store.dashboard.dashboards, ['id', action.payload])
  //     );
  //
  //     if (dashboardIndex !== -1) {
  //       const dashboardToNavigate =
  //         store.dashboard.dashboards.length > 1
  //           ? dashboardIndex === 0
  //             ? store.dashboard.dashboards[1]
  //             : store.dashboard.dashboards[dashboardIndex - 1]
  //           : null;
  //
  //       this.store.dispatch(new dashboard.CommitDeleteAction(action.payload));
  //
  //       if (dashboardToNavigate) {
  //         this.router.navigate([`/dashboards/${dashboardToNavigate.id}`]);
  //       } else {
  //         this.router.navigate(['/']);
  //       }
  //     }
  //
  //     return Observable.of(null);
  //   });
  //
  // @Effect({ dispatch: false })
  // route$ = this.actions$
  //   .ofType(ROUTER_NAVIGATION)
  //   .withLatestFrom(this.store)
  //   .switchMap(([action, state]: [any, AppState]) => {
  //     const currentDashboardId = state.route.state.url.split('/')[2];
  //     if (currentDashboardId) {
  //       /**
  //        * Save current dashboard into the store and load visualizations
  //        */
  //       const currentDashboard = _.find(state.dashboard.dashboards, [
  //         'id',
  //         currentDashboardId
  //       ]);
  //
  //       if (currentDashboard) {
  //         /**
  //          * Save current dashboard to local storage
  //          */
  //         localStorage.setItem(
  //           'dhis2.dashboard.current.' +
  //             state.currentUser.userCredentials.username,
  //           currentDashboardId
  //         );
  //
  //         /**
  //          * Set current dashboard in the store
  //          */
  //         this.store.dispatch(
  //           new dashboard.SetCurrentAction(currentDashboard.id)
  //         );
  //         this.store.dispatch(
  //           new dashboard.LoadSharingDataAction(currentDashboardId)
  //         );
  //       }
  //     }
  //     return Observable.of(null);
  //   });
  //
  // @Effect()
  // searchItem$ = this.actions$
  //   .ofType<dashboard.SearchItemsAction>(
  //     dashboard.DashboardActions.SEARCH_ITEMS
  //   )
  //   .switchMap((action: any) =>
  //     action.payload
  //       .debounceTime(400)
  //       .distinctUntilChanged()
  //       .switchMap((term: string) => this._searchItems(term))
  //   )
  //   .map(
  //     (searchResult: any) =>
  //       new dashboard.UpdateSearchResultAction(searchResult)
  //   );
  //
  // @Effect()
  // addDashboardItemAction$ = this.actions$
  //   .ofType<dashboard.AddItemAction>(dashboard.DashboardActions.ADD_ITEM)
  //   .withLatestFrom(this.store)
  //   .switchMap(([action, store]) =>
  //     this._addItem(
  //       store.dashboard.currentDashboard,
  //       action.payload.id,
  //       action.payload.type
  //     )
  //   )
  //   .map(
  //     (dashboardItems: any[]) =>
  //       new dashboard.AddItemSuccessAction(dashboardItems)
  //   );
  //
  // @Effect({ dispatch: false })
  // dashboardItemAddedAction$ = this.actions$
  //   .ofType<dashboard.AddItemSuccessAction>(
  //     dashboard.DashboardActions.ADD_ITEM_SUCCESS
  //   )
  //   .withLatestFrom(this.store)
  //   .switchMap(([action, state]: [any, AppState]) => {
  //     const currentDashboard: Dashboard = _.find(state.dashboard.dashboards, [
  //       'id',
  //       state.dashboard.currentDashboard
  //     ]);
  //
  //     if (currentDashboard) {
  //       const newDashboardItem: any = dashboardHelpers.getCheckedAddedItem(
  //         currentDashboard,
  //         action.payload
  //       );
  //
  //       const initialVisualization: Visualization = visualizationHelpers.mapDashboardItemToVisualization(
  //         newDashboardItem,
  //         state.dashboard.currentDashboard,
  //         state.currentUser
  //       );
  //
  //       this.store.dispatch(
  //         new visualization.AddOrUpdateAction({
  //           visualizationObject: initialVisualization,
  //           placementPreference: 'first'
  //         })
  //       );
  //
  //       this.store.dispatch(
  //         new visualization.LoadFavoriteAction(initialVisualization)
  //       );
  //     }
  //
  //     return Observable.of(null);
  //   });
  //
  // @Effect({ dispatch: false })
  // loadDashboardSharing = this.actions$
  //   .ofType<dashboard.LoadSharingDataAction>(
  //     dashboard.DashboardActions.LOAD_SHARING_DATA
  //   )
  //   .withLatestFrom(this.store)
  //   .pipe(
  //     tap(([action, state]: [any, AppState]) => {
  //       if (
  //         !state.dashboard.dashboardSharing ||
  //         !state.dashboard.dashboardSharing[action.payload]
  //       ) {
  //         this._loadSharingInfo(action.payload).subscribe(
  //           (sharingInfo: DashboardSharing) => {
  //             this.store.dispatch(
  //               new dashboard.LoadSharingDataSuccessAction(sharingInfo)
  //             );
  //           }
  //         );
  //       }
  //     })
  //   );
  //
  // @Effect()
  // loadOptions$ = this.actions$
  //   .ofType<dashboard.LoadOptionsAction>(
  //     dashboard.DashboardActions.LOAD_OPTIONS
  //   )
  //   .take(1)
  //   .withLatestFrom(this.store)
  //   .pipe(
  //     switchMap(([action, state]: [dashboard.LoadOptionsAction, AppState]) =>
  //       this._loadOptions().pipe(
  //         map(
  //           (dashboardOptions: any) =>
  //             new dashboard.LoadOptionsSuccessAction({
  //               dashboardOptions,
  //               currentUser: state.currentUser
  //             })
  //         ),
  //         catchError(() => of(new dashboard.LoadOptionsFailAction()))
  //       )
  //     )
  //   );
  //
  // @Effect()
  // bookmarkDashboard$ = this.actions$
  //   .ofType<dashboard.BookmarkDashboardAction>(
  //     dashboard.DashboardActions.BOOKMARK_DASHBOARD
  //   )
  //   .withLatestFrom(this.store)
  //   .pipe(
  //     map(([action, state]: [any, AppState]) => {
  //       return {
  //         dashboardId: action.payload.dashboardId,
  //         bookmarked: action.payload.bookmarked,
  //         currentUserId: state.currentUser.id
  //       };
  //     }),
  //     switchMap(({ dashboardId, currentUserId, bookmarked }) =>
  //       this._bookmarkDashboard(dashboardId, currentUserId, bookmarked).pipe(
  //         map(() => new dashboard.BookmarkDashboardSuccessAction()),
  //         catchError(() => of(new dashboard.BookmarkDashboardFailAction()))
  //       )
  //     )
  //   );

  private _loadAll(): Observable<Dashboard[]> {
    return this.httpClient
      .get('dashboards.json?fields=id,name,publicAccess,access,externalAccess,created,lastUpdated,user[id,name],dashboardItems[id,type,created,lastUpdated,shape,appKey,reports[id,displayName],chart[id,displayName],map[id,displayName],reportTable[id,displayName],eventReport[id,displayName],eventChart[id,displayName],resources[id,displayName],users[id,displayName]]&paging=false', true).map((res) => res.dashboards || []);
  }

  //
  // private _load(id) {
  //   return this.httpClient
  //     .get(`dashboards/${id}.json?fields=id,name,publicAccess,access,externalAccess,
  //   userGroupAccesses,dashboardItems[id,type,created,shape,appKey,reports[id,displayName],chart[id,displayName],
  //   map[id,displayName],reportTable[id,displayName],eventReport[id,displayName],eventChart[id,displayName],
  //   resources[id,displayName],users[id,displayName]]`);
  // }
  //
  // private _loadOptions() {
  //   return new Observable(observer => {
  //     this.httpClient.get('dataStore/dashboards').subscribe(
  //       (dashboardOptions: any[]) => {
  //         forkJoin(
  //           _.map(dashboardOptions, (dashboardOption: any) =>
  //             this.httpClient.get(`dataStore/dashboards/${dashboardOption}`)
  //           )
  //         ).subscribe(
  //           (dashboardOptionResults: any) => {
  //             observer.next(
  //               _.map(
  //                 dashboardOptionResults,
  //                 (
  //                   dashboardOptionResult: any,
  //                   dashboardOptionIndex: number
  //                 ) => {
  //                   return {
  //                     id: dashboardOptions[dashboardOptionIndex],
  //                     ...dashboardOptionResult
  //                   };
  //                 }
  //               )
  //             );
  //           },
  //           error => observer.error(error)
  //         );
  //       },
  //       error => observer.error(error)
  //     );
  //   });
  // }
  //
  // private _bookmarkDashboard(
  //   dashboardId: string,
  //   currentUserId: string,
  //   bookmarked: boolean
  // ) {
  //   return new Observable(observer => {
  //     this.httpClient.get(`dataStore/dashboards/${dashboardId}`).subscribe(
  //       (dashboardOption: any) => {
  //         this.httpClient
  //           .put(`dataStore/dashboards/${dashboardId}`, {
  //             ...dashboardOption,
  //             bookmarks: bookmarked
  //               ? dashboardOption.bookmarks.indexOf(currentUserId) === -1
  //                 ? [...dashboardOption.bookmarks, currentUserId]
  //                 : [...dashboardOption.bookmarks]
  //               : _.filter(
  //                   dashboardOption.bookmarks,
  //                   bookmark => bookmark !== currentUserId
  //                 )
  //           })
  //           .subscribe(
  //             () => {
  //               observer.next({});
  //               observer.complete();
  //             },
  //             error => observer.error(error)
  //           );
  //       },
  //       () => {
  //         this.httpClient
  //           .post(`dataStore/dashboards/${dashboardId}`, {
  //             id: dashboardId,
  //             bookmarks: [currentUserId]
  //           })
  //           .subscribe(
  //             () => {
  //               observer.next({});
  //               observer.complete();
  //             },
  //             error => observer.error(error)
  //           );
  //       }
  //     );
  //   });
  // }
  //
  // private _create(dashboardName: any): Observable<Dashboard> {
  //   return Observable.create(observer => {
  //     this.getUniqueId().subscribe(
  //       (uniqueId: string) => {
  //         this.httpClient
  //           .post('dashboards', {
  //             id: uniqueId,
  //             name: dashboardName
  //           })
  //           .subscribe(
  //             () => {
  //               this._load(uniqueId).subscribe(
  //                 (dashboardObject: any) => {
  //                   observer.next(dashboardObject);
  //                   observer.complete();
  //                 },
  //                 dashboardLoadError => observer.error(dashboardLoadError)
  //               );
  //             },
  //             dashboardCreationError => observer.error(dashboardCreationError)
  //           );
  //       },
  //       uniqueIdError => observer.error(uniqueIdError)
  //     );
  //   });
  // }
  //
  // private _rename(dashboardData: {
  //   id: string;
  //   name: string;
  // }): Observable<Dashboard> {
  //   return new Observable(observer => {
  //     this.httpClient
  //       .put(`dashboards/${dashboardData.id}`, { name: dashboardData.name })
  //       .subscribe(
  //         () => {
  //           this._load(dashboardData.id).subscribe(
  //             (dashboardObject: any) => {
  //               observer.next(dashboardObject);
  //               observer.complete();
  //             },
  //             dashboardLoadError => observer.error(dashboardLoadError)
  //           );
  //         },
  //         renameError => observer.error(renameError)
  //       );
  //   });
  // }
  //
  // private _delete(dashboardId: string) {
  //   return new Observable(observer => {
  //     this.httpClient.delete(`dashboards/${dashboardId}`).subscribe(
  //       () => {
  //         observer.next(dashboardId);
  //         observer.complete();
  //       },
  //       error => observer.error(error)
  //     );
  //   });
  // }
  //
  // private _searchItems(searchText: string) {
  //   return new Observable(observer => {
  //     this.httpClient
  //       .get(
  //         'dashboards/q/' +
  //           searchText +
  //           '.json?max=USERS&&max=MAP&max=REPORT_TABLE&max=CHART&' +
  //           'max=EVENT_CHART&max=EVENT_REPORT&max=RESOURCES&max=REPORTS&max=APP'
  //       )
  //       .subscribe(
  //         searchResult => {
  //           observer.next(searchResult);
  //           observer.complete();
  //         },
  //         () => {
  //           observer.next(null);
  //           observer.complete();
  //         }
  //       );
  //   });
  // }
  //
  // private _addItem(dashboardId, itemId, dashboardItemType) {
  //   return new Observable(observer => {
  //     this.httpClient
  //       .post(
  //         'dashboards/' +
  //           dashboardId +
  //           '/items/content?type=' +
  //           dashboardItemType +
  //           '&id=' +
  //           itemId,
  //         {}
  //       )
  //       .subscribe(
  //         () => {
  //           this._load(dashboardId).subscribe(
  //             (dashboardResponse: any) => {
  //               observer.next(
  //                 this._retrieveAddedItem(
  //                   dashboardResponse.dashboardItems,
  //                   dashboardItemType,
  //                   itemId
  //                 )
  //               );
  //               observer.complete();
  //             },
  //             () => {
  //               observer.next([]);
  //               observer.complete();
  //             }
  //           );
  //         },
  //         () => {
  //           observer.next([]);
  //           observer.complete();
  //         }
  //       );
  //   });
  // }
  //
  // private _retrieveAddedItem(dashboardItems, dashboardItemType, favoriteId) {
  //   let newItems = [];
  //   if (dashboardItemType[dashboardItemType.length - 1] === 'S') {
  //     newItems = _.clone(
  //       dashboardItems.filter(item => {
  //         return item.type[dashboardItemType.length - 1] === 'S';
  //       })
  //     );
  //   } else {
  //     for (const item of dashboardItems) {
  //       /**
  //        * Get new item for apps
  //        */
  //       if (item.type === 'APP' && dashboardItemType === 'APP') {
  //         newItems = [item];
  //         break;
  //       }
  //
  //       const itemTypeObject = item[_.camelCase(dashboardItemType)];
  //       if (itemTypeObject) {
  //         if (itemTypeObject.id === favoriteId) {
  //           newItems = [item];
  //           break;
  //         }
  //       }
  //     }
  //   }
  //
  //   return newItems;
  // }
  //
  // private _loadSharingInfo(dashboardId: string): Observable<DashboardSharing> {
  //   return this.httpClient
  //     .get('sharing?type=dashboard&id=' + dashboardId)
  //     .map((sharingResponse: any) => {
  //       return sharingResponse && sharingResponse.object
  //         ? {
  //             id: dashboardId,
  //             user: sharingResponse.object.user,
  //             sharingEntity: this._deduceSharingEntities(sharingResponse.object)
  //           }
  //         : null;
  //     });
  // }
  //
  // private _deduceSharingEntities(sharingObject: any): SharingEntity {
  //   return sharingObject
  //     ? this._getEntities(
  //         [
  //           ...this.updateSharingAccessesWithType(
  //             sharingObject.userAccesses,
  //             'user'
  //           ),
  //           ...this.updateSharingAccessesWithType(
  //             sharingObject.userGroupAccesses,
  //             'userGroup'
  //           )
  //         ] || [],
  //         {
  //           external_access: {
  //             id: 'external_access',
  //             name: 'External Access',
  //             isExternal: true,
  //             access: sharingObject.externalAccess
  //           },
  //           public_access: {
  //             id: 'public_access',
  //             name: sharingObject.publicAccess === '--------' ? 'Only me' : 'Everyone',
  //             isPublic: true,
  //             access: sharingObject.publicAccess
  //           }
  //         }
  //       )
  //     : null;
  // }
  //
  // updateSharingAccessesWithType(accessArray: any[], type: string) {
  //   return accessArray
  //     ? _.map(accessArray, (accessObject: any) => {
  //         return {
  //           ...accessObject,
  //           type: type
  //         };
  //       })
  //     : [];
  // }
  //
  // private _getEntities(itemArray, initialValues: SharingEntity) {
  //   return itemArray.reduce(
  //     (items: { [id: string]: any }, item: any) => {
  //       return {
  //         ...items,
  //         [item.id]: {
  //           id: item.id,
  //           name: item.displayName || item.name,
  //           type: item.type,
  //           access: item.access
  //         }
  //       };
  //     },
  //     {
  //       ...initialValues
  //     }
  //   );
  // }
  //
  // getUniqueId(): Observable<string> {
  //   return new Observable(observer => {
  //     this.httpClient.get('system/id.json?n=1').subscribe(
  //       response => {
  //         observer.next(response['codes'][0]);
  //         observer.complete();
  //       },
  //       error => observer.error(error)
  //     );
  //   });
  // }
}
