import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {HttpClientProvider} from "../http-client/http-client";

/*
  Generated class for the MessageServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class MessageServiceProvider {

  constructor(public http: HttpClientProvider) {}

  private messageUrl = '/api/25/messageConversations.json?fields=:all,id,followUp,lastUpdated,userFirstname,userSurname,read,name,subject,userMessages[followUp,read,user[id,displayName]],messageType,externalAccess,lastMessage,priority,status,access,user[id,displayName],messages[id,name,displayName,text,created,lastUpdated,sender[id,name,displayName],externalAccess],userMessages[*]&pageSize=50&page=1';

  getMessageConversations(currentUser){
    return Observable.create(observer => {
      this.http.get(this.messageUrl,currentUser).then((messageConversations : any)=>{
        messageConversations = JSON.parse(messageConversations.data);
        observer.next(messageConversations);
        observer.complete()
      }).catch(error=>{
        observer.error;
      });
    });
  }

}
