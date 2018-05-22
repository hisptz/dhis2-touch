import { MessageConversation } from '../../models/message-conversation';
import { MessageConversationAction, MessageConversationActionTypes } from '../actions/message-conversation.action';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

export interface State extends EntityState<MessageConversation> {
  loaded: boolean;
  loading: boolean;
}

export const adapter: EntityAdapter<MessageConversation> = createEntityAdapter<MessageConversation>();

export const initialState: State = adapter.getInitialState({
  loaded: false,
  loading: false
});

export function reducer(state: State = initialState, action: MessageConversationAction): State {
  switch (action.type) {
    case MessageConversationActionTypes.LOAD_MESSAGE_CONVERSATION:
      return {...state, loading: true};
    case MessageConversationActionTypes.LOAD_MESSAGE_CONVERSATION_SUCCESS:
      return adapter.addAll(action.messageConversations, {...state, loading: false, loaded: true});
    case MessageConversationActionTypes.LOAD_MESSAGE_CONVERSATION_FAIL:
      return {...state, loading: false, loaded: true};
  }
  return state;
}

export const getMessageConversationLoadingState = (state: State) => state.loading;
export const getMessageConversationLoadedState = (state: State) => state.loaded;
