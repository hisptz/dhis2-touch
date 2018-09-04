import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { CurrentUserActionTypes, SetCurrentUser } from '../actions';
import { CurrentUser } from '../../models/currentUser';

@Injectable()
export class currentUserEffects {
  constructor(private actions$: Actions) {}

  @Effect()
  loadAllArticles$: Observable<Action> = this.actions$
    .ofType(CurrentUserActionTypes.AddCurrentUser)
    .map((actions: any) => {
      const currentUser: CurrentUser = actions.payload.currentUser;
      return new SetCurrentUser({ id: currentUser.id });
    });
}
