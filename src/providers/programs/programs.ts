import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {HttpClientProvider} from "../http-client/http-client";

/*
  Generated class for the ProgramsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ProgramsProvider {

  public resource : string;
  public lastSelectedProgram : any;

  constructor(private sqlLite : SqlLiteProvider,private HttpClient : HttpClientProvider) {
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


  downloadProgramsFromServer(currentUser){
    let fields= "id,name,withoutRegistration,programType,categoryCombo[id,name,categories[id,name,categoryOptions[name,id]]],programStages[id,name,programStageprograms[id,displayInReports,compulsory,allowProvidedElsewhere,allowFutureDate,dataElement[id,name,formName,attributeValues[value,attribute[name]],categoryCombo[id,name,categoryOptionCombos[id,name]],displayName,description,valueType,optionSet[name,options[name,id,code]]],programStageSections[id]],organisationUnits[id],programIndicators,translations,attributeValues,validationCriterias,programRuleVariables,programTrackedEntityAttributes,programRules";
      let url = "/api/25/"+this.resource+".json?paging=false&fields=" + fields;
    return new Promise((resolve, reject)=> {
      this.HttpClient.get(url,currentUser).then((response : any)=>{
        response = JSON.parse(response.data);
        resolve(response);
      },error=>{
        reject(error);
      });
    });
  }

  saveProgramsFromServer(programs,currentUser){
    return new Promise((resolve, reject)=> {
      if(programs.length == 0){
        resolve();
      }else{
        this.sqlLite.insertBulkDataOnTable(this.resource,programs,currentUser.currentDatabase).then(()=>{
          resolve();
        },error=>{
          console.log(JSON.stringify(error));
          reject(error);
        });
      }
    });
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

    return new Promise((resolve, reject)=>{

      if(orgUnit.programs){

        resolve(assignedPrograms);


      }else{

        orgUnit.forEach((ogUnit:any)=>{
          // if(programIdsByUserRoles.indexOf(ogUnit.id) != -1){
          if(programIdsByUserRoles.length > 0){
            attributeValue.push(ogUnit.name);

          }
        });
        this.sqlLite.getDataFromTableByAttributes(this.resource,attribute,attributeValue,currentUser.currentDatabase).then((programs : any)=>{
          this.sortProgramList(programs);

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

    attributeValue.push(programId);



    //attributeValue.push(programId);
    return new Promise((resolve, reject)=> {
      this.sqlLite.getDataFromTableByAttributes(this.resource,attribute,attributeValue,currentUser.currentDatabase).then((programs:any)=>{
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


  /**
   * get program by id
   * @param programId
   * @param currentUser
   * @returns {Promise<T>}
   */
  getProgramByName(programName,currentUser){
    let attribute = 'name';

    let attributeValue =[];

    attributeValue.push(programName);



    //attributeValue.push(programId);
    return new Promise((resolve, reject)=> {
      this.sqlLite.getDataFromTableByAttributes(this.resource,attribute,attributeValue,currentUser.currentDatabase).then((programs:any)=>{
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
