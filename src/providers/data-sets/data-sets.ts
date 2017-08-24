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
        let fields="fields=id,name,timelyDays,formType,compulsoryDataElementOperands[name,dimensionItemType,dimensionItem],version,periodType,openFuturePeriods,expiryDays,dataSetElements[dataElement[id]],dataElements[id],organisationUnits[id],sections[id],indicators[id],categorycombo[id,name,categoryOptionCombos[id,name,categoryOptions[id]],categories[id,name,categoryOptions[id,name]]]";
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
          this.saveDataSetIndicators(dataSets,currentUser).then(()=>{
            resolve();
          },error=>{
            reject(error);
          });
        },error=>{
          console.log(JSON.stringify(error));
          reject(error);
        });
      }
    });
  }

  saveDataSetIndicators(dataSets,currentUser){
    let dataSetIndicators = [];
    console.log("dataSetIndicators");
    let resource = "dataSetIndicators";
    dataSets.forEach((dataSet : any)=>{
      if(dataSet.indicators && dataSet.indicators.length > 0){
        dataSet.indicators.forEach((indicator : any)=>{
          dataSetIndicators.push({
            id : dataSet.id + "-" + indicator.id,
            dataSetId : dataSet.id,
            indicatorId : indicator.id
          });
        });
      }
    });
    return new Promise((resolve, reject)=> {
      if(dataSetIndicators.length == 0){
        resolve();
      }else{
        this.SqlLite.insertBulkDataOnTable(resource,dataSetIndicators,currentUser.currentDatabase).then(()=>{
          this.saveDataSetSource(dataSets,currentUser).then(()=>{
            resolve();
          },error=>{
            reject(error);
          });
        },error=>{
          reject(error);
        });
      }
    });
  }

  saveDataSetSource(dataSets,currentUser){
    let dataSetSource = [];
    console.log("dataSetSource");
    let resource = "dataSetSource";
    dataSets.forEach((dataSet : any)=>{
      if(dataSet.organisationUnits && dataSet.organisationUnits.length > 0){
        dataSet.organisationUnits.forEach((organisationUnit : any)=>{
          dataSetSource.push({
            id : dataSet.id +"-"+organisationUnit.id,
            dataSetId : dataSet.id,
            organisationUnitId : organisationUnit.id
          });
        })
      }
    });
    return new Promise((resolve, reject)=> {
      if(dataSetSource.length == 0){
        resolve();
      }else{
        this.SqlLite.insertBulkDataOnTable(resource,dataSetSource,currentUser.currentDatabase).then(()=>{
          this.saveDataSetSections(dataSets,currentUser).then(()=>{
            resolve();
          },error=>{
            reject(error);
          });
        },error=>{
          reject(error);
        });
      }
    });
  }

  saveDataSetSections(dataSets,currentUser){
    let dataSetSections = [];
    console.log("dataSetSections");
    let resource = "dataSetSections";
    dataSets.forEach((dataSet : any)=>{
      if(dataSet.sections && dataSet.sections.length > 0){
        dataSet.sections.forEach((section : any)=>{
          dataSetSections.push({
            id : dataSet.id +"-"+section.id,
            dataSetId : dataSet.id,
            sectionId : section.id
          });
        })
      }
    });
    return new Promise((resolve, reject)=> {
      if(dataSetSections.length == 0){
        resolve();
      }else{
        this.SqlLite.insertBulkDataOnTable(resource,dataSetSections,currentUser.currentDatabase).then(()=>{
          this.saveDataSetOperands(dataSets,currentUser).then(()=>{
            resolve();
          },error=>{
            reject(error);
          });
        },error=>{
          console.log(JSON.stringify(error));
          reject(error);
        });
      }
    });
  }

  saveDataSetOperands(dataSets,currentUser){
    let dataSetOperands = [];
    console.log("dataSetOperands");
    let resource = "dataSetOperands";
    dataSets.forEach((dataSet : any)=>{
      if(dataSet.compulsoryDataElementOperands && dataSet.compulsoryDataElementOperands.length > 0){
        dataSet.compulsoryDataElementOperands.forEach((compulsoryDataElementOperand : any)=>{
          dataSetOperands.push({
            id : dataSet.id +"-"+compulsoryDataElementOperand.dimensionItem,
            dataSetId : dataSet.id,
            name : compulsoryDataElementOperand.name,
            dimensionItemType : compulsoryDataElementOperand.dimensionItemType,
            dimensionItem : compulsoryDataElementOperand.dimensionItem
          });
        });
      }
    });
    return new Promise((resolve, reject)=> {
      if(dataSetOperands.length == 0){
        resolve();
      }else{
        this.SqlLite.insertBulkDataOnTable(resource,dataSetOperands,currentUser.currentDatabase).then(()=>{
          this.saveDataSetElements(dataSets,currentUser).then(()=>{
            resolve();
          },error=>{
            reject(error);
          });
        },error=>{
          reject(error);
        });
      }
    });
  }

  saveDataSetElements(dataSets,currentUser){
    let dataSetElements = [];
    console.log("dataSetElements");
    let resource = "dataSetElements";
    dataSets.forEach((dataSet : any)=>{
      if(dataSet.dataSetElements && dataSet.dataSetElements.length > 0){
        dataSet.dataSetElements.forEach((dataSetElement : any)=>{
          if(dataSetElement.dataElement.id && dataSetElement.dataElement.id)
          dataSetElements.push({
            id : dataSet.id +"-"+dataSetElement.dataElement.id,
            dataSetId : dataSet.id,
            dataElementId : dataSetElement.dataElement.id
          });
        })
      }
      if(dataSet.dataElements && dataSet.dataElements.length > 0){
        dataSet.dataElements.forEach((dataElement : any)=>{
          dataSetElements.push({
            id : dataSet.id +"-"+dataElement.id,
            dataSetId : dataSet.id,
            dataElementId : dataElement.id
          });
        })
      }
    });
    return new Promise((resolve, reject)=> {
      if(dataSetElements.length == 0){
        resolve();
      }else{
        this.SqlLite.insertBulkDataOnTable(resource,dataSetElements,currentUser.currentDatabase).then(()=>{
          resolve();
        },error=>{
          console.log(JSON.stringify(error));
          reject(error);
        });
      }
    });


  }


}
