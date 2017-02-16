import { Injectable } from '@angular/core';
import {HttpClient} from "./http-client/http-client";
import {SqlLite} from "./sql-lite/sql-lite";
import {Observable} from 'rxjs/Rx';

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

  savingSmsCommand(smsCommands,databaseName){
    let promises = [];
    let self = this;
    let resource = "smsCommand";

    return new Promise(function(resolve, reject) {
      if(smsCommands.length == 0){
        resolve();
      }
      smsCommands.forEach((smsCommand:any)=>{
        smsCommand["id"] = smsCommand.commandName;
        promises.push(
          self.SqlLite.insertDataOnTable(resource,smsCommand,databaseName).then(()=>{
            //saving success
            console.log("smsCommand " + smsCommand["id"]);
          },(error) => {
          })
        );
      });

      Observable.forkJoin(promises).subscribe(() => {
          resolve();
        },
        (error) => {
          reject(error);
        })
    });
  }


}
