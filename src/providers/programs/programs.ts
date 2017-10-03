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

  /**
   *
   *
   * @param currentUser
   * @returns {Promise<any>}
   */
  downloadProgramsFromServer(currentUser){
    let fields= "id,name,programType,withoutRegistration,ignoreOverdueEvents,skipOffline,captureCoordinates,enrollmentDateLabel,onlyEnrollOnce,selectIncidentDatesInFuture,incidentDateLabel,useFirstStageDuringRegistration,completeEventsExpiryDays,displayFrontPageList,categoryCombo[id,name,categories[id,name,categoryOptions[name,id,organisationUnits[id]]]],programStages[id,name,sortOrder,programStageDataElements[id,displayInReports,compulsory,allowProvidedElsewhere,allowFutureDate,dataElement[id]],programStageSections[id]],organisationUnits[id],programIndicators[id,name,description,expression],translations,attributeValues[value,attribute[name]],validationCriterias,programRuleVariables,programTrackedEntityAttributes[id,mandatory,externalAccess,allowFutureDate,displayInList,sortOrder,trackedEntityAttribute[id,name,code,name,formName,description,confidential,searchScope,translations,inherit,legendSets,optionSet[name,options[name,id,code]]unique,orgunitScope,programScope,displayInListNoProgramaggregationType,displayInListNoProgram,pattern,sortOrderInListNoProgram,generated,displayOnVisitSchedule,valueType,sortOrderInVisitSchedule]],programRules";
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

  /**
   *
   * @param programs
   * @param currentUser
   * @returns {Promise<any>}
   */
  saveProgramsFromServer(programs,currentUser){
    return new Promise((resolve, reject)=> {
      if(programs.length == 0){
        this.savingProgramProgramRuleVariables(programs,currentUser).then(()=>{
          resolve();
        },error=>{
          reject(error);
        });
      }else{
        this.sqlLite.insertBulkDataOnTable(this.resource,programs,currentUser.currentDatabase).then(()=>{
          this.savingProgramProgramRuleVariables(programs,currentUser).then(()=>{
            resolve();
          },error=>{
            reject(error);
          });
        },error=>{
          reject(error);
        });
      }
    });
  }

  /**
   *
   * @param programs
   * @param currentUser
   * @returns {Promise<any>}
   */
  savingProgramProgramRuleVariables(programs,currentUser){
    let programProgramRuleVariables = [];
    let resource = "programProgramRuleVariables";
    programs.forEach((program : any)=>{
      if(program.programRuleVariables && program.programRuleVariables.length > 0){
        program.programRuleVariables.forEach((programRuleVariable : any)=>{
          programProgramRuleVariables.push({
            id : program.id + "-" + programRuleVariable.id,
            programId : program.id,
            programRuleVariableId : programRuleVariable.id
          });
        });
      }
    });
    return new Promise((resolve, reject)=> {
      if(programProgramRuleVariables.length == 0){
        this.savingProgramProgramRules(programs,currentUser).then(()=>{
          resolve();
        },error=>{
          reject(error);
        });
      }else{
        this.sqlLite.insertBulkDataOnTable(resource,programProgramRuleVariables,currentUser.currentDatabase).then(()=>{
          this.savingProgramProgramRules(programs,currentUser).then(()=>{
            resolve();
          },error=>{
            reject(error);
          });
        },error=>{
          reject(error);
        });
      }
    });
  }

  /**
   *
   * @param programs
   * @param currentUser
   * @returns {Promise<any>}
   */
  savingProgramProgramRules(programs,currentUser){
    let programProgramRules = [];
    let resource = "programProgramRules";
    programs.forEach((program : any)=>{
      if(program.programRules && program.programRules.length > 0){
        program.programRules.forEach((programRule : any)=>{
          programProgramRules.push({
            id : program.id + "-" + programRule.id,
            programId : program.id,
            programRuleId : programRule.id
          });
        });
      }
    });
    return new Promise((resolve, reject)=> {
      if(programProgramRules.length == 0){
        this.savingProgramOrganisationUnits(programs,currentUser).then(()=>{
          resolve();
        },error=>{
          reject(error);
        });
      }else{
        this.sqlLite.insertBulkDataOnTable(resource,programProgramRules,currentUser.currentDatabase).then(()=>{
          this.savingProgramOrganisationUnits(programs,currentUser).then(()=>{
            resolve();
          },error=>{
            reject(error);
          });
        },error=>{
          reject(error);
        });
      }
    });
  }

  /**
   *
   * @param programs
   * @param currentUser
   * @returns {Promise<any>}
   */
  savingProgramOrganisationUnits(programs,currentUser){
    let programOrganisationUnits = [];
    let resource = "programOrganisationUnits";
    programs.forEach((program : any)=>{
      if(program.organisationUnits && program.organisationUnits.length > 0){
        program.organisationUnits.forEach((organisationUnit : any)=>{
          programOrganisationUnits.push({
            id : program.id + "-" + organisationUnit.id,
            programId : program.id,
            orgUnitId : organisationUnit.id
          });
        });
      }
    });
    return new Promise((resolve, reject)=> {
      if(programOrganisationUnits.length == 0){
        this.savingProgramIndicators(programs,currentUser).then(()=>{
          resolve();
        },error=>{
          reject(error);
        });
      }else{
        this.sqlLite.insertBulkDataOnTable(resource,programOrganisationUnits,currentUser.currentDatabase).then(()=>{
          this.savingProgramIndicators(programs,currentUser).then(()=>{
            resolve();
          },error=>{
            reject(error);
          });
        },error=>{
          reject(error);
        });
      }
    });
  }

  /**
   *
   * @param programs
   * @param currentUser
   * @returns {Promise<any>}
   */
  savingProgramIndicators(programs,currentUser){
    let programIndicators = [];
    let resource = "programIndicators";
    programs.forEach((program : any)=>{
      if(program.programIndicators && program.programIndicators.length > 0){
        program.programIndicators.forEach((programIndicator : any)=>{
          programIndicators.push({
            id : program.id + "-" + programIndicator.id,
            programId : program.id,
            name : programIndicator.name,
            expression : programIndicator.expression
          });
        });
      }
    });
    return new Promise((resolve, reject)=> {
      if(programIndicators.length == 0){
        this.savingProgramProgramStages(programs,currentUser).then(()=>{
          resolve();
        },error=>{
          reject(error);
        });
      }else{
        this.sqlLite.insertBulkDataOnTable(resource,programIndicators,currentUser.currentDatabase).then(()=>{
          this.savingProgramProgramStages(programs,currentUser).then(()=>{
            resolve();
          },error=>{
            reject(error);
          });
        },error=>{
          reject(error);
        });
      }
    });
  }

  /**
   *
   * @param programs
   * @param currentUser
   * @returns {Promise<any>}
   */
  savingProgramProgramStages(programs,currentUser){
    let programProgramStages = [];
    let resource = "programProgramStages";
    programs.forEach((program : any)=>{
      if(program.programStages && program.programStages.length > 0){
        program.programStages.forEach((programStage : any)=>{
          programProgramStages.push({
            id : program.id + "-" + programStage.id,
            programId : program.id,
            name : programStage.name,
            sortOrder : programStage.sortOrder,
            programStageDataElements : programStage.programStageDataElements,
            programStageSections : programStage.programStageSections
          });
        });
      }
    });
    return new Promise((resolve, reject)=> {
      if(programProgramStages.length == 0){
        this.savingProgramProgramTrackedEntityAttributes(programs,currentUser).then(()=>{
          resolve();
        },error=>{
          reject(error);
        });
      }else{
        this.sqlLite.insertBulkDataOnTable(resource,programProgramStages,currentUser.currentDatabase).then(()=>{
          this.savingProgramProgramTrackedEntityAttributes(programs,currentUser).then(()=>{
            resolve();
          },error=>{
            reject(error);
          });
        },error=>{
          reject(error);
        });
      }
    });
  }

  /**
   *
   * @param programs
   * @param currentUser
   * @returns {Promise<any>}
   */
  savingProgramProgramTrackedEntityAttributes(programs,currentUser){
    let programTrackedEntityAttributes = [];
    let trackedEntityAttributes = [];
    let resource = "programTrackedEntityAttributes";
    programs.forEach((program : any)=>{
      if(program.programTrackedEntityAttributes && program.programTrackedEntityAttributes.length > 0){
        program.programTrackedEntityAttributes.forEach((programTrackedEntityAttribute : any)=>{
          programTrackedEntityAttributes.push({
            id : program.id + "-" + programTrackedEntityAttribute.id,
            programId : program.id,
            sortOrder : programTrackedEntityAttribute.sortOrder,
            mandatory : programTrackedEntityAttribute.mandatory,
            displayInList : programTrackedEntityAttribute.displayInList,
            externalAccess : programTrackedEntityAttribute.externalAccess
          });
          if(programTrackedEntityAttribute.trackedEntityAttribute && programTrackedEntityAttribute.trackedEntityAttribute.id){
            trackedEntityAttributes.push({
              id : programTrackedEntityAttribute.id + programTrackedEntityAttribute.trackedEntityAttribute.id,
              programTrackedEntityAttributeId : programTrackedEntityAttribute.id,
              trackedEntityAttribute : programTrackedEntityAttribute.trackedEntityAttribute
            });
          }
        });
      }
    });
    return new Promise((resolve, reject)=> {
      if(programTrackedEntityAttributes.length == 0){
        this.savingTrackedEntityAttributes(trackedEntityAttributes,currentUser).then(()=>{
          resolve();
        },error=>{
          reject(error);
        });
      }else{
        this.sqlLite.insertBulkDataOnTable(resource,programTrackedEntityAttributes,currentUser.currentDatabase).then(()=>{
          this.savingTrackedEntityAttributes(trackedEntityAttributes,currentUser).then(()=>{
            resolve();
          },error=>{
            reject(error);
          });
        },error=>{
          reject(error);
        });
      }
    });
  }

  /**
   *
   * @param trackedEntityAttributes
   * @param currentUser
   * @returns {Promise<any>}
   */
  savingTrackedEntityAttributes(trackedEntityAttributes,currentUser){
    let resource = "trackedEntityAttribute";
    return new Promise((resolve, reject)=> {
      if(trackedEntityAttributes.length == 0){
        resolve();
      }else{
        this.sqlLite.insertBulkDataOnTable(resource,trackedEntityAttributes,currentUser.currentDatabase).then(()=>{
          resolve();
        },error=>{
          reject(error);
        });
      }
    });
  }


  /**
   *
   * @param orgUnitId
   * @param programType
   * @param programIdsByUserRoles
   * @param currentUser
   * @returns {Promise<any>}
   */
  getProgramsAssignedOnOrgUnitAndUserRoles(orgUnitId,programType,programIdsByUserRoles,currentUser){
    let attributeKey = "id";
    let attributeArray = [];
    let programs = [];
    return new Promise((resolve, reject)=> {
      this.getProgramOrganisationUnits(orgUnitId,currentUser.currentDatabase).then((programOrganisationUnits: any)=>{
        if(currentUser.authorities && (currentUser.authorities.indexOf("ALL") > -1)){
          programOrganisationUnits.forEach((programOrganisationUnit : any)=>{
            attributeArray.push(programOrganisationUnit.programId);
          });
        }else{
          programOrganisationUnits.forEach((programOrganisationUnit : any)=>{
            if(programIdsByUserRoles.indexOf(programOrganisationUnit.programId) != -1){
              attributeArray.push(programOrganisationUnit.programId);
            }
          });
        }
        this.sqlLite.getDataFromTableByAttributes(this.resource,attributeKey,attributeArray,currentUser.currentDatabase).then((programsResponse: any)=>{
          if(programsResponse && programsResponse.length > 0){
            programsResponse = this.getSortedPrograms(programsResponse);
            let hasProgramSelected = false;
            programsResponse.forEach((program : any)=>{
              if(program.programType && program.programType == programType){
                programs.push(program);
                if(this.lastSelectedProgram && this.lastSelectedProgram.id){
                  if(this.lastSelectedProgram.id == program.id){
                    hasProgramSelected = true;
                  }
                }
              }
            });
            if(programs.length > 0){
              if(!hasProgramSelected){
                this.setLastSelectedProgram(programs[0])
              }
            }else{
              this.lastSelectedProgram = null;
            }
          }else{
            this.lastSelectedProgram = null;
          }
          resolve(programs);
        },error=>{reject(error)});
      },error=>{
        reject(error);
      });
    });
  }

  /**
   * 
   * @param selectedOrgUnitId
   * @param categories
   * @returns {Array}
   */
  getProgramCategoryComboCategories(selectedOrgUnitId,categories){
    let categoryComboCategories = [];
    categories.forEach((category : any)=>{
      let categoryOptions = [];
      category.categoryOptions.forEach((categoryOption : any)=>{
        if(this.isOrganisationUnitAllowed(selectedOrgUnitId,categoryOption)){
          categoryOptions.push({
            id : categoryOption.id,name : categoryOption.name
          })
        }
      });
      categoryComboCategories.push({
        id : category.id,name : category.name ,categoryOptions : categoryOptions
      })
    });
    return categoryComboCategories;
  }

  /**
   *
   * @param selectedOrgUnitId
   * @param categoryOption
   * @returns {boolean}
   */
  isOrganisationUnitAllowed(selectedOrgUnitId,categoryOption){
    let result = true;
    //@todo support of filter options by ou
    // if(categoryOption.organisationUnits && categoryOption.organisationUnits.length > 0){
    //   result = false;
    //   categoryOption.organisationUnits.forEach((organisationUnit : any)=>{
    //     if(selectedOrgUnitId == organisationUnit.id){
    //       result = true;
    //     }
    //   });
    // }
    return result;
  }

  /**
   *
   * @param programs
   * @returns {any}
   */
  getSortedPrograms(programs){
    programs.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
    return programs;
  }

  /**
   *
   * @param orgUnitId
   * @param dataBaseName
   * @returns {Promise<any>}
   */
  getProgramOrganisationUnits(orgUnitId,dataBaseName){
    let resource = "programOrganisationUnits";
    let attributeValue  = [orgUnitId];
    let attributeKey = "orgUnitId";
    return new Promise((resolve, reject)=> {
      this.sqlLite.getDataFromTableByAttributes(resource,attributeKey,attributeValue,dataBaseName).then((programOrganisationUnits: any)=>{
        resolve(programOrganisationUnits);
      },error=>{reject(error)});
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
