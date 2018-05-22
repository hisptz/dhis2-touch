import { Component, Input, OnInit } from '@angular/core';
import * as fromStore from '../../store';
import { Store } from '@ngrx/store';
import { MessageConversation } from '../../models/message-conversation';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-message-conversation-list',
  templateUrl: './message-conversation-list.component.html'
})
export class MessageConversationListComponent implements OnInit {

  @Input() readStatus: string;
  @Input() height: string;
  messageConversations$: Observable<MessageConversation[]>;
  constructor(private store: Store<fromStore.State>) {
    store.dispatch(new fromStore.InitializeMessageConversationAction());
  }

  ngOnInit() {
    this.messageConversations$ = this.store.select(fromStore.getMessageConversations(this.readStatus));
  }

}
