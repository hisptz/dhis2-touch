import { Action } from '@ngrx/store';

export enum MessageConversationActionTypes {
  INITIALIZE_MESSAGE_CONVERSATION = '[MessageConversation] Initialize message conversation',
  LOAD_MESSAGE_CONVERSATION = '[MessageConversation] Load message conversation',
  LOAD_MESSAGE_CONVERSATION_SUCCESS = '[MessageConversation] Load message conversation success',
  LOAD_MESSAGE_CONVERSATION_FAIL = '[MessageConversation] Load message conversation fail',
}

export class InitializeMessageConversationAction implements Action {
  readonly type = MessageConversationActionTypes.INITIALIZE_MESSAGE_CONVERSATION;
}

export class LoadMessageConversationAction implements Action {
  readonly type = MessageConversationActionTypes.LOAD_MESSAGE_CONVERSATION;
}

export class LoadMessageConversationSuccessAction implements Action {
  readonly type = MessageConversationActionTypes.LOAD_MESSAGE_CONVERSATION_SUCCESS;

  constructor(public messageConversations: any[]) {
  }
}

export class LoadMessageConversationFailAction implements Action {
  readonly type = MessageConversationActionTypes.LOAD_MESSAGE_CONVERSATION_FAIL;

  constructor(public error: any) {
  }
}

export type MessageConversationAction =
  InitializeMessageConversationAction
  | LoadMessageConversationAction
  | LoadMessageConversationSuccessAction
  | LoadMessageConversationFailAction;
