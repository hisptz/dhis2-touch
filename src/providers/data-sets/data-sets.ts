import { Injectable } from '@angular/core';
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {HttpClientProvider} from "../http-client/http-client";

/*
  Generated class for the DataSetsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DataSetsProvider {

  resource : string;
  lastSelectedDataSet : any;
  lastSelectedDataSetPeriod : any;

  constructor(private SqlLite : SqlLiteProvider,private HttpClient : HttpClientProvider) {
    this.resource = "dataSets";
  }

  resetDataSets(){
    this.lastSelectedDataSet = null;
    this.lastSelectedDataSetPeriod = null;
  }

  /**
   *
   * @param dataSet
   */
  setLastSelectedDataSet(dataSet){
    this.lastSelectedDataSet = dataSet;
  }

  /**
   *
   * @returns {any}
   */
  getLastSelectedDataSet(){
    return this.lastSelectedDataSet;
  }

  setLastSelectedDataSetPeriod(period){
    this.lastSelectedDataSetPeriod = period;
  }

  getLastSelectedDataSetPeriod(){
    return this.lastSelectedDataSetPeriod;
  }


  /**
   *
   * @param currentUser
   * @returns {Promise<T>}
   */
  downloadDataSetsFromServer(currentUser){
    let dataSets = [];
    let counts = 0;
    let userOrgUnitIds = currentUser.userOrgUnitIds;
    return new Promise((resolve, reject)=> {
      for(let userOrgUnitId of userOrgUnitIds){
        let fields="fields=id,name,timelyDays,formType,version,periodType,openFuturePeriods,expiryDays,dataSetElements[dataElement[id,name,displayName,description,formName,attributeValues[value,attribute[name]],valueType,optionSet[name,options[name,id,code]],categoryCombo[id,name,categoryOptionCombos[id,name]]]],dataElements[id,name,displayName,description,formName,attributeValues[value,attribute[name]],valueType,optionSet[name,options[name,id,code]],categoryCombo[id,name,categoryOptionCombos[id,name]]]organisationUnits[id,name],sections[id],indicators[id,name,indicatorType[factor],denominatorDescription,numeratorDescription,numerator,denominator],categoryCombo[id,name,categoryOptionCombos[id,name,categoryOptions[id]],categories[id,name,categoryOptions[id,name]]]";
        let filter="filter=organisationUnits.path:ilike:";
        let url = "/api/25/"+this.resource+".json?paging=false&";
        url += fields + "&" + filter + userOrgUnitId;
        this.HttpClient.get(url,currentUser).then((response : any)=>{
          response = JSON.parse(response.data);
          counts = counts + 1;
          dataSets = this.appendDataSetsFromServerToDataSetArray(dataSets,response);
          if(counts == userOrgUnitIds.length){
            resolve(dataSets);
          }
        },error=>{
          reject(error);
        })
      }
    });
  }

  /**
   * appendDataSetsFromServerToDataSetArray
   * @param dataSetArray
   * @param dataSetsResponse
   * @returns {any}
   */
  appendDataSetsFromServerToDataSetArray(dataSetArray,dataSetsResponse){
    if(dataSetsResponse[this.resource]){
      for(let dataSets of dataSetsResponse[this.resource]){
        dataSetArray.push(dataSets);
      }
    }
    return dataSetArray;
  }

  /**
   *
   * @param dataSets
   * @param currentUser
   * @returns {Promise<T>}
   */
  saveDataSetsFromServer(dataSets,currentUser){
    return new Promise((resolve, reject)=> {
      if(dataSets.length == 0){
        resolve();
      }else{
        this.SqlLite.insertBulkDataOnTable(this.resource,dataSets,currentUser.currentDatabase).then(()=>{
          resolve();
        },error=>{
          console.log(JSON.stringify(error));
          reject(error);
        });
      }
    });
  }

}
