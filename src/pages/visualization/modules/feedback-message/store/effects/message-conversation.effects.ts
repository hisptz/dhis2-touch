import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromRoot from '../reducers';
import * as fromActions from '../actions';
import { MessageConversationService } from '../../services/message-conversation.service';
import { MessageConversation } from '../../models/message-conversation';
import { of } from 'rxjs/observable/of';

@Injectable()
export class MessageConversationEffects {
  constructor(private actions$: Actions, private store: Store<fromRoot.State>,
    private messageConversationService: MessageConversationService) {
  }

  @Effect({dispatch: false})
  initializeMessageConvsersation$ = this.actions$.ofType(
    fromActions.MessageConversationActionTypes.INITIALIZE_MESSAGE_CONVERSATION).withLatestFrom(this.store).
    pipe(tap(([action, state]: [fromActions.InitializeMessageConversationAction, fromRoot.State]) => {
      if (!state.messageConversation || !state.messageConversation.loading || !state.messageConversation.loaded) {
        this.store.dispatch(new fromActions.LoadMessageConversationAction());
      }
    }));

  @Effect()
  loadMessageConversations$ = this.actions$.ofType(
    fromActions.MessageConversationActionTypes.LOAD_MESSAGE_CONVERSATION).pipe(
    switchMap(() => this.messageConversationService.loadAll().pipe(
      map(
        (messageConversations: MessageConversation[]) => new fromActions.LoadMessageConversationSuccessAction(
          messageConversations)), catchError((error) => of(new fromActions.LoadMessageConversationFailAction(error)))))
  );
}
