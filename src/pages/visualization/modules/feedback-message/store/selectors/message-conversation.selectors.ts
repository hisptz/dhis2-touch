import * as fromRoot from '../reducers';
import * as fromMassageConvsersation from '../reducers/message-conversation.reducer';
import * as _ from 'lodash';
import { createSelector } from '@ngrx/store';
import { MessageConversation } from '../../models/message-conversation';
import * as fromHelpers from '../../helpers';

export const getMessageConversations = readStatus => createSelector(fromRoot.getAllMessageConversationsState,
  (messageConversationsResponse: MessageConversation[]) => {
    const messageConversations = _.map(messageConversationsResponse, messageConversation => {
      const sortedMessages = _.reverse(_.sortBy(messageConversation.messages, 'lastUpdated'));
      return {
        ...messageConversation,
        conversationNames: fromHelpers.mapNameToCommaSeparated(_.uniq(_.filter(
          _.map(_.some(sortedMessages, message => message.sender) ? sortedMessages : [{sender: messageConversation.user}],
            message => message.sender ? message.sender.name : undefined),
          senderName => senderName)), 3),
        body: sortedMessages[0] ? sortedMessages[0].text : undefined,
        messages: [...sortedMessages]
      };
    });
    if (!readStatus) {
      return _.sortBy(messageConversations, 'read');
    }
    const readStatusDictionary = {
      read: true,
      unread: false
    };
    const readStatusResult = readStatusDictionary[readStatus];

    return _.sortBy(_.isBoolean(readStatusResult) ?
                    _.filter(messageConversations,
                      (messageConversation: MessageConversation) => messageConversation.read === readStatusResult) :
                    messageConversations, 'read');
  });
