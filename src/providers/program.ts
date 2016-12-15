import { Injectable } from '@angular/core';
import {SqlLite} from "./sql-lite/sql-lite";

/*
  Generated class for the Program provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Program {

  public resource : string;

  constructor(private sqlLite : SqlLite) {
    this.resource = "programs";
  }


  getProgramsAssignedOnOrgUnitAndUserRoles(orgUnit,programIdsByUserRoles,currentUser){
    let attribute = 'id';
    let attributeValue =[];
    let assignedPrograms = [];
    let self = this;
    return new Promise(function(resolve, reject) {
      if(!orgUnit.programs){
        resolve(assignedPrograms);
      }else{
        orgUnit.programs.forEach((program:any)=>{
          if(programIdsByUserRoles.indexOf(program.id) != -1){
            attributeValue.push(program.id);
          }
        });
        self.sqlLite.getDataFromTableByAttributes(self.resource,attribute,attributeValue,currentUser.currentDatabase).then((programs : any)=>{
          programs.forEach((program:any)=>{
            assignedPrograms.push({
              id: program.id,
              name: program.name,
              programStages : program.programStages,
              categoryCombo : program.categoryCombo
            });
          });
          resolve(assignedPrograms);
        },error=>{
          reject(error);
        });
      }
    });

  }

//  let self = this;
//  return new Promise(function(resolve, reject) {
//
//});

}
