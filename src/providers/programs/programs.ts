/*
 *
 * Copyright 2015 HISP Tanzania
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 *
 * @since 2015
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { SqlLiteProvider } from '../sql-lite/sql-lite';
import { HttpClientProvider } from '../http-client/http-client';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { CurrentUser } from '../../models/currentUser';

/*
 Generated class for the ProgramsProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class ProgramsProvider {
  resource: string;
  lastSelectedProgram: any;

  constructor(
    private sqlLite: SqlLiteProvider,
    private HttpClient: HttpClientProvider
  ) {
    this.resource = 'programs';
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
  downloadProgramsFromServer(currentUser: CurrentUser): Observable<any> {
    const { userOrgUnitIds } = currentUser;
    const fields =
      'fields=id,name,displayName,displayIncidentDate,programType,withoutRegistration,dataEntryForm[htmlCode],trackedEntityType[id,displayName],trackedEntity[id,displayName],ignoreOverdueEvents,skipOffline,captureCoordinates,enrollmentDateLabel,onlyEnrollOnce,selectIncidentDatesInFuture,incidentDateLabel,useFirstStageDuringRegistration,completeEventsExpiryDays,displayFrontPageList,categoryCombo[id,name,categories[id,name,categoryOptions[name,id,organisationUnits[id]]]],programStages[id,name,executionDateLabel,hideDueDate,dataEntryForm[htmlCode],allowGenerateNextVisit,blockEntryForm,repeatable,formType,sortOrder,standardInterval,minDaysFromStart,generatedByEnrollmentDate,autoGenerateEvent,captureCoordinates,dueDateLabel,programStageDataElements[id,displayInReports,compulsory,allowProvidedElsewhere,allowFutureDate,dataElement[id]],programStageSections[id]],organisationUnits[id],programIndicators[id,name,description,expression],translations,attributeValues[value,attribute[name]],validationCriterias,programRuleVariables,programTrackedEntityAttributes[id,mandatory,externalAccess,allowFutureDate,displayInList,sortOrder,trackedEntityAttribute[id,name,code,name,formName,description,confidential,searchScope,translations,inherit,legendSets,optionSet[name,options[name,id,code]]unique,orgunitScope,programScope,displayInListNoProgramaggregationType,displayInListNoProgram,pattern,sortOrderInListNoProgram,generated,displayOnVisitSchedule,valueType,sortOrderInVisitSchedule]],programRules';
    const filter =
      'filter=organisationUnits.path:ilike:' +
      userOrgUnitIds.join('&filter=path:ilike:') +
      '&rootJunction=OR';
    let url = '/api/' + this.resource + '.json?paging=false&' + fields;
    +'&' + filter;
    return new Observable(observer => {
      this.HttpClient.get(url, true, currentUser).subscribe(
        (response: any) => {
          const programs = this.getFitlteredListOfPrograms(
            response[this.resource],
            currentUser
          );
          observer.next(programs);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  getFitlteredListOfPrograms(
    programsResponse: any[],
    currentUser: CurrentUser
  ) {
    let filteredPrograms = [];
    const { programs } = currentUser;
    const { authorities } = currentUser;
    if (authorities && authorities.indexOf('ALL') > -1) {
      filteredPrograms = _.concat(filteredPrograms, programsResponse);
    } else {
      programsResponse.map((programObject: any) => {
        if (
          programs &&
          programObject &&
          programObject.id &&
          programs.indexOf(programObject.id) > -1
        ) {
          filteredPrograms = _.concat(filteredPrograms, programObject);
        }
      });
    }
    return filteredPrograms;
  }

  getSanitizedPrograms(programs) {
    let sanitizedPrograms = [];
    programs.map((program: any) => {
      if (program && program.trackedEntityType) {
        program['trackedEntity'] = program.trackedEntityType;
        delete program.trackedEntityType;
      }
      sanitizedPrograms.push(program);
    });
    return sanitizedPrograms;
  }

  /**
   *
   * @param programs
   * @param currentUser
   * @returns {Observable<any>}
   */
  saveProgramsFromServer(programs, currentUser): Observable<any> {
    const sanitizedPrograms = this.getSanitizedPrograms(programs);
    return new Observable(observer => {
      if (sanitizedPrograms.length == 0) {
        observer.next();
        observer.complete();
      } else {
        const totalProcess = 9;
        let completedStage = 0;
        this.sqlLite
          .insertBulkDataOnTable(
            this.resource,
            sanitizedPrograms,
            currentUser.currentDatabase
          )
          .subscribe(
            () => {
              completedStage++;
              if (completedStage == totalProcess) {
                observer.next();
                observer.complete();
              }
            },
            error => {
              observer.error(error);
            }
          );
        this.savingProgramProgramRuleVariables(
          sanitizedPrograms,
          currentUser
        ).subscribe(
          () => {
            completedStage++;
            if (completedStage == totalProcess) {
              observer.next();
              observer.complete();
            }
          },
          error => {
            observer.error(error);
          }
        );
        this.savingProgramProgramRules(
          sanitizedPrograms,
          currentUser
        ).subscribe(
          () => {
            completedStage++;
            if (completedStage == totalProcess) {
              observer.next();
              observer.complete();
            }
          },
          error => {
            observer.error(error);
          }
        );
        this.savingProgramOrganisationUnits(
          sanitizedPrograms,
          currentUser
        ).subscribe(
          () => {
            completedStage++;
            if (completedStage == totalProcess) {
              observer.next();
              observer.complete();
            }
          },
          error => {
            observer.error(error);
          }
        );
        this.savingProgramIndicators(sanitizedPrograms, currentUser).subscribe(
          () => {
            completedStage++;
            if (completedStage == totalProcess) {
              observer.next();
              observer.complete();
            }
          },
          error => {
            observer.error(error);
          }
        );
        this.savingProgramProgramStages(
          sanitizedPrograms,
          currentUser
        ).subscribe(
          () => {
            completedStage++;
            if (completedStage == totalProcess) {
              observer.next();
              observer.complete();
            }
          },
          error => {
            observer.error(error);
          }
        );
        this.savingProgramProgramTrackedEntityAttributes(
          sanitizedPrograms,
          currentUser
        ).subscribe(
          () => {
            completedStage++;
            if (completedStage == totalProcess) {
              observer.next();
              observer.complete();
            }
          },
          error => {
            observer.error(error);
          }
        );
        this.savingTrackerRegistrationForm(
          sanitizedPrograms,
          currentUser
        ).subscribe(
          () => {
            completedStage++;
            if (completedStage == totalProcess) {
              observer.next();
              observer.complete();
            }
          },
          error => {
            observer.error(error);
          }
        );

        this.savingProgramStageEntryForm(
          sanitizedPrograms,
          currentUser
        ).subscribe(
          () => {
            completedStage++;
            if (completedStage == totalProcess) {
              observer.next();
              observer.complete();
            }
          },
          error => {
            observer.error(error);
          }
        );
      }
    });
  }

  savingTrackerRegistrationForm(programs, currentUser): Observable<any> {
    let trackerRegistrationForms = [];
    const resource = 'trackerRegistrationForm';
    programs.map((program: any) => {
      if (program && program.dataEntryForm && program.dataEntryForm.htmlCode) {
        trackerRegistrationForms.push({
          id: program.id,
          dataEntryForm: program.dataEntryForm.htmlCode
        });
      }
    });
    return new Observable(observer => {
      if (trackerRegistrationForms.length == 0) {
        observer.next();
        observer.complete();
      } else {
        this.sqlLite
          .insertBulkDataOnTable(
            resource,
            trackerRegistrationForms,
            currentUser.currentDatabase
          )
          .subscribe(
            () => {
              observer.next();
              observer.complete();
            },
            error => {
              observer.error(error);
            }
          );
      }
    });
  }

  savingProgramStageEntryForm(programs, currentUser): Observable<any> {
    const resource = 'programStageEntryForm';
    let programStageEntryForms = [];
    programs.map((program: any) => {
      if (
        program &&
        program.programStages &&
        program.programStages.length > 0
      ) {
        program.programStages.map((programStage: any) => {
          if (
            programStage &&
            programStage.dataEntryForm &&
            programStage.dataEntryForm.htmlCode
          ) {
            programStageEntryForms.push({
              id: programStage.id,
              dataEntryForm: programStage.dataEntryForm.htmlCode
            });
          }
        });
      }
    });
    return new Observable(observer => {
      if (programStageEntryForms.length == 0) {
        observer.next();
        observer.complete();
      } else {
        this.sqlLite
          .insertBulkDataOnTable(
            resource,
            programStageEntryForms,
            currentUser.currentDatabase
          )
          .subscribe(
            () => {
              observer.next();
              observer.complete();
            },
            error => {
              observer.error(error);
            }
          );
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
    const resource = 'programProgramRuleVariables';
    programs.map((program: any) => {
      if (
        program.programRuleVariables &&
        program.programRuleVariables.length > 0
      ) {
        programProgramRuleVariables = _.concat(programProgramRuleVariables, {
          id: program.id,
          programRuleVariableIds: _.map(
            program.programRuleVariables,
            (programRuleVariable: any) => {
              return programRuleVariable.id;
            }
          )
        });
      }
    });
    return new Observable(observer => {
      if (programProgramRuleVariables.length == 0) {
        observer.next();
        observer.complete();
      } else {
        this.sqlLite
          .insertBulkDataOnTable(
            resource,
            programProgramRuleVariables,
            currentUser.currentDatabase
          )
          .subscribe(
            () => {
              observer.next();
              observer.complete();
            },
            error => {
              observer.error(error);
            }
          );
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
    const resource = 'programProgramRules';
    programs.map((program: any) => {
      if (program.programRules && program.programRules.length > 0) {
        programProgramRules = _.concat(programProgramRules, {
          id: program.id,
          programRuleIds: _.map(program.programRules, (programRule: any) => {
            return programRule.id;
          })
        });
      }
    });
    return new Observable(observer => {
      if (programProgramRules.length == 0) {
        observer.next();
        observer.complete();
      } else {
        this.sqlLite
          .insertBulkDataOnTable(
            resource,
            programProgramRules,
            currentUser.currentDatabase
          )
          .subscribe(
            () => {
              observer.next();
              observer.complete();
            },
            error => {
              observer.error(error);
            }
          );
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
    const resource = 'programOrganisationUnits';
    programs.map((program: any) => {
      if (program.organisationUnits && program.organisationUnits.length > 0) {
        programOrganisationUnits = _.concat(programOrganisationUnits, {
          id: program.id,
          orgUnitIds: _.map(
            program.organisationUnits,
            (organisationUnit: any) => {
              return organisationUnit.id;
            }
          )
        });
      }
    });
    return new Observable(observer => {
      if (programOrganisationUnits.length == 0) {
        observer.next();
        observer.complete();
      } else {
        this.sqlLite
          .insertBulkDataOnTable(
            resource,
            programOrganisationUnits,
            currentUser.currentDatabase
          )
          .subscribe(
            () => {
              observer.next();
              observer.complete();
            },
            error => {
              observer.error(error);
            }
          );
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
    const resource = 'programIndicators';
    programs.map((program: any) => {
      if (program.programIndicators && program.programIndicators.length > 0) {
        programIndicators = _.concat(
          programIndicators,
          _.map(program.programIndicators, (programIndicator: any) => {
            return {
              id: program.id + '-' + programIndicator.id,
              programId: program.id,
              name: programIndicator.name,
              expression: programIndicator.expression
            };
          })
        );
      }
    });
    return new Observable(observer => {
      if (programIndicators.length == 0) {
        observer.next();
        observer.complete();
      } else {
        this.sqlLite
          .insertBulkDataOnTable(
            resource,
            programIndicators,
            currentUser.currentDatabase
          )
          .subscribe(
            () => {
              observer.next();
              observer.complete();
            },
            error => {
              observer.error(error);
            }
          );
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
    const resource = 'programProgramStages';
    programs.map((program: any) => {
      if (program.programStages && program.programStages.length > 0) {
        programProgramStages = _.concat(
          programProgramStages,
          _.map(program.programStages, (programStage: any) => {
            return {
              id: programStage.id,
              programId: program.id,
              name: programStage.name,
              executionDateLabel: programStage.executionDateLabel,
              formType: programStage.formType,
              blockEntryForm: programStage.blockEntryForm,
              hideDueDate: programStage.hideDueDate,
              repeatable: programStage.repeatable,
              allowGenerateNextVisit: programStage.allowGenerateNextVisit,
              generatedByEnrollmentDate: programStage.generatedByEnrollmentDate,
              standardInterval: programStage.standardInterval,
              minDaysFromStart: programStage.minDaysFromStart,
              autoGenerateEvent: programStage.autoGenerateEvent,
              captureCoordinates: programStage.captureCoordinates,
              dueDateLabel: programStage.dueDateLabel,
              sortOrder: programStage.sortOrder,
              programStageDataElements: programStage.programStageDataElements,
              programStageSections: programStage.programStageSections
            };
          })
        );
      }
    });
    return new Observable(observer => {
      if (programProgramStages.length == 0) {
        observer.next();
        observer.complete();
      } else {
        this.sqlLite
          .insertBulkDataOnTable(
            resource,
            programProgramStages,
            currentUser.currentDatabase
          )
          .subscribe(
            () => {
              observer.next();
              observer.complete();
            },
            error => {
              observer.error(error);
            }
          );
      }
    });
  }

  /**
   *
   * @param programs
   * @param currentUser
   * @returns {Observable<any>}
   */
  savingProgramProgramTrackedEntityAttributes(
    programs,
    currentUser
  ): Observable<any> {
    let programTrackedEntityAttributes = [];
    let trackedEntityAttributes = [];
    const resource = 'programTrackedEntityAttributes';
    programs.map((program: any) => {
      if (
        program.programTrackedEntityAttributes &&
        program.programTrackedEntityAttributes.length > 0
      ) {
        program.programTrackedEntityAttributes.map(
          (programTrackedEntityAttribute: any) => {
            programTrackedEntityAttributes.push({
              id: program.id + '-' + programTrackedEntityAttribute.id,
              programId: program.id,
              sortOrder: programTrackedEntityAttribute.sortOrder,
              mandatory: programTrackedEntityAttribute.mandatory,
              displayInList: programTrackedEntityAttribute.displayInList,
              externalAccess: programTrackedEntityAttribute.externalAccess
            });
            if (
              programTrackedEntityAttribute.trackedEntityAttribute &&
              programTrackedEntityAttribute.trackedEntityAttribute.id
            ) {
              trackedEntityAttributes.push({
                id:
                  programTrackedEntityAttribute.id +
                  programTrackedEntityAttribute.trackedEntityAttribute.id,
                programTrackedEntityAttributeId:
                  programTrackedEntityAttribute.id,
                trackedEntityAttribute:
                  programTrackedEntityAttribute.trackedEntityAttribute
              });
            }
          }
        );
      }
    });
    return new Observable(observer => {
      if (programTrackedEntityAttributes.length == 0) {
        this.savingTrackedEntityAttributes(
          trackedEntityAttributes,
          currentUser
        ).subscribe(
          () => {
            observer.next();
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
      } else {
        this.sqlLite
          .insertBulkDataOnTable(
            resource,
            programTrackedEntityAttributes,
            currentUser.currentDatabase
          )
          .subscribe(
            () => {
              this.savingTrackedEntityAttributes(
                trackedEntityAttributes,
                currentUser
              ).subscribe(
                () => {
                  observer.next();
                  observer.complete();
                },
                error => {
                  observer.error(error);
                }
              );
            },
            error => {
              observer.error(error);
            }
          );
      }
    });
  }

  /**
   *
   * @param trackedEntityAttributes
   * @param currentUser
   * @returns {Observable<any>}
   */
  savingTrackedEntityAttributes(
    trackedEntityAttributes,
    currentUser
  ): Observable<any> {
    const resource = 'trackedEntityAttribute';
    return new Observable(observer => {
      if (trackedEntityAttributes.length == 0) {
        observer.next();
        observer.complete();
      } else {
        this.sqlLite
          .insertBulkDataOnTable(
            resource,
            trackedEntityAttributes,
            currentUser.currentDatabase
          )
          .subscribe(
            () => {
              observer.next();
              observer.complete();
            },
            error => {
              observer.error(error);
            }
          );
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
  getProgramsAssignedOnOrgUnitAndUserRoles(
    orgUnitId,
    programType,
    programIdsByUserRoles,
    currentUser
  ): Observable<any> {
    let attributeKey = 'id';
    let attributeArray = [];
    let programs = [];
    return new Observable(observer => {
      this.getProgramIdsByOrganisationUnit(
        orgUnitId,
        currentUser.currentDatabase
      ).subscribe(
        (programIds: any) => {
          if (
            currentUser.authorities &&
            currentUser.authorities.indexOf('ALL') > -1
          ) {
            attributeArray = programIds;
          } else {
            programIds.forEach((programId: string) => {
              if (programIdsByUserRoles.indexOf(programId) > -1) {
                attributeArray.push(programId);
              }
            });
          }
          this.sqlLite
            .getDataFromTableByAttributes(
              this.resource,
              attributeKey,
              attributeArray,
              currentUser.currentDatabase
            )
            .subscribe(
              (programsResponse: any) => {
                if (programsResponse && programsResponse.length > 0) {
                  programsResponse = this.getSortedPrograms(programsResponse);
                  let hasProgramSelected = false;
                  programsResponse.map((program: any) => {
                    if (
                      program.programType &&
                      program.programType == programType
                    ) {
                      if (program.displayIncidentDate) {
                        program.displayIncidentDate = JSON.parse(
                          program.displayIncidentDate
                        );
                      }
                      program.withoutRegistration = JSON.parse(
                        program.withoutRegistration
                      );
                      program.captureCoordinates = JSON.parse(
                        program.captureCoordinates
                      );
                      programs.push(program);
                      if (
                        this.lastSelectedProgram &&
                        this.lastSelectedProgram.id
                      ) {
                        if (this.lastSelectedProgram.id == program.id) {
                          hasProgramSelected = true;
                        }
                      }
                    }
                  });
                  if (programs.length > 0) {
                    if (!hasProgramSelected) {
                      this.setLastSelectedProgram(programs[0]);
                    }
                  } else {
                    this.lastSelectedProgram = null;
                  }
                } else {
                  this.lastSelectedProgram = null;
                }
                observer.next(programs);
                observer.complete();
              },
              error => {
                observer.error(error);
              }
            );
        },
        error => {
          observer.error(error);
        }
      );
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
    categories.map((category: any) => {
      let categoryOptions = [];
      category.categoryOptions.map((categoryOption: any) => {
        if (this.isOrganisationUnitAllowed(selectedOrgUnitId, categoryOption)) {
          categoryOptions.push({
            id: categoryOption.id,
            name: categoryOption.name
          });
        }
      });
      categoryComboCategories.push({
        id: category.id,
        name: category.name,
        categoryOptions: categoryOptions
      });
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
    if (
      categoryOption.organisationUnits &&
      categoryOption.organisationUnits.length > 0
    ) {
      result = false;
      const matchedOus = _.filter(categoryOption.organisationUnits, {
        id: selectedOrgUnitId
      });
      if (matchedOus.length > 0) {
        result = true;
      }
    }
    return result;
  }

  /**
   *
   * @param programs
   * @returns {any}
   */
  getSortedPrograms(programs) {
    return _.sortBy(programs, ['name']);
  }

  /**
   *
   * @param orgUnitId
   * @param dataBaseName
   * @returns {Observable<any>}
   */
  getProgramIdsByOrganisationUnit(orgUnitId, dataBaseName): Observable<any> {
    const resource = 'programOrganisationUnits';
    let programIdsByOrganisationUnit = [];
    return new Observable(observer => {
      this.sqlLite.getAllDataFromTable(resource, dataBaseName).subscribe(
        (programIdsByOrganisationUnitResponse: any) => {
          if (
            programIdsByOrganisationUnitResponse &&
            programIdsByOrganisationUnitResponse.length > 0
          ) {
            programIdsByOrganisationUnitResponse.map((response: any) => {
              if (
                response.id &&
                response.orgUnitIds &&
                response.orgUnitIds.indexOf(orgUnitId) > -1
              ) {
                if (programIdsByOrganisationUnit.indexOf(response.id) == -1) {
                  programIdsByOrganisationUnit.push(response.id);
                }
              }
            });
          }
          observer.next(programIdsByOrganisationUnit);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  getProgramOrganisationUnitsByProgramType(
    currentUser: CurrentUser,
    programType
  ): Observable<any> {
    const resource = 'programOrganisationUnits';
    return new Observable(observer => {
      const query =
        'SELECT * FROM programOrganisationUnits WHERE id IN (SELECT id FROM programs WHERE programType = ' +
        "'" +
        programType +
        "');";
      this.sqlLite
        .getByUsingQuery(query, resource, currentUser.currentDatabase)
        .subscribe(
          programOrganisationUnits => {
            observer.next(programOrganisationUnits);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
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
      this.sqlLite
        .getDataFromTableByAttributes(
          this.resource,
          attribute,
          attributeValue,
          currentUser.currentDatabase
        )
        .subscribe(
          (programs: any) => {
            if (programs.length > 0) {
              let program = programs[0];
              if (program.displayIncidentDate) {
                program.displayIncidentDate = JSON.parse(
                  program.displayIncidentDate
                );
              }
              program.withoutRegistration = JSON.parse(
                program.withoutRegistration
              );
              program.captureCoordinates = JSON.parse(
                program.captureCoordinates
              );
              observer.next(program);
            } else {
              observer.next({});
            }
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  getAllPrograms(currentUser: CurrentUser): Observable<any> {
    return new Observable(observer => {
      this.sqlLite
        .getAllDataFromTable(this.resource, currentUser.currentDatabase)
        .subscribe(
          (programs: any) => {
            observer.next(programs);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  /**
   *
   * @param programId
   * @param currentUser
   * @returns {Observable<any>}
   */
  getProgramsStages(programId, currentUser): Observable<any> {
    const resource = 'programProgramStages';
    const attribute = 'programId';
    const attributeValue = [programId];
    return new Observable(observer => {
      this.sqlLite
        .getDataFromTableByAttributes(
          resource,
          attribute,
          attributeValue,
          currentUser.currentDatabase
        )
        .subscribe(
          (programProgramStages: any) => {
            observer.next(programProgramStages);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  /**
   *
   * @param programId
   * @param dataBaseName
   * @returns {Observable<any>}
   */
  getOrganisationUnitsinPrograms(programId, dataBaseName): Observable<any> {
    const resource = 'programOrganisationUnits';
    let attributeValue = [programId];
    let attributeKey = 'programId';
    return new Observable(observer => {
      this.sqlLite
        .getDataFromTableByAttributes(
          resource,
          attributeKey,
          attributeValue,
          dataBaseName
        )
        .subscribe(
          (orgUnitsInProgram: any) => {
            observer.next(orgUnitsInProgram);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  /**
   *
   * @param programId
   * @param dataBaseName
   * @returns {Observable<any>}
   */
  getProgramRuleIds(programId, dataBaseName): Observable<any> {
    const resource = 'programProgramRules';
    const attributeValue = [programId];
    const attributeKey = 'id';
    let programRuleIds = [];
    return new Observable(observer => {
      this.sqlLite
        .getDataFromTableByAttributes(
          resource,
          attributeKey,
          attributeValue,
          dataBaseName
        )
        .subscribe(
          (programRuleIdsResponse: any) => {
            if (programRuleIdsResponse && programRuleIdsResponse.length > 0) {
              programRuleIds = programRuleIdsResponse[0].programRuleIds;
            }
            observer.next(programRuleIds);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  /**
   *
   * @param programId
   * @param dataBaseName
   * @returns {Observable<any>}
   */
  getProgramRulesVariablesIds(programId, dataBaseName): Observable<any> {
    const resource = 'programProgramRuleVariables';
    const attributeValue = [programId];
    const attributeKey = 'id';
    let programRulesVariablesIds = [];
    return new Observable(observer => {
      this.sqlLite
        .getDataFromTableByAttributes(
          resource,
          attributeKey,
          attributeValue,
          dataBaseName
        )
        .subscribe(
          (programRulesVariablesIdsResponse: any) => {
            if (
              programRulesVariablesIdsResponse &&
              programRulesVariablesIdsResponse.length > 0
            ) {
              programRulesVariablesIds =
                programRulesVariablesIdsResponse[0].programRuleVariableIds;
            }
            observer.next(programRulesVariablesIds);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  /**
   *
   * @param programId
   * @param dataBaseName
   * @returns {Observable<any>}
   */
  getProgramIndicators(programId, dataBaseName): Observable<any> {
    const resource = 'programIndicators';
    let attributeValue = [programId];
    let attributeKey = 'programId';
    return new Observable(observer => {
      this.sqlLite
        .getDataFromTableByAttributes(
          resource,
          attributeKey,
          attributeValue,
          dataBaseName
        )
        .subscribe(
          (orgUnitsInProgram: any) => {
            observer.next(orgUnitsInProgram);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  /**
   *
   * @param programId
   * @param currentUser
   * @returns {Observable<any>}
   */
  getProgramProgramTrackedEntityAttributes(
    programId,
    currentUser
  ): Observable<any> {
    let attributeKey = 'programId';
    let attributeArray = [programId];
    const resource = 'programTrackedEntityAttributes';
    return new Observable(observer => {
      this.sqlLite
        .getDataFromTableByAttributes(
          resource,
          attributeKey,
          attributeArray,
          currentUser.currentDatabase
        )
        .subscribe(
          (programTrackedEntityAttributes: any) => {
            observer.next(programTrackedEntityAttributes);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  /**
   *
   * @param programTrackedEntityAttributeIds
   * @param currentUser
   * @returns {Observable<any>}
   */
  getTrackedEntityAttributes(
    programTrackedEntityAttributeIds,
    currentUser
  ): Observable<any> {
    let attributeKey = 'programTrackedEntityAttributeId';
    const resource = 'trackedEntityAttribute';
    return new Observable(observer => {
      this.sqlLite
        .getDataFromTableByAttributes(
          resource,
          attributeKey,
          programTrackedEntityAttributeIds,
          currentUser.currentDatabase
        )
        .subscribe(
          (trackedEntityAttributes: any) => {
            observer.next(trackedEntityAttributes);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  getTrackerRegistrationForm(
    programId: string,
    currentUser: CurrentUser
  ): Observable<any> {
    return new Observable(observer => {
      const resource = 'trackerRegistrationForm';
      this.sqlLite
        .getDataFromTableByAttributes(
          resource,
          'id',
          [programId],
          currentUser.currentDatabase
        )
        .subscribe(
          data => {
            const response =
              data && data.length > 0 ? data[0].dataEntryForm : '';
            observer.next(response);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  getProgramStageEntryForm(
    programStageId: string,
    currentUser: CurrentUser
  ): Observable<any> {
    return new Observable(observer => {
      const resource = 'programStageEntryForm';
      this.sqlLite
        .getDataFromTableByAttributes(
          resource,
          'id',
          [programStageId],
          currentUser.currentDatabase
        )
        .subscribe(
          data => {
            const response =
              data && data.length > 0 ? data[0].dataEntryForm : '';
            observer.next(response);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  getProgramStageEntryFormByIds(
    programStageIds: Array<string>,
    currentUser: CurrentUser
  ): Observable<any> {
    return new Observable(observer => {
      const resource = 'programStageEntryForm';
      this.sqlLite
        .getDataFromTableByAttributes(
          resource,
          'id',
          programStageIds,
          currentUser.currentDatabase
        )
        .subscribe(
          data => {
            observer.next(data);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }
}
