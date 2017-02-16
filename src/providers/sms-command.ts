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

  public resourceName :string;

  constructor(public HttpClient : HttpClient,public SqlLite : SqlLite) {
    this.resourceName = "smsCommand";
  }

  /**
   * getting sms commands from login instance
   * @param user
   * @returns {Promise<T>}
     */
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

  getSmsCommandForDataSet(dataSetId,currentUser){
    let self = this;
    let ids = [];
    ids.push(dataSetId);
    return new Promise(function(resolve, reject) {
      self.SqlLite.getDataFromTableByAttributes(self.resourceName,"id",ids,currentUser.currentDatabase).then((smsCommands : any)=>{
        if(smsCommands.length > 0){
          resolve(smsCommands[0]);
        }else{
          reject();
        }
      },error=>{
        reject();
      });
    });
  }

  /**
   * saving sms commands
   * @param smsCommands
   * @param databaseName
   * @returns {Promise<T>}
     */
  savingSmsCommand(smsCommands,databaseName){
    let promises = [];
    let self = this;
    return new Promise(function(resolve, reject) {
      if(smsCommands.length == 0){
        resolve();
      }
      smsCommands.forEach((smsCommand:any)=>{
        smsCommand["id"] = smsCommand.commandName;
        promises.push(
          self.SqlLite.insertDataOnTable(self.resourceName,smsCommand,databaseName).then(()=>{
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
