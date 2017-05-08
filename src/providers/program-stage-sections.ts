import { Injectable } from '@angular/core';
import {SqlLite} from "./sql-lite";

/*
  Generated class for the ProgramStageSections provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ProgramStageSections {

  public resource : string;

  constructor(private sqlLite : SqlLite) {
    this.resource = "programStageSections";
  }

  getProgramStageSections(programStageSectionsIdsArray,currentUser){
    let attribute = 'id';
    let attributeValue =[];
    programStageSectionsIdsArray.forEach((programStageSection:any)=>{
      attributeValue.push(programStageSection.id);
    });
    return new Promise((resolve, reject)=> {
      this.sqlLite.getDataFromTableByAttributes(this.resource,attribute,attributeValue,currentUser.currentDatabase).then(programStageSections=>{
        resolve(programStageSections);
      },error=>{
        reject(error);
      })
    });
  }


}
