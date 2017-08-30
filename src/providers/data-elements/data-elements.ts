import { Injectable } from '@angular/core';
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {HttpClientProvider} from "../http-client/http-client";

/*
  Generated class for the DataElementsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DataElementsProvider {

  resource : string;

  constructor(private SqlLite : SqlLiteProvider,private HttpClient : HttpClientProvider) {
    this.resource = "dataElements";
  }

  /**
   *
   * @param currentUser
   * @returns {Promise<any>}
   */
  downloadDataElementsFromServer(currentUser){
    let fields= "id,name,formName,attributeValues[value,attribute[name]],categoryCombo[id,name,categoryOptionCombos[id,name]],displayName,description,valueType,optionSet[name,options[name,id,code]]";
    let url = "/api/25/"+this.resource+".json?paging=false&fields=" + fields;
    return new Promise((resolve, reject)=> {
      this.HttpClient.get(url,currentUser).then((response : any)=>{
        response = JSON.parse(response.data);
        resolve(response);
      },error=>{
        reject(error);
      });
    });
  }

  /**
   *
   * @param dataElements
   * @param currentUser
   * @returns {Promise<any>}
   */
  saveDataElementsFromServer(dataElements,currentUser){
    return new Promise((resolve, reject)=> {
      if(dataElements.length == 0){
        resolve();
      }else{
        this.SqlLite.insertBulkDataOnTable(this.resource,dataElements,currentUser.currentDatabase).then(()=>{
          resolve();
        },error=>{
          console.log(JSON.stringify(error));
          reject(error);
        });
      }
    });
  }

  /**
   *
   * @param dataElementIds
   * @param currentUser
   * @returns {Promise<any>}
   */
  getDataElementsByIds(dataElementIds,currentUser){
    let attributeKey = "id";
    return new Promise((resolve, reject)=> {
      this.SqlLite.getDataFromTableByAttributes(this.resource,attributeKey,dataElementIds,currentUser.currentDatabase).then(( dataElements: any)=>{
        resolve(dataElements);
      },error=>{reject(error)})
    });
  }

}
