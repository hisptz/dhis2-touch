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

  getDataValuesSetAttributeOptionCombo(dataDimension,categoryOptionCombos){
    let attributeOptionCombo = categoryOptionCombos[0].id;
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
    }
    return attributeOptionCombo;
  }

}
