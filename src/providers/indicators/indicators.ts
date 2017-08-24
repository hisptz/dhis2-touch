import { Injectable } from '@angular/core';
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {HttpClientProvider} from "../http-client/http-client";

/*
  Generated class for the IndicatorsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

@Injectable()
export class IndicatorsProvider {

  resource : string;

  constructor(private sqlLite : SqlLiteProvider,private HttpClient : HttpClientProvider) {
    this.resource = "indicators";
  }

  /**
   *
   * @param currentUser
   * @returns {Promise<any>}
   */
  downloadingIndicatorsFromServer(currentUser){
    return new Promise((resolve, reject)=> {
      let fields ="id,name,denominatorDescription,numeratorDescription,numerator,denominator,indicatorType[:all]";
        let url = "/api/25/"+this.resource+".json?paging=false&";
        url += fields;
        this.HttpClient.get(url,currentUser).then((response:any)=>{
          response = JSON.parse(response.data);
          resolve(response);
        },error=>{
          reject(error);
        });
    });
  }

  /**
   *
   * @param indicators
   * @param currentUser
   * @returns {Promise<any>}
   */
  savingIndicatorsFromServer(indicators,currentUser){
    return new Promise((resolve, reject)=> {
      this.sqlLite.insertBulkDataOnTable(this.resource,indicators,currentUser.currentDatabase).then(()=>{
        resolve();
      },error=>{
        console.log(JSON.stringify(error));
        reject(error);
      });
    });
  }

}
