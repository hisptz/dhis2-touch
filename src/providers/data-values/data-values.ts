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

  constructor(private httpClient :HttpClientProvider,private sqlLite : SqlLiteProvider,private network : NetworkAvailabilityProvider) {
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
  getDataValueSetFromServer(dataSet, period, orgUnit, attributeOptionCombo, currentUser) {
    let parameter = 'dataSet=' + dataSet + '&period=' + period + '&orgUnit=' + orgUnit;
    let networkStatus = this.network.getNetWorkStatus();
    return new Promise((resolve, reject)=> {
      if(networkStatus.isAvailable){
        this.httpClient.get('/api/25/dataValueSets.json?' + parameter, currentUser).then((response : any)=> {
          response = JSON.stringify(response.data);
          resolve(this.getFilteredDataValuesByDataSetAttributeOptionCombo(response, attributeOptionCombo))
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
      alert(JSON.stringify(dataDimension));
      let categoriesOptionsArray = dataDimension.cp.split(';');
      // for (let i = 0; i < categoryOptionCombos.length; i++) {
      //   let hasAttributeOptionCombo = true;
      //   let categoryOptionCombo = categoryOptionCombos[i];
      //   categoryOptionCombo.categoryOptions.forEach((categoryOption:any)=> {
      //     if (categoriesOptionsArray.indexOf(categoryOption.id) == -1) {
      //       hasAttributeOptionCombo = false;
      //     }
      //   });
      //   if (hasAttributeOptionCombo) {
      //     attributeOptionCombo = categoryOptionCombo.id;
      //     break;
      //   }
      // }
    } else {
      //attributeOptionCombo = categoryOptionCombos[0].id;
    }
    return attributeOptionCombo;
  }


  /**
   * get dataset attribute option combo based on data entry form selection
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



}
