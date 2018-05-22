import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { Store } from '@ngrx/store';
import * as visualizationObjectActions from '../actions/visualization-object.action';
import * as fromServices from '../../services';
import { tap } from 'rxjs/operators/tap';
import { map, switchMap, catchError, combineLatest } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

@Injectable()
export class GeofeatureEffects {
  constructor(private actions$: Actions, private geofeatureService: fromServices.GeoFeatureService) {}
}
