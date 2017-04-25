import { Injectable } from '@angular/core';
import {SqlLite} from "./sql-lite";
import {HttpClient} from "./http-client";

/*
  Generated class for the DataSets provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DataSets {

  public resource : string;
  public lastSelectedDataSet : any;
  public lastSelectedDataSetPeriod : any;

  constructor(private sqlLite : SqlLite,public HttpClient : HttpClient) {
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
    let self = this;
    let counts = 0;
    let userOrgUnitIds = currentUser.userOrgUnitIds;
    return new Promise(function(resolve, reject) {
      for(let userOrgUnitId of userOrgUnitIds){
        let fields="fields=id,name,timelyDays,formType,version,periodType,openFuturePeriods,expiryDays,dataSetElements[dataElement[id,name,displayName,description,formName,attributeValues[value,attribute[name]],valueType,optionSet[name,options[name,id,code]],categoryCombo[id,name,categoryOptionCombos[id,name]]]],dataElements[id,name,displayName,description,formName,attributeValues[value,attribute[name]],valueType,optionSet[name,options[name,id,code]],categoryCombo[id,name,categoryOptionCombos[id,name]]]organisationUnits[id,name],sections[id],indicators[id,name,indicatorType[factor],denominatorDescription,numeratorDescription,numerator,denominator],categoryCombo[id,name,categoryOptionCombos[id,name,categoryOptions[id]],categories[id,name,categoryOptions[id,name]]]";
        let filter="filter=organisationUnits.path:ilike:";
        let url = "/api/25/"+self.resource+".json?paging=false&";
        url += fields + "&" + filter + userOrgUnitId;
        console.log("url : " + url);
        self.HttpClient.get(url,currentUser).subscribe(response=>{
          response = response.json();
          counts = counts + 1;
          dataSets = self.appendDataSetsFromServerToDataSetArray(dataSets,response);
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
    let self = this;
    return new Promise(function(resolve, reject) {
      let counts = 0;
      for(let dataSet of dataSets){
        self.sqlLite.insertDataOnTable(self.resource,dataSet,currentUser.currentDatabase).then(()=>{
          counts = counts + 1;
          if(counts == dataSets.length){
            resolve();
          }
        },error => {
          console.log(JSON.stringify(error));
          reject(error);
        });
      }
    });
  }




  /**
   * getDataSetsByIds
   * @param dataSetsIds
   * @param currentUser
   * @returns {Promise<T>}
     */
  getDataSetsByIds(dataSetsIds,currentUser){
    let attribute = 'id';
    let dataSetsResponse = [];
    let self = this;
    return new Promise(function(resolve, reject) {
      self.sqlLite.getDataFromTableByAttributes(self.resource,attribute,dataSetsIds,currentUser.currentDatabase).then((dataSets : any)=>{
        self.sortDataSetList(dataSets);
        dataSets.forEach((dataSet : any)=>{
          dataSetsResponse.push({
            id: dataSet.id,
            name: dataSet.name,
            dataElements : dataSet.dataElements,
            dataSetElements : dataSet.dataSetElements
          });
        });
        resolve(dataSetsResponse);
      },error=>{
        reject(error);
      })
    });
  }

  /**
   * getAssignedDataSetsByOrgUnit
   * @param selectedOrgUnit
   * @param dataSetIdsByUserRoles
   * @param currentUser
   * @returns {Promise<T>}
     */
  getAssignedDataSetsByOrgUnit(selectedOrgUnit,dataSetIdsByUserRoles,currentUser){
    let attribute = 'id';
    let attributeValue =[];
    let assignedDataSetsByOrgUnit = [];
    let self = this;
    return new Promise(function(resolve, reject) {
      selectedOrgUnit.dataSets.forEach((dataSet:any)=>{
        if(dataSetIdsByUserRoles.indexOf(dataSet.id) != -1){
          attributeValue.push(dataSet.id);
        }
      });
      self.sqlLite.getDataFromTableByAttributes(self.resource,attribute,attributeValue,currentUser.currentDatabase).then((dataSets : any)=>{
        self.sortDataSetList(dataSets);
        dataSets.forEach((dataSet : any)=>{
          assignedDataSetsByOrgUnit.push({
            id: dataSet.id,
            name: dataSet.name,
            openFuturePeriods: dataSet.openFuturePeriods,
            periodType : dataSet.periodType,
            categoryCombo : dataSet.categoryCombo,
            dataElements : dataSet.dataElements,
            dataSetElements : dataSet.dataSetElements
          });
        });
        resolve(assignedDataSetsByOrgUnit);
      },error=>{
        reject(error);
      })
    });
  }

  /**
   * sortDataSetList
   * @param dataSetList
   * @returns {any}
     */
  sortDataSetList(dataSetList){
    dataSetList.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
    return dataSetList;
  }

  /**
   *
   * @param dataSetId
   * @param currentUser
   * @returns {Promise<T>}
     */
  getDataSetById(dataSetId,currentUser){
    let attribute = "id";
    let attributeValue = [];
    attributeValue.push(dataSetId);
    let self = this;
    return new Promise(function(resolve, reject) {
      self.sqlLite.getDataFromTableByAttributes(self.resource,attribute,attributeValue,currentUser.currentDatabase).then((dataSets : any)=>{
        if(dataSets.length > 0){
          resolve(dataSets[0]);
        }else{
          reject(" dataSet with id "+dataSetId+" has nit being found");
        }
      },error=>{
        reject(error);
      });
    });
  }

}
