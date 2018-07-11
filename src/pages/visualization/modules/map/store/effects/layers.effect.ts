import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as layersActions from '../actions/layers.action';
import * as fromServices from '../../services';

@Injectable()
export class LayersEffects {
  constructor(
    private actions$: Actions,
    private layerService: fromServices.LayerService
  ) {}

  @Effect()
  createLayers$ = this.actions$
    .ofType(layersActions.CREATE_LAYERS)
    .pipe(
      map(
        (action: layersActions.CreateLayers) =>
          new layersActions.LoadLayersSuccess(action.payload)
      ),
      catchError(error => of(new layersActions.LoadLayersFail(error)))
    );
}
