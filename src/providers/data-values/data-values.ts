import { Injectable } from '@angular/core';
import {HttpClientProvider} from "../http-client/http-client";
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {NetworkAvailabilityProvider} from "../network-availability/network-availability";

/*
  Generated class for the DataValuesProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DataValuesProvider {

  resourceName : string;

  constructor(private httpClient :HttpClientProvider,private sqlLite : SqlLiteProvider,private network : NetworkAvailabilityProvider) {
    this.resourceName = 'dataValues';
  }

  /**
   *
   * @param dataSetId
   * @param period
   * @param orgUnitId
   * @param attributeOptionCombo
   * @param currentUser
   * @returns {Promise<any>}
   */
  getDataValueSetFromServer(dataSetId, period, orgUnitId, attributeOptionCombo, currentUser) {
    let parameter = 'dataSet=' + dataSetId + '&period=' + period + '&orgUnit=' + orgUnitId;
    let networkStatus = this.network.getNetWorkStatus();
    return new Promise((resolve, reject)=> {
      if(networkStatus.isAvailable){
        this.httpClient.get('/api/25/dataValueSets.json?' + parameter, currentUser).then((response : any)=> {
          try{
            response = JSON.parse(response.data);
            resolve(this.getFilteredDataValuesByDataSetAttributeOptionCombo(response, attributeOptionCombo))
          }catch (error){
            reject(error);
          }
        }, error=> {
          reject(error.json());
        });
      }else{
        resolve([]);
      }
    });
  }

  /**
   *
   * @param status
   * @param currentUser
   * @returns {Promise<any>}
   */
  getDataValuesByStatus(status,currentUser){
    let attributeArray = [];
    attributeArray.push(status);
    return new Promise( (resolve, reject)=> {
      this.sqlLite.getDataFromTableByAttributes(this.resourceName, "syncStatus", attributeArray, currentUser.currentDatabase).then((dataValues:any)=> {
        resolve(dataValues);
      }, error=> {
        reject();
      });
    });
  }

  /**
   * convert data values to parameter for uploading
   * @param dataValues
   * @returns {Array}
   */
  getFormattedDataValueForUpload(dataValues) {
    let formattedDataValues = [];
    dataValues.forEach((dataValue:any)=> {
      let formParameter = "de=" + dataValue.de + "&pe=" + dataValue.pe + "&ou=";
      formParameter += dataValue.ou + "&co=" + dataValue.co + "&value=" + dataValue.value;
      if (dataValue.cp != "0" && dataValue.cp != "") {
        formParameter = formParameter + "&cc=" + dataValue.cc + "&cp=" + dataValue.cp;
      }
      formattedDataValues.push(formParameter);
    });
    return formattedDataValues;
  }

  uploadDataValues(formattedDataValues,dataValues,currentUser){
    let syncedDataValues = [];
    let importSummaries = {
      success : 0,fail : 0 ,errorMessage : []
    };
    return new Promise( (resolve, reject)=> {
      formattedDataValues.forEach((formattedDataValue:any, index:any)=> {
        this.httpClient.post('/api/25/dataValues?' + formattedDataValue, {}, currentUser).then(()=> {
          let syncedDataValue = dataValues[index];
          importSummaries.success ++;
          //syncedDataValue["syncStatus"] = "synced";
          syncedDataValues.push(syncedDataValue);
          if(formattedDataValues.length == (importSummaries.success + importSummaries.fail)){
            if(syncedDataValues.length > 0){
              this.sqlLite.insertBulkDataOnTable(this.resourceName,syncedDataValues,currentUser.currentDatabase).then(()=>{
                resolve(importSummaries);
              },error=>{
                console.log(JSON.stringify(error));
                reject(error);
              });
            }else{
              resolve(importSummaries);
            }
          }
        }, error=> {
          importSummaries.fail ++;
          if(importSummaries.errorMessage.indexOf(error)  == -1){
            importSummaries.errorMessage.push(error);
          }
          if(formattedDataValues.length == (importSummaries.success + importSummaries.fail)){
            if(syncedDataValues.length > 0){
              this.sqlLite.insertBulkDataOnTable(this.resourceName,syncedDataValues,currentUser.currentDatabase).then(()=>{
                resolve(importSummaries);
              },error=>{
                console.log(JSON.stringify(error));
                reject(error);
              });
            }else{
              resolve();
            }
          }
        });
      });
    });
  }



  /**
   *
   * @param dataSetId
   * @param period
   * @param orgUnitId
   * @param entryFormSections
   * @param dataDimension
   * @param currentUser
   * @returns {Promise<any>}
   */
  getAllEntryFormDataValuesFromStorage(dataSetId, period, orgUnitId, entryFormSections, dataDimension, currentUser) {
    let ids = [];
    let entryFormDataValuesFromStorage = [];
    entryFormSections.forEach((section:any)=> {
      section.dataElements.forEach((dataElement:any)=> {
        dataElement.categoryCombo.categoryOptionCombos.forEach((categoryOptionCombo:any)=> {
          ids.push(dataSetId + '-' + dataElement.id + '-' + categoryOptionCombo.id + '-' + period + '-' + orgUnitId);
        });
      });
    });
    return new Promise( (resolve, reject)=> {
      this.sqlLite.getDataFromTableByAttributes(this.resourceName, "id", ids, currentUser.currentDatabase).then((dataValues:any)=> {
        dataValues.forEach((dataValue:any)=> {
          if ((dataDimension.cp == dataValue.cp || dataValue.cp == "" || dataValue.cp == "0") && dataDimension.cc == dataValue.cc) {
            entryFormDataValuesFromStorage.push({
              id: dataValue.de + "-" + dataValue.co,
              value: dataValue.value,
              status: dataValue.syncStatus
            });
          }
        });
        resolve(entryFormDataValuesFromStorage)
      }, error=> {
        reject();
      });
    });
  }

  /**
   *
   * @param dataDimension
   * @param categoryOptionCombos
   * @returns {string}
   */
  getDataValuesSetAttributeOptionCombo(dataDimension, categoryOptionCombos) {
    let attributeOptionCombo = "";
    if (dataDimension && dataDimension.cp && dataDimension.cp!="") {
      let categoriesOptionsArray = dataDimension.cp.split(';');
      for (let i = 0; i < categoryOptionCombos.length; i++) {
        let hasAttributeOptionCombo = true;
        let categoryOptionCombo = categoryOptionCombos[i];
        categoryOptionCombo.categoryOptions.forEach((categoryOption:any)=> {
          if (categoriesOptionsArray.indexOf(categoryOption.id) == -1) {
            hasAttributeOptionCombo = false;
          }
        });
        if (hasAttributeOptionCombo) {
          attributeOptionCombo = categoryOptionCombo.id;
          break;
        }
      }
    } else {
      attributeOptionCombo = categoryOptionCombos[0].id;
    }
    return attributeOptionCombo;
  }


  /**
   * @param dataValuesResponse
   * @param attributeOptionCombo
   * @returns {Array}
   */
  getFilteredDataValuesByDataSetAttributeOptionCombo(dataValuesResponse, attributeOptionCombo) {
    let FilteredDataValues = [];
    if (dataValuesResponse.dataValues) {
      dataValuesResponse.dataValues.forEach((dataValue:any)=> {
        if (dataValue.attributeOptionCombo == attributeOptionCombo) {
          FilteredDataValues.push({
            categoryOptionCombo: dataValue.categoryOptionCombo,
            dataElement: dataValue.dataElement,
            value: dataValue.value
          });
        }
      });
    }
    return FilteredDataValues;
  }

  /**
   * saving data davlues
   * @param dataValues
   * @param dataSetId
   * @param period
   * @param orgUnitId
   * @param dataDimension
   * @param syncStatus
   * @param currentUser
   * @returns {Promise<T>}
   */
  saveDataValues(dataValues, dataSetId, period, orgUnitId, dataDimension, syncStatus, currentUser) {
    return new Promise( (resolve, reject)=> {
      if(dataValues.length > 0){
        let bulkData = [];
        for(let dataValue of dataValues){
          bulkData.push({
            id: dataSetId + '-' + dataValue.dataElement + '-' + dataValue.categoryOptionCombo + '-' + period + '-' + orgUnitId,
            de: dataValue.dataElement,
            co: dataValue.categoryOptionCombo,
            pe: period,
            ou: orgUnitId,
            cc: dataDimension.cc,
            cp: dataDimension.cp,
            value: dataValue.value,
            syncStatus: syncStatus,
            dataSetId: dataSetId,
            period: dataValue.period,
            orgUnit: dataValue.orgUnit
          });
        }
        this.sqlLite.insertBulkDataOnTable(this.resourceName,bulkData,currentUser.currentDatabase).then(()=>{
          resolve();
        },error=>{
          console.log(JSON.stringify(error));
          reject(error);
        });
      }else{
        resolve();
      }
    });
  }

}
