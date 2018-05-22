import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromMessageConversation from './message-conversation.reducer';

export interface State {
  messageConversation: fromMessageConversation.State;
}

export const reducers: ActionReducerMap<State> = {
  messageConversation: fromMessageConversation.reducer
};

export const getFeedbackMessageState = createFeatureSelector<State>('feedbackMessage');

// General selector for message conversation
export const getMessageConversationState = createSelector(getFeedbackMessageState,
  (state: State) => state.messageConversation);

export const {
  selectAll: getAllMessageConversationsState,
  selectEntities: getMessageCpnversationEntities
} = fromMessageConversation.adapter.getSelectors(getMessageConversationState);
