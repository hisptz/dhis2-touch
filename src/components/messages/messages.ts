import { Component,Input,OnInit } from '@angular/core';
import {MessageServiceProvider} from "../../providers/message-service/message-service";

/**
 * Generated class for the MessagesComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'messages',
  templateUrl: 'messages.html'
})
export class MessagesComponent implements OnInit{

  @Input() currentUser;
  messageConversations:any[] = [];
  isLoading : boolean;
  hasError : boolean;
  isMessageContentOpen : any;


  constructor(private messageService : MessageServiceProvider) {}

  ngOnInit(){
    if(this.currentUser){
      this.isMessageContentOpen = {};
      this.getAllMessages(this.currentUser);
    }
  }

  toggleMessageConversationContents(messageConversation){
    if(this.isMessageContentOpen[messageConversation.id]){
      this.isMessageContentOpen[messageConversation.id] = false;
    }else{
      this.isMessageContentOpen[messageConversation.id] = true;
    }
  }

  getAllMessages(currentUser) {
    this.hasError = false;
    this.isLoading = true;
    this.messageService.getMessageConversations(currentUser).subscribe(response => {
      this.isLoading = false;
      this.messageConversations = response.messageConversations
    },error => {
      console.log(JSON.stringify(error));
      this.isLoading = false;
      this.hasError = true;
    });
  }
}
