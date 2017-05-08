import { Injectable } from '@angular/core';
import {SqlLite} from "./sql-lite";

/*
  Generated class for the ProgramStageDataElements provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ProgramStageDataElements {

  public resource : string;

  constructor(private sqlLite : SqlLite) {
    this.resource = "programStageDataElements";
  }

  getProgramStageDataElements(programStageDataElementsIdsArray,currentUser){
    let attribute = 'id';
    let attributeValue =[];
    for(let programStageDataElement of programStageDataElementsIdsArray){
      attributeValue.push(programStageDataElement.id);
    }
    return new Promise((resolve, reject) =>{
      this.sqlLite.getDataFromTableByAttributes(this.resource,attribute,attributeValue,currentUser.currentDatabase).then(programStageDataElements=>{
        resolve(programStageDataElements);
      },error=>{
        reject(error);
      })
    });
  }



}
