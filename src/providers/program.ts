import { Injectable } from '@angular/core';
import {SqlLite} from "./sql-lite";

/*
  Generated class for the Program provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Program {

  public resource : string;
  public lastSelectedProgram : any;

  constructor(private sqlLite : SqlLite) {
    this.resource = "programs";
  }

  setLastSelectedProgram(program){
    this.lastSelectedProgram = program;
  }

  getLastSelectedProgram(){
    return this.lastSelectedProgram;
  }

  resetPrograms(){
    this.lastSelectedProgram = null;
  }


  /**
   * get programs assigned to user based on user roles as well as orgunit
   * @param orgUnit
   * @param programIdsByUserRoles
   * @param currentUser
   * @returns {Promise<T>}
     */
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
          self.sortProgramList(programs);
          programs.forEach((program:any)=>{
            assignedPrograms.push({
              id: program.id,
              name: program.name,
              programType : program.programType,
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

  /**
   * sortProgramList
   * @param dataSetList
   * @returns {any}
     */
  sortProgramList(dataSetList){
    dataSetList.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
    return dataSetList;
  }

  /**
   * get program by id
   * @param programId
   * @param currentUser
   * @returns {Promise<T>}
     */
  getProgramById(programId,currentUser){
    let attribute = 'id';
    let attributeValue =[];
    let self = this;
    attributeValue.push(programId);
    return new Promise(function(resolve, reject) {
      self.sqlLite.getDataFromTableByAttributes(self.resource,attribute,attributeValue,currentUser.currentDatabase).then((programs:any)=>{
        if(programs.length > 0){
          resolve(programs[0]);
        }else{
          resolve({});
        }
      },error=>{
        reject();
      });
    });
  }

}
