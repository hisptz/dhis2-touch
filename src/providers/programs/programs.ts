import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {HttpClientProvider} from "../http-client/http-client";
import {Observable} from "rxjs/Observable";

/*
 Generated class for the ProgramsProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class ProgramsProvider {

  resource: string;
  lastSelectedProgram: any;

  constructor(private sqlLite: SqlLiteProvider, private HttpClient: HttpClientProvider) {
    this.resource = "programs";
  }

  setLastSelectedProgram(program) {
    this.lastSelectedProgram = program;
  }

  getLastSelectedProgram() {
    return this.lastSelectedProgram;
  }

  /**
   *
   * @param currentUser
   * @returns {Observable<any>}
   */
  downloadProgramsFromServer(currentUser): Observable<any> {
    let fields = "id,name,displayName,programType,withoutRegistration,trackedEntity[id,displayName],ignoreOverdueEvents,skipOffline,captureCoordinates,enrollmentDateLabel,onlyEnrollOnce,selectIncidentDatesInFuture,incidentDateLabel,useFirstStageDuringRegistration,completeEventsExpiryDays,displayFrontPageList,categoryCombo[id,name,categories[id,name,categoryOptions[name,id,organisationUnits[id]]]],programStages[id,name,executionDateLabel,hideDueDate,allowGenerateNextVisit,blockEntryForm,repeatable,formType,sortOrder,generatedByEnrollmentDate,autoGenerateEvent,captureCoordinates,dueDateLabel,programStageDataElements[id,displayInReports,compulsory,allowProvidedElsewhere,allowFutureDate,*,dataElement[id]],programStageSections[id]],organisationUnits[id],programIndicators[id,name,description,expression],translations,attributeValues[value,attribute[name]],validationCriterias,programRuleVariables,programTrackedEntityAttributes[id,mandatory,externalAccess,allowFutureDate,displayInList,sortOrder,trackedEntityAttribute[id,name,code,name,formName,description,confidential,searchScope,translations,inherit,legendSets,optionSet[name,options[name,id,code]]unique,orgunitScope,programScope,displayInListNoProgramaggregationType,displayInListNoProgram,pattern,sortOrderInListNoProgram,generated,displayOnVisitSchedule,valueType,sortOrderInVisitSchedule]],programRules";
    let url = "/api/25/" + this.resource + ".json?paging=false&fields=" + fields;
    return new Observable(observer => {
      this.HttpClient.get(url, true, currentUser).subscribe((response: any) => {
        observer.next(response);
        observer.complete();
      }, error => {
        observer.error(error);
      });
    });
  }

  /**
   *
   * @param programs
   * @param currentUser
   * @returns {Observable<any>}
   */
  saveProgramsFromServer(programs, currentUser): Observable<any> {
    return new Observable(observer => {
      if (programs.length == 0) {
        this.savingProgramProgramRuleVariables(programs, currentUser).subscribe(() => {
          observer.next();
          observer.complete();
        }, error => {
          observer.error(error);
        });
      } else {
        this.sqlLite.insertBulkDataOnTable(this.resource, programs, currentUser.currentDatabase).subscribe(() => {
          this.savingProgramProgramRuleVariables(programs, currentUser).subscribe(() => {
            observer.next();
            observer.complete();
          }, error => {
            observer.error(error);
          });
        }, error => {
          observer.error(error);
        });
      }
    });
  }

  /**
   *
   * @param programs
   * @param currentUser
   * @returns {Observable<any>}
   */
  savingProgramProgramRuleVariables(programs, currentUser): Observable<any> {
    let programProgramRuleVariables = [];
    let resource = "programProgramRuleVariables";
    programs.forEach((program: any) => {
      if (program.programRuleVariables && program.programRuleVariables.length > 0) {
        program.programRuleVariables.forEach((programRuleVariable: any) => {
          programProgramRuleVariables.push({
            id: program.id + "-" + programRuleVariable.id,
            programId: program.id,
            programRuleVariableId: programRuleVariable.id
          });
        });
      }
    });
    return new Observable(observer => {
      if (programProgramRuleVariables.length == 0) {
        this.savingProgramProgramRules(programs, currentUser).subscribe(() => {
          observer.next();
          observer.complete();
        }, error => {
          observer.error(error);
        });
      } else {
        this.sqlLite.insertBulkDataOnTable(resource, programProgramRuleVariables, currentUser.currentDatabase).subscribe(() => {
          this.savingProgramProgramRules(programs, currentUser).subscribe(() => {
            observer.next();
            observer.complete();
          }, error => {
            observer.error(error);
          });
        }, error => {
          observer.error(error);
        });
      }
    });
  }

  /**
   *
   * @param programs
   * @param currentUser
   * @returns {Observable<any>}
   */
  savingProgramProgramRules(programs, currentUser): Observable<any> {
    let programProgramRules = [];
    let resource = "programProgramRules";
    programs.forEach((program: any) => {
      if (program.programRules && program.programRules.length > 0) {
        program.programRules.forEach((programRule: any) => {
          programProgramRules.push({
            id: program.id + "-" + programRule.id,
            programId: program.id,
            programRuleId: programRule.id
          });
        });
      }
    });
    return new Observable(observer => {
      if (programProgramRules.length == 0) {
        this.savingProgramOrganisationUnits(programs, currentUser).subscribe(() => {
          observer.next();
          observer.complete();
        }, error => {
          observer.error(error);
        });
      } else {
        this.sqlLite.insertBulkDataOnTable(resource, programProgramRules, currentUser.currentDatabase).subscribe(() => {
          this.savingProgramOrganisationUnits(programs, currentUser).subscribe(() => {
            observer.next();
            observer.complete();
          }, error => {
            observer.error(error);
          });
        }, error => {
          observer.error(error);
        });
      }
    });
  }

  /**
   *
   * @param programs
   * @param currentUser
   * @returns {Observable<any>}
   */
  savingProgramOrganisationUnits(programs, currentUser): Observable<any> {
    let programOrganisationUnits = [];
    let resource = "programOrganisationUnits";
    programs.forEach((program: any) => {
      if (program.organisationUnits && program.organisationUnits.length > 0) {
        program.organisationUnits.forEach((organisationUnit: any) => {
          programOrganisationUnits.push({
            id: program.id + "-" + organisationUnit.id,
            programId: program.id,
            orgUnitId: organisationUnit.id
          });
        });
      }
    });
    return new Observable(observer => {
      if (programOrganisationUnits.length == 0) {
        this.savingProgramIndicators(programs, currentUser).subscribe(() => {
          observer.next();
          observer.complete();
        }, error => {
          observer.error(error);
        });
      } else {
        this.sqlLite.insertBulkDataOnTable(resource, programOrganisationUnits, currentUser.currentDatabase).subscribe(() => {
          this.savingProgramIndicators(programs, currentUser).subscribe(() => {
            observer.next();
            observer.complete();
          }, error => {
            observer.error(error);
          });
        }, error => {
          observer.error(error);
        });
      }
    });
  }

  /**
   *
   * @param programs
   * @param currentUser
   * @returns {Observable<any>}
   */
  savingProgramIndicators(programs, currentUser): Observable<any> {
    let programIndicators = [];
    let resource = "programIndicators";
    programs.forEach((program: any) => {
      if (program.programIndicators && program.programIndicators.length > 0) {
        program.programIndicators.forEach((programIndicator: any) => {
          programIndicators.push({
            id: program.id + "-" + programIndicator.id,
            programId: program.id,
            name: programIndicator.name,
            expression: programIndicator.expression
          });
        });
      }
    });
    return new Observable(observer => {
      if (programIndicators.length == 0) {
        this.savingProgramProgramStages(programs, currentUser).subscribe(() => {
          observer.next();
          observer.complete();
        }, error => {
          observer.error(error);
        });
      } else {
        this.sqlLite.insertBulkDataOnTable(resource, programIndicators, currentUser.currentDatabase).subscribe(() => {
          this.savingProgramProgramStages(programs, currentUser).subscribe(() => {
            observer.next();
            observer.complete();
          }, error => {
            observer.error(error);
          });
        }, error => {
          observer.error(error);
        });
      }
    });
  }

  /**
   *
   * @param programs
   * @param currentUser
   * @returns {Observable<any>}
   */
  savingProgramProgramStages(programs, currentUser): Observable<any> {
    let programProgramStages = [];
    let resource = "programProgramStages";
    programs.forEach((program: any) => {
      if (program.programStages && program.programStages.length > 0) {
        program.programStages.forEach((programStage: any) => {
          programProgramStages.push({
            id: program.id + "-" + programStage.id,
            programId: program.id,
            name: programStage.name,
            executionDateLabel: programStage.executionDateLabel,
            formType: programStage.formType,
            blockEntryForm: programStage.blockEntryForm,
            hideDueDate: programStage.hideDueDate,
            repeatable: programStage.repeatable,
            allowGenerateNextVisit: programStage.allowGenerateNextVisit,
            generatedByEnrollmentDate: programStage.generatedByEnrollmentDate,
            autoGenerateEvent: programStage.autoGenerateEvent,
            captureCoordinates: programStage.captureCoordinates,
            dueDateLabel: programStage.dueDateLabel,
            sortOrder: programStage.sortOrder,
            programStageDataElements: programStage.programStageDataElements,
            programStageSections: programStage.programStageSections
          });
        });
      }
    });
    return new Observable(observer => {
      if (programProgramStages.length == 0) {
        this.savingProgramProgramTrackedEntityAttributes(programs, currentUser).subscribe(() => {
          observer.next();
          observer.complete();
        }, error => {
          observer.error(error);
        });
      } else {
        this.sqlLite.insertBulkDataOnTable(resource, programProgramStages, currentUser.currentDatabase).subscribe(() => {
          this.savingProgramProgramTrackedEntityAttributes(programs, currentUser).subscribe(() => {
            observer.next();
            observer.complete();
          }, error => {
            observer.error(error);
          });
        }, error => {
          observer.error(error);
        });
      }
    });
  }

  /**
   *
   * @param programs
   * @param currentUser
   * @returns {Observable<any>}
   */
  savingProgramProgramTrackedEntityAttributes(programs, currentUser): Observable<any> {
    let programTrackedEntityAttributes = [];
    let trackedEntityAttributes = [];
    let resource = "programTrackedEntityAttributes";
    programs.forEach((program: any) => {
      if (program.programTrackedEntityAttributes && program.programTrackedEntityAttributes.length > 0) {
        program.programTrackedEntityAttributes.forEach((programTrackedEntityAttribute: any) => {
          programTrackedEntityAttributes.push({
            id: program.id + "-" + programTrackedEntityAttribute.id,
            programId: program.id,
            sortOrder: programTrackedEntityAttribute.sortOrder,
            mandatory: programTrackedEntityAttribute.mandatory,
            displayInList: programTrackedEntityAttribute.displayInList,
            externalAccess: programTrackedEntityAttribute.externalAccess
          });
          if (programTrackedEntityAttribute.trackedEntityAttribute && programTrackedEntityAttribute.trackedEntityAttribute.id) {
            trackedEntityAttributes.push({
              id: programTrackedEntityAttribute.id + programTrackedEntityAttribute.trackedEntityAttribute.id,
              programTrackedEntityAttributeId: programTrackedEntityAttribute.id,
              trackedEntityAttribute: programTrackedEntityAttribute.trackedEntityAttribute
            });
          }
        });
      }
    });
    return new Observable(observer => {
      if (programTrackedEntityAttributes.length == 0) {
        this.savingTrackedEntityAttributes(trackedEntityAttributes, currentUser).subscribe(() => {
          observer.next();
          observer.complete();
        }, error => {
          observer.error(error);
        });
      } else {
        this.sqlLite.insertBulkDataOnTable(resource, programTrackedEntityAttributes, currentUser.currentDatabase).subscribe(() => {
          this.savingTrackedEntityAttributes(trackedEntityAttributes, currentUser).subscribe(() => {
            observer.next();
            observer.complete();
          }, error => {
            observer.error(error);
          });
        }, error => {
          observer.error(error);
        });
      }
    });
  }

  /**
   *
   * @param trackedEntityAttributes
   * @param currentUser
   * @returns {Observable<any>}
   */
  savingTrackedEntityAttributes(trackedEntityAttributes, currentUser): Observable<any> {
    let resource = "trackedEntityAttribute";
    return new Observable(observer => {
      if (trackedEntityAttributes.length == 0) {
        observer.next();
        observer.complete();
      } else {
        this.sqlLite.insertBulkDataOnTable(resource, trackedEntityAttributes, currentUser.currentDatabase).subscribe(() => {
          observer.next();
          observer.complete();
        }, error => {
          observer.error(error);
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
   * @returns {Observable<any>}
   */
  getProgramsAssignedOnOrgUnitAndUserRoles(orgUnitId, programType, programIdsByUserRoles, currentUser): Observable<any> {
    let attributeKey = "id";
    let attributeArray = [];
    let programs = [];
    return new Observable(observer => {
      this.getProgramOrganisationUnits(orgUnitId, currentUser.currentDatabase).subscribe((programOrganisationUnits: any) => {
        if (currentUser.authorities && (currentUser.authorities.indexOf("ALL") > -1)) {
          programOrganisationUnits.forEach((programOrganisationUnit: any) => {
            attributeArray.push(programOrganisationUnit.programId);
          });
        } else {
          programOrganisationUnits.forEach((programOrganisationUnit: any) => {
            if (programIdsByUserRoles.indexOf(programOrganisationUnit.programId) != -1) {
              attributeArray.push(programOrganisationUnit.programId);
            }
          });
        }
        this.sqlLite.getDataFromTableByAttributes(this.resource, attributeKey, attributeArray, currentUser.currentDatabase).subscribe((programsResponse: any) => {
          if (programsResponse && programsResponse.length > 0) {
            programsResponse = this.getSortedPrograms(programsResponse);
            let hasProgramSelected = false;
            programsResponse.forEach((program: any) => {
              if (program.programType && program.programType == programType) {
                program.withoutRegistration = JSON.parse(program.withoutRegistration);
                programs.push(program);
                if (this.lastSelectedProgram && this.lastSelectedProgram.id) {
                  if (this.lastSelectedProgram.id == program.id) {
                    hasProgramSelected = true;
                  }
                }
              }
            });
            if (programs.length > 0) {
              if (!hasProgramSelected) {
                this.setLastSelectedProgram(programs[0])
              }
            } else {
              this.lastSelectedProgram = null;
            }
          } else {
            this.lastSelectedProgram = null;
          }
          observer.next(programs);
          observer.complete();
        }, error => {
          observer.error(error)
        });
      }, error => {
        observer.error(error);
      });
    });
  }

  /**
   *
   * @param selectedOrgUnitId
   * @param categories
   * @returns {Array}
   */
  getProgramCategoryComboCategories(selectedOrgUnitId, categories) {
    let categoryComboCategories = [];
    categories.forEach((category: any) => {
      let categoryOptions = [];
      category.categoryOptions.forEach((categoryOption: any) => {
        if (this.isOrganisationUnitAllowed(selectedOrgUnitId, categoryOption)) {
          categoryOptions.push({
            id: categoryOption.id, name: categoryOption.name
          })
        }
      });
      categoryComboCategories.push({
        id: category.id, name: category.name, categoryOptions: categoryOptions
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
  isOrganisationUnitAllowed(selectedOrgUnitId, categoryOption) {
    let result = true;
    if (categoryOption.organisationUnits && categoryOption.organisationUnits.length > 0) {
      result = false;
      categoryOption.organisationUnits.forEach((organisationUnit: any) => {
        if (selectedOrgUnitId == organisationUnit.id) {
          result = true;
        }
      });
    }
    return result;
  }

  /**
   *
   * @param programs
   * @returns {any}
   */
  getSortedPrograms(programs) {
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
   * @returns {Observable<any>}
   */
  getProgramOrganisationUnits(orgUnitId, dataBaseName): Observable<any> {
    let resource = "programOrganisationUnits";
    let attributeValue = [orgUnitId];
    let attributeKey = "orgUnitId";
    return new Observable(observer => {
      this.sqlLite.getDataFromTableByAttributes(resource, attributeKey, attributeValue, dataBaseName).subscribe((programOrganisationUnits: any) => {
        observer.next(programOrganisationUnits);
        observer.complete();
      }, error => {
        observer.error(error)
      });
    });
  }


  /**
   *
   * @param programId
   * @param currentUser
   * @returns {Observable<any>}
   */
  getProgramById(programId, currentUser): Observable<any> {
    let attribute = 'id';
    let attributeValue = [];
    attributeValue.push(programId);
    return new Observable(observer => {
      this.sqlLite.getDataFromTableByAttributes(this.resource, attribute, attributeValue, currentUser.currentDatabase).subscribe((programs: any) => {
        if (programs.length > 0) {
          observer.next(programs[0]);
        } else {
          observer.next({});
        }
        observer.complete();
      }, error => {
        observer.error(error);
      });
    });
  }

  /**
   *
   * @param programId
   * @param currentUser
   * @returns {Observable<any>}
   */
  getProgramsStages(programId, currentUser): Observable<any> {
    let resource = 'programProgramStages';
    let attribute = 'programId';
    let attributeValue = [];
    attributeValue.push(programId);
    return new Observable(observer => {
      this.sqlLite.getDataFromTableByAttributes(resource, attribute, attributeValue, currentUser.currentDatabase).subscribe((programs: any) => {
        observer.next(programs);
        observer.complete();
      }, error => {
        observer.error(error);
      });
    });
  }


  /**
   *
   * @param programId
   * @param dataBaseName
   * @returns {Observable<any>}
   */
  getOrganisationUnitsinPrograms(programId, dataBaseName): Observable<any> {
    let resource = "programOrganisationUnits";
    let attributeValue = [programId];
    let attributeKey = "programId";
    return new Observable(observer => {
      this.sqlLite.getDataFromTableByAttributes(resource, attributeKey, attributeValue, dataBaseName).subscribe((orgUnitsInProgram: any) => {
        observer.next(orgUnitsInProgram);
        observer.complete();
      }, error => {
        observer.error(error)
      });
    });
  }


  /**
   *
   * @param programId
   * @param dataBaseName
   * @returns {Observable<any>}
   */
  getProgramRules(programId, dataBaseName): Observable<any> {
    let resource = "programProgramRules";
    let attributeValue = [programId];
    let attributeKey = "programId";
    return new Observable(observer => {
      this.sqlLite.getDataFromTableByAttributes(resource, attributeKey, attributeValue, dataBaseName).subscribe((orgUnitsInProgram: any) => {
        observer.next(orgUnitsInProgram);
        observer.complete();
      }, error => {
        observer.error(error)
      });
    });
  }


  /**
   *
   * @param programId
   * @param dataBaseName
   * @returns {Observable<any>}
   */
  getProgramRulesVariables(programId, dataBaseName): Observable<any> {
    let resource = "programProgramRuleVariables";
    let attributeValue = [programId];
    let attributeKey = "programId";
    return new Observable(observer => {
      this.sqlLite.getDataFromTableByAttributes(resource, attributeKey, attributeValue, dataBaseName).subscribe((orgUnitsInProgram: any) => {
        observer.next(orgUnitsInProgram);
        observer.complete();
      }, error => {
        observer.error(error)
      });
    });
  }


  /**
   *
   * @param programId
   * @param dataBaseName
   * @returns {Observable<any>}
   */
  getProgramIndicators(programId, dataBaseName): Observable<any> {
    let resource = "programIndicators";
    let attributeValue = [programId];
    let attributeKey = "programId";
    return new Observable(observer => {
      this.sqlLite.getDataFromTableByAttributes(resource, attributeKey, attributeValue, dataBaseName).subscribe((orgUnitsInProgram: any) => {
        observer.next(orgUnitsInProgram);
        observer.complete();
      }, error => {
        observer.error(error)
      });
    });
  }


  /**
   *
   * @param programId
   * @param currentUser
   * @returns {Observable<any>}
   */
  getProgramProgramTrackedEntityAttributes(programId, currentUser): Observable<any> {
    let attributeKey = "programId";
    let attributeArray = [programId];
    let resource = "programTrackedEntityAttributes";
    return new Observable(observer => {
      this.sqlLite.getDataFromTableByAttributes(resource, attributeKey, attributeArray, currentUser.currentDatabase).subscribe((programTrackedEntityAttributes: any) => {
        observer.next(programTrackedEntityAttributes);
        observer.complete();
      }, error => {
        observer.error(error);
      });
    });
  }

  /**
   *
   * @param programTrackedEntityAttributeIds
   * @param currentUser
   * @returns {Observable<any>}
   */
  getTrackedEntityAttributes(programTrackedEntityAttributeIds, currentUser): Observable<any> {
    let attributeKey = "programTrackedEntityAttributeId";
    let resource = "trackedEntityAttribute";
    return new Observable(observer => {
      this.sqlLite.getDataFromTableByAttributes(resource, attributeKey, programTrackedEntityAttributeIds, currentUser.currentDatabase).subscribe((trackedEntityAttributes: any) => {
        observer.next(trackedEntityAttributes);
        observer.complete();
      }, error => {
        observer.error(error);
      });
    });
  }


}
