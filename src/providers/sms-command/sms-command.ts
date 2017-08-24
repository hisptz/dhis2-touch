import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {HttpClientProvider} from "../http-client/http-client";

/*
  Generated class for the SmsCommandProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SmsCommandProvider {

  resourceName : string;

  constructor(private SqlLite : SqlLiteProvider,private HttpClient : HttpClientProvider) {
    this.resourceName = "smsCommand";
  }

  /**
   * getting sms commands from login instance
   * @param user
   * @returns {Promise<T>}
   */
  getSmsCommandFromServer(user){
    return new Promise((resolve, reject)=> {
      let smsCommandUrl = "/api/25/dataStore/sms/commands";
      this.HttpClient.get(smsCommandUrl,user).then((response : any)=>{
        response = JSON.parse(response.data);
        resolve(response);
      },error=>{
        resolve([]);
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
    return new Promise((resolve, reject)=> {
      if(smsCommands.length == 0){
        resolve();
      }else{
        smsCommands.forEach((smsCommand:any)=>{
          smsCommand["id"] = smsCommand.dataSetId;
        });
        this.SqlLite.insertBulkDataOnTable(this.resourceName,smsCommands,databaseName).then(()=>{
          resolve();
        },error=>{
          console.log(JSON.stringify(error));
          reject(error);
        });
      }
    });
  }

}
