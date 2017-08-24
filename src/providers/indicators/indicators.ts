import { Injectable } from '@angular/core';
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {HttpClientProvider} from "../http-client/http-client";

/*
  Generated class for the IndicatorsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

export interface IndicatorModel {

}



@Injectable()
export class IndicatorsProvider {

  //id,name,denominatorDescription,numeratorDescription,numerator,denominator,indicatorType[:all]

  indicators : IndicatorModel[];
  lastSelectedIndicator : IndicatorModel;
  resource : string;

  constructor(private sqlLite : SqlLiteProvider,private HttpClient : HttpClientProvider) {
    this.resource = "indicators";
  }

  /**
   * downloadingIndicatorsFromServer
   * @param indicatorsIds
   * @param currentUser
   * @returns {Promise<T>}
   */
  downloadingIndicatorsFromServer(currentUser){

    return new Promise((resolve, reject)=> {
      let counts = 0;

        let fields ="id,name,demo,denominatorDescription,numeratorDescription,numerator,denominator,indicatorType";

        let url = "/api/25/"+this.resource+".json?paging=false&";
        url += fields;
        this.HttpClient.get(url,currentUser).then((response:any)=>{
          response = JSON.parse(response.data);
          counts = counts + 1;

          resolve(response);

        },error=>{
          reject(error);
        })

    });
  }




  /**
   * savingOrganisationUnitsFromServer
   * @param orgUnits
   * @param currentUser
   * @returns {Promise<T>}
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
