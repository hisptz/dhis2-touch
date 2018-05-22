import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { Store } from '@ngrx/store';
import * as baseLayerAction from '../actions/base-layer.action';
import * as fromServices from '../../services';
import { tap } from 'rxjs/operators/tap';
import { map, switchMap, catchError, combineLatest } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

@Injectable()
export class BaseLayerEffects {
  constructor(private actions$: Actions) {}

  @Effect()
  addBaseLayer$ = this.actions$
    .ofType(baseLayerAction.ADD_BASELAYER)
    .pipe(
      map(
        (action: baseLayerAction.AddBaseLayer) =>
          new baseLayerAction.AddBaseLayerSuccess(action.payload)
      ),
      catchError(error => of(new baseLayerAction.AddBaseLayerFail(error)))
    );

  @Effect()
  updateBaseLayer$ = this.actions$
    .ofType(baseLayerAction.UPDATE_BASELAYER)
    .pipe(
      map(
        (action: baseLayerAction.UpdateBaseLayer) =>
          new baseLayerAction.UpdateBaseLayerSuccess(action.payload)
      ),
      catchError(error => of(new baseLayerAction.UpdateBaseLayerFail(error)))
    );
}
