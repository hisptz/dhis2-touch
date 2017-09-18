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
      console.log(parameter);
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
   * @param dataDimension
   * @param categoryOptionCombos
   * @returns {string}
   */
  getDataValuesSetAttributeOptionCombo(dataDimension, categoryOptionCombos) {
    let attributeOptionCombo = "";
    if (dataDimension && dataDimension.cp) {
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
