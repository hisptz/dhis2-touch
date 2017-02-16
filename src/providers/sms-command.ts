import { Injectable } from '@angular/core';
import {HttpClient} from "./http-client/http-client";
import {SqlLite} from "./sql-lite/sql-lite";

/*
  Generated class for the SmsCommand provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SmsCommand {

  constructor(public HttpClient : HttpClient,public SqlLite : SqlLite) { }

  getSmsCommandFromServer(user){
    let self = this;
    return new Promise(function(resolve, reject) {
      let smsCommandUrl = "/api/dataStore/sms/commands";
      self.HttpClient.get(smsCommandUrl,user).subscribe(response=>{
        response = response.json();
        resolve(response);
      },error=>{
        resolve([]);
      });
    });
  }


}
