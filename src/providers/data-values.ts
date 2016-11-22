import { Injectable } from '@angular/core';
import {HttpClient} from "./http-client/http-client";
import {SqlLite} from "./sql-lite/sql-lite";
import {Observable} from 'rxjs/Rx';

/*
  Generated class for the DataValues provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DataValues {

  public resourceName :string;
  //status :: synced , not synced

  constructor(private httpClient : HttpClient,private sqlLite : SqlLite) {
    this.resourceName = "dataValues";
  }

  /**
   * get data values by status
   * @param currentUser
   * @param status
   * @returns {Promise<T>}
     */
  getDataValuesByStatus(currentUser,status){
    let self = this;
    let attribute = "syncStatus";
    let attributeArray = [];
    attributeArray.push(status);
    return new Promise(function(resolve, reject) {
      self.sqlLite.getDataFromTableByAttributes(self.resourceName,attribute,attributeArray,currentUser.currentDatabase).then((dataValues : any)=>{
        resolve(dataValues);
      },error=>{
        reject(error);
      })
    });
  }

  uploadDataValues(dataValues,currentUser){
    let self = this;
    let formattedDataValues = self.getFormattedDataValueForUpload(dataValues);
    formattedDataValues.forEach((formattedDataValue : any,index : any)=>{
      this.httpClient.post('/api/dataValues?'+formattedDataValue,{},currentUser).subscribe(()=>{
        let syncedDataValues = dataValues[index];
        syncedDataValues["syncStatus"] = "synced";
        self.sqlLite.insertDataOnTable(self.resourceName,syncedDataValues,currentUser.currentDatabase).then(response=>{
        },error=>{});
      },error=>{});
    });
  }

  /**
   * convert data values to parameter for uploading
   * @param dataValues
   * @returns {Array}
     */
  getFormattedDataValueForUpload(dataValues){
    var formattedDataValues = [];
    dataValues.forEach((dataValue : any)=>{
      let formParameter = "de="+dataValue.de+"&pe="+dataValue.pe+"&ou=";
      formParameter += dataValue.ou+"&co="+dataValue.co+"&value="+dataValue.value;
      if(dataValue.cp != "0"){
        formParameter = formParameter +"&cc="+dataValue.cc+"&cp="+dataValue.cp;
      }
      formattedDataValues.push(formParameter);
    });
    return formattedDataValues;
  }


  /**
   * get parameter for dataSet completeness for a given form
   * @param dataSetId
   * @param period
   * @param orgUnitId
   * @param dataDimension
   * @returns {string}
     */
  getDataSetCompletenessParameter(dataSetId,period,orgUnitId,dataDimension){
    let parameter = "ds="+dataSetId+"&pe="+period+"&ou="+orgUnitId;
    if(dataDimension.cp !=""){
      parameter += "&cc="+dataDimension.cc+"&cp="+dataDimension.cp;
    }
    return parameter;
  }

  //@todo rechecking on dataSet completeness
  completeOnDataSetRegistrations(dataSetId,period,orgUnitId,dataDimension,currentUser){
    let self = this;
    let parameter = self.getDataSetCompletenessParameter(dataSetId,period,orgUnitId,dataDimension);
    let data :any = {};
    return new Promise(function(resolve, reject) {
      self.httpClient.post('/api/completeDataSetRegistrations?'+parameter,{},currentUser).subscribe(response=>{
        resolve(response.json());
      },error=>{
        reject(error);
      });
    });
  }

  /**
   * delete data set completeness information
   * @param dataSetId
   * @param period
   * @param orgUnitId
   * @param dataDimension
   * @param currentUser
     * @returns {Promise<T>}
     */
  unDoCompleteOnDataSetRegistrations(dataSetId,period,orgUnitId,dataDimension,currentUser){
    let self = this;
    let parameter = self.getDataSetCompletenessParameter(dataSetId,period,orgUnitId,dataDimension);
    return new Promise(function(resolve, reject) {
      self.httpClient.delete('/api/completeDataSetRegistrations?'+parameter,currentUser).subscribe(response=>{
        resolve();
      },error=>{
        reject(error);
      });
    });
  }

  /**
   * get data set completeness information
   * @param dataSetId
   * @param period
   * @param orgUnitId
   * @param dataDimension
   * @param currentUser
     * @returns {Promise<T>}
     */
  getDataSetCompletenessInfo(dataSetId,period,orgUnitId,dataDimension,currentUser){
    let  self = this;
    let parameter = "dataSetId="+dataSetId+"&periodId="+period+"&organisationUnitId="+orgUnitId;
    if(dataDimension.cp !=""){
      parameter += "&cc="+dataDimension.cc+"&cp="+dataDimension.cp;
    }
    return new Promise(function(resolve, reject) {
      self.httpClient.get('/dhis-web-dataentry/getDataValues.action?'+parameter,currentUser).subscribe(response=>{
        resolve(response.json());
      },error=>{
        reject();
      });
    });

  }


  /**
   * get dataValues form server based on selected parameter
   * @param dataSet
   * @param period
   * @param orgUnit
   * @param attributeOptionCombo
   * @param currentUser
     * @returns {Promise<T>}
     */
  getDataValueSetFromServer(dataSet,period,orgUnit,attributeOptionCombo,currentUser){
    let parameter = 'dataSet='+dataSet+'&period='+period+'&orgUnit='+orgUnit;
    let self = this;
    return new Promise(function(resolve, reject) {
      self.httpClient.get('/api/dataValueSets.json?'+parameter,currentUser).subscribe(response=>{
        resolve(self.getFilteredDataValuesByDataSetAttributeOptionCombo(response.json(),attributeOptionCombo))
      },error=>{
        reject(error.json());
      });
    });
  }


  /**
   * get dataset attribute option combo based on data entry form selection
   * @param dataValuesResponse
   * @param attributeOptionCombo
   * @returns {Array}
     */
  getFilteredDataValuesByDataSetAttributeOptionCombo(dataValuesResponse,attributeOptionCombo){
    let FilteredDataValues = [];
    if(dataValuesResponse.dataValues){
      dataValuesResponse.dataValues.forEach((dataValue : any)=>{
        if(dataValue.attributeOptionCombo == attributeOptionCombo){
          FilteredDataValues.push({
            categoryOptionCombo : dataValue.categoryOptionCombo,
            dataElement : dataValue.dataElement,
            value : dataValue.value
          });
        }
      });
    }
    return FilteredDataValues;
  }


  /**
   * function to get correctly attribute option combo for downloading data values
   * @param dataDimension
   * @param categoryOptionCombos
   * @returns {string}
     */
  getDataValuesSetAttributeOptionCombo(dataDimension,categoryOptionCombos){
    let attributeOptionCombo = "";
    if(dataDimension.cp !=""){
      let categoriesOptionsArray = dataDimension.cp.split(';');
      for(let i = 0; i < categoryOptionCombos.length; i ++){
        let  hasAttributeOptionCombo = true;
        let categoryOptionCombo = categoryOptionCombos[i];
        categoryOptionCombo.categoryOptions.forEach((categoryOption : any)=>{
          if(categoriesOptionsArray.indexOf(categoryOption.id) == -1){
            hasAttributeOptionCombo = false;
          }
        });
        if(hasAttributeOptionCombo){
          attributeOptionCombo = categoryOptionCombo.id;
          break;
        }
      }
    }else{
      attributeOptionCombo = categoryOptionCombos[0].id;
    }
    return attributeOptionCombo;
  }


  /**
   * get all data values fro local storage
   * @param dataSetId
   * @param period
   * @param orgUnitId
   * @param entryFormSections
   * @param currentUser
     * @returns {Promise<T>}
     */
  getAllEntryFormDataValuesFromStorage(dataSetId,period,orgUnitId,entryFormSections,currentUser){
    let ids = [];
    let self = this;
    let entryFormDataValuesFromStorage =[];
    entryFormSections.forEach((section : any)=>{
      section.dataElements.forEach((dataElement : any)=>{
        dataElement.categoryCombo.categoryOptionCombos.forEach((categoryOptionCombo : any)=>{
          ids.push(dataSetId + '-' + dataElement.id + '-' + categoryOptionCombo.id + '-' + period + '-' + orgUnitId);
        });
      });
    });
    return new Promise(function(resolve, reject) {
      self.sqlLite.getDataFromTableByAttributes(self.resourceName,"id",ids,currentUser.currentDatabase).then((dataValues : any)=>{
        dataValues.forEach((dataValue : any)=>{
          entryFormDataValuesFromStorage.push({
            id :dataValue.de + "-" +dataValue.co,
            value : dataValue.value,
            status : dataValue.syncStatus
          });
        });
        resolve(entryFormDataValuesFromStorage)
      },error=>{
        reject();
      });
    });
  }


  /**
   * furntion to get dataValue by id
   * @param id
   * @param currentUser
   * @returns {Promise<T>}
     */
  getDataValuesById(id,currentUser){
    let self = this;
    let ids = [];
    ids.push(id);
    return new Promise(function(resolve, reject) {
      self.sqlLite.getDataFromTableByAttributes(self.resourceName,"id",ids,currentUser.currentDatabase).then((dataValues : any)=>{
        resolve(dataValues)
      },error=>{
        reject();
      });
    });
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
  saveDataValues(dataValues,dataSetId,period,orgUnitId,dataDimension,syncStatus,currentUser){
    let self = this;
    return new Promise(function(resolve, reject) {
      let promises = [];
      dataValues.forEach((dataValue : any)=>{
        let data = {
          id: dataSetId + '-' + dataValue.dataElement + '-' + dataValue.categoryOptionCombo + '-' + period + '-' + orgUnitId,
          de: dataValue.dataElement,
          co: dataValue.categoryOptionCombo,
          pe: period,
          ou: orgUnitId,
          cc: dataDimension.cc,
          cp: dataDimension.cp,
          value: dataValue.value,
          syncStatus: syncStatus,
          dataSetId: dataSetId
        };
        promises.push(
          self.sqlLite.insertDataOnTable(self.resourceName,data,currentUser.currentDatabase).then(response=>{
          },error=>{
          })
        );

      });
      Observable.forkJoin(promises).subscribe(() => {
          resolve();
        },(error) => {
          reject();
        })
    });
  }


}
