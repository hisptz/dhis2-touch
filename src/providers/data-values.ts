import { Injectable } from '@angular/core';
import {HttpClient} from "./http-client/http-client";

/*
  Generated class for the DataValues provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DataValues {

  constructor(private httpClient : HttpClient) {
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
        reject(error);
      });
    });
  }


  getFilteredDataValuesByDataSetAttributeOptionCombo(dataValuesResponse,attributeOptionCombo){
    let FilteredDataValues = [];
    dataValuesResponse.dataValues.forEach((dataValue : any)=>{
      if(dataValue.attributeOptionCombo == attributeOptionCombo){
        FilteredDataValues.push({
          categoryOptionCombo : dataValue.categoryOptionCombo,
          dataElement : dataValue.dataElement,
          value : dataValue.value
        });
      }
    });
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

}
