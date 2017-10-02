import { Injectable } from '@angular/core';
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
  public lastSelectedProgramCategoryOption : any;

  constructor(private sqlLite : SqlLiteProvider,private HttpClient : HttpClientProvider) {
    this.resource = "programs";
  }

  setLastSelectedProgram(program){
    this.lastSelectedProgram = program;
  }

  getLastSelectedProgram(){
    return this.lastSelectedProgram;
  }

  setLastSelectedProgramCategoryOption(programOption){
    this.lastSelectedProgramCategoryOption = programOption;
  }

  downloadProgramsFromServer(currentUser){
    let fields= "id,name,programType,withoutRegistration,ignoreOverdueEvents,skipOffline,captureCoordinates,enrollmentDateLabel,onlyEnrollOnce,selectIncidentDatesInFuture,incidentDateLabel,useFirstStageDuringRegistration,completeEventsExpiryDays,displayFrontPageList,,categoryCombo[id,name,categories[id,name,categoryOptions[name,id]]],programStages[id,name,programStageDataElements[id,displayInReports,compulsory,allowProvidedElsewhere,allowFutureDate,dataElement[id]],programStageSections[id]],organisationUnits[id],programIndicators[id,name,description,expression],translations,attributeValues[value,attribute[name]],validationCriterias,programRuleVariables,programTrackedEntityAttributes[id,mandatory,externalAccess,allowFutureDate,displayInList,sortOrder,trackedEntityAttribute[id,name,code,name,formName,description,confidential,searchScope,translations,inherit,legendSets,optionSet[name,options[name,id,code]]unique,orgunitScope,programScope,displayInListNoProgramaggregationType,displayInListNoProgram,pattern,sortOrderInListNoProgram,generated,displayOnVisitSchedule,valueType,sortOrderInVisitSchedule]],programRules";
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
    //programProgramRuleVariables,programProgramRules,programProgramTrackedEntityAttributes,trackedEntityAttribute,programIndicators,programProgramStages,programOrganisationUnits
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
    return new Promise((resolve, reject)=> {
      this.sqlLite.getDataFromTableByAttributes(this.resource,attribute,attributeValue,currentUser.currentDatabase).then((programs:any)=>{
        if(programs.length > 0){
          resolve(programs[0]);
        }else{
          resolve({});
        }
      },error=>{
        reject(error);
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
    return new Promise((resolve, reject)=> {
      this.sqlLite.getDataFromTableByAttributes(this.resource,attribute,attributeValue,currentUser.currentDatabase).then((programs:any)=>{
        if(programs.length > 0){
          resolve(programs[0]);
        }else{
          resolve({});
        }
      },error=>{
        reject(error);
      });
    });
  }

  getProgramsSource(orgUnit,dataBaseName){
    let attributeValue  = [orgUnit];
    let attributeKey = "organisationUnits";
    return new Promise((resolve, reject)=> {
      this.sqlLite.getDataFromTableByAttributes(this.resource,attributeKey,attributeValue,dataBaseName).then((programSource: any)=>{
        resolve(programSource);
      },error=>{reject(error)})
    });
  }



}
