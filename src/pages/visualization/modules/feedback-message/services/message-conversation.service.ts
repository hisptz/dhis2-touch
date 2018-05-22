import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MessageConversation } from '../models/message-conversation';
import { map } from 'rxjs/operators';
import { HttpClientProvider } from '../../../../../providers/http-client/http-client';

@Injectable()
export class MessageConversationService {
  constructor(private httpClient: HttpClientProvider) {
  }

  loadAll(): Observable<MessageConversation[]> {
    return this.httpClient.get(
      '/api/messageConversations.json?fields=id,name,displayName,href,read,created,lastUpdated,followUp,subject,messageType,' +
      'lastMessage,priority,status,lastSender[id,name],user[id,name],messages[id,created,lastUpdated,name,displayName,text,' +
      'sender[id,name]]&paging=false', true).pipe(map((res: any) => res.messageConversations));
  }
}
