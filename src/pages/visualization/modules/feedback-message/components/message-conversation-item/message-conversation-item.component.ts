import { Component, Input, OnInit } from '@angular/core';
import { MessageConversation } from '../../models/message-conversation';

@Component({
  selector: 'app-message-conversation-item',
  templateUrl: './message-conversation-item.component.html'
})
export class MessageConversationItemComponent implements OnInit {
  @Input() messageConversation: MessageConversation;
  constructor() { }

  ngOnInit() {


  }


}
