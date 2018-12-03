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
import { ProgramsProvider } from '../programs/programs';
import { DataElementsProvider } from '../data-elements/data-elements';
import { SqlLiteProvider } from '../sql-lite/sql-lite';
import { HttpClientProvider } from '../http-client/http-client';
import { ProgramStageSectionsProvider } from '../program-stage-sections/program-stage-sections';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import * as moment from 'moment';
import { EnrollmentsProvider } from '../enrollments/enrollments';
import { CurrentUser } from '../../models/current-user';
import { ProgramRulesProvider } from '../program-rules/program-rules';

declare var dhis2: any;

/*
  Generated class for the EventCaptureFormProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class EventCaptureFormProvider {
  constructor(
    private programsProvider: ProgramsProvider,
    private sqlLiteProvider: SqlLiteProvider,
    private httpClientProvider: HttpClientProvider,
    private programStageSectionsProvider: ProgramStageSectionsProvider,
    private dataElementProvider: DataElementsProvider,
    private enrollmentsProvider: EnrollmentsProvider,
    private programRulesProvider: ProgramRulesProvider
  ) {}

  getEventDueDate(
    currentEvents,
    programStage,
    trackedEntityInstance,
    organisationUnitId,
    programId,
    currentUser
  ): Observable<any> {
    return new Observable(observer => {
      this.enrollmentsProvider
        .getSavedEnrollmentsByAttribute(
          'trackedEntityInstance',
          [trackedEntityInstance],
          currentUser
        )
        .subscribe(
          enrollments => {
            const matchedEnrollment: any = _.find(enrollments, {
              orgUnit: organisationUnitId,
              program: programId
            });
            let dueDate = moment(new Date()).format('YYYY-MM-DD');
            if (matchedEnrollment) {
              console.log(
                'is valid' + this.isValidDate(matchedEnrollment.incidentDate)
              );
              let referenceDate = this.isValidDate(
                matchedEnrollment.incidentDate
              )
                ? matchedEnrollment.incidentDate
                : matchedEnrollment.enrollmentDate;
              let offset = programStage.minDaysFromStart;

              if (programStage.generatedByEnrollmentDate) {
                referenceDate = matchedEnrollment.enrollmentDate;
              }
              if (programStage.repeatable) {
                if (currentEvents.length > 0) {
                  currentEvents = _.reverse(
                    _.sortBy(currentEvents, ['eventDate'])
                  );
                  referenceDate = currentEvents[0].eventDate;
                  if (programStage.standardInterval) {
                    offset = programStage.standardInterval;
                  }
                }
              }
              dueDate = moment(referenceDate)
                .add(offset, 'days')
                .format('YYYY-MM-DD');
            }
            observer.next(dueDate);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  isValidDate(str) {
    var d = moment(str, 'YYYY-MM-DD');
    if (d == null || !d.isValid()) return false;

    return (
      str.indexOf(d.format('YYYY-MM-DD')) >= 0 ||
      str.indexOf(d.format('D/M/YYYY')) >= 0 ||
      str.indexOf(d.format('DD/MM/YYYY')) >= 0 ||
      str.indexOf(d.format('D/M/YY')) >= 0 ||
      str.indexOf(d.format('DD/MM/YY')) >= 0
    );
  }

  getProgramSkipLogicMetadata(
    programId,
    currentUser: CurrentUser
  ): Observable<any> {
    return new Observable(observer => {
      let programRuleActionIds = [];
      this.programsProvider
        .getProgramRuleIds(programId, currentUser.currentDatabase)
        .subscribe(
          programRuleIds => {
            this.programRulesProvider
              .getgProgramRulesByIds(programRuleIds, currentUser)
              .subscribe(
                programRules => {
                  _.map(programRules, programRule => {
                    if (programRule && programRule.programRuleActions) {
                      _.map(
                        programRule.programRuleActions,
                        programRuleAction => {
                          if (programRuleAction && programRuleAction.id) {
                            programRuleActionIds.push(programRuleAction.id);
                          }
                        }
                      );
                    }
                  });
                  this.programRulesProvider
                    .getProgramRuleActionsByIds(
                      programRuleActionIds,
                      currentUser
                    )
                    .subscribe(
                      programRuleActions => {
                        this.programsProvider
                          .getProgramRulesVariablesIds(
                            programId,
                            currentUser.currentDatabase
                          )
                          .subscribe(
                            programRulesVariablesIds => {
                              this.programRulesProvider
                                .getProgramRuleVariableByIds(
                                  programRulesVariablesIds,
                                  currentUser
                                )
                                .subscribe(
                                  programRulesVariables => {
                                    observer.next({
                                      programRules: programRules,
                                      programRuleActions: programRuleActions,
                                      programRulesVariables: programRulesVariables
                                    });
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
  getProgramStages(programId, currentUser): Observable<any> {
    let dataElementIds = [];
    let programStageSectionIds = [];
    return new Observable(observer => {
      this.programsProvider.getProgramsStages(programId, currentUser).subscribe(
        (programsStages: any) => {
          if (programsStages.length == 0) {
            observer.next(programsStages);
            observer.complete();
          } else {
            //prepare data elements ids as well as program stage sections ids if any
            programsStages.map((programsStage: any) => {
              if (programsStage.programStageSections) {
                programsStage.programStageSections.map(
                  (programStageSection: any) => {
                    programStageSectionIds.push(programStageSection.id);
                  }
                );
              }
              programsStage.programStageDataElements.map(
                programStageDataElement => {
                  if (
                    programStageDataElement.dataElement &&
                    programStageDataElement.dataElement.id
                  ) {
                    dataElementIds.push(programStageDataElement.dataElement.id);
                  }
                }
              );
            });
            //loading data elements by ids
            this.dataElementProvider
              .getDataElementsByIdsForEvents(dataElementIds, currentUser)
              .subscribe(
                (dataElements: any) => {
                  programsStages.forEach((programsStage: any) => {
                    programsStage.hideDueDate = JSON.parse(
                      programsStage.hideDueDate
                    );
                    programsStage.repeatable = JSON.parse(
                      programsStage.repeatable
                    );
                    programsStage.allowGenerateNextVisit = JSON.parse(
                      programsStage.allowGenerateNextVisit
                    );
                    programsStage.autoGenerateEvent = JSON.parse(
                      programsStage.autoGenerateEvent
                    );
                    programsStage.blockEntryForm = JSON.parse(
                      programsStage.blockEntryForm
                    );
                    programsStage.generatedByEnrollmentDate = JSON.parse(
                      programsStage.generatedByEnrollmentDate
                    );
                    programsStage.captureCoordinates = JSON.parse(
                      programsStage.captureCoordinates
                    );
                    programsStage.programStageDataElements.forEach(
                      programStageDataElement => {
                        if (
                          programStageDataElement.dataElement &&
                          programStageDataElement.dataElement.id
                        ) {
                          const dataElementId =
                            programStageDataElement.dataElement.id;
                          const matchedDataElement: any = _.find(dataElements, {
                            id: dataElementId
                          });
                          if (
                            dataElementId &&
                            matchedDataElement &&
                            matchedDataElement.id
                          ) {
                            delete programStageDataElement.dataElement;
                            programStageDataElement[
                              'dataElement'
                            ] = matchedDataElement;
                          }
                        }
                      }
                    );
                  });
                  //loading programStageSections
                  this.programStageSectionsProvider
                    .getProgramStageSectionsByIds(
                      programStageSectionIds,
                      currentUser
                    )
                    .subscribe((programStageSections: any) => {
                      if (
                        programStageSections &&
                        programStageSections.length > 0
                      ) {
                        programStageSections.forEach(
                          (programStageSection: any) => {
                            let newDataElements = [];
                            programStageSection.dataElements.forEach(
                              (dataElement: any) => {
                                const dataElementId = dataElement.id;
                                const matchedDataElement: any = _.find(
                                  dataElements,
                                  {
                                    id: dataElementId
                                  }
                                );
                                if (
                                  dataElementId &&
                                  matchedDataElement &&
                                  matchedDataElement.id
                                ) {
                                  newDataElements = _.concat(
                                    newDataElements,
                                    matchedDataElement
                                  );
                                }
                              }
                            );
                            delete programStageSection.dataElements;
                            programStageSection[
                              'dataElements'
                            ] = newDataElements;
                          }
                        );
                      }
                      programsStages = _.sortBy(programsStages, ['sortOrder']);
                      //merge back program sections
                      programsStages.forEach((programsStage: any) => {
                        if (
                          programsStage.programStageSections &&
                          programsStage.programStageSections.length > 0
                        ) {
                          let newProgramStageSections = [];
                          programsStage.programStageSections.forEach(
                            (programStageSection: any) => {
                              const sectionId = programStageSection.id;
                              const matchedSection: any = _.find(
                                programStageSections,
                                { id: sectionId }
                              );
                              if (matchedSection && matchedSection.id) {
                                newProgramStageSections = _.concat(
                                  newProgramStageSections,
                                  matchedSection
                                );
                              }
                            }
                          );
                          programStageSections = _.sortBy(
                            programStageSections,
                            ['sortOrder']
                          );
                          delete programsStage.programStageSections;
                          programsStage[
                            'programStageSections'
                          ] = programStageSections;
                        }
                      });

                      //loading avialable designs
                      const programStageIds = programsStages.map(
                        programStage => programStage.id
                      );
                      this.programsProvider
                        .getProgramStageEntryFormByIds(
                          programStageIds,
                          currentUser
                        )
                        .subscribe(
                          (programStageEntryForms: any) => {
                            programsStages.forEach((programStage: any) => {
                              const programStageEntryForm: any = _.find(
                                programStageEntryForms,
                                { id: programStage.id }
                              );
                              programStage['dataEntryForm'] =
                                programStageEntryForm &&
                                programStageEntryForm.dataEntryForm
                                  ? programStageEntryForm.dataEntryForm
                                  : '';
                            });
                            observer.next(programsStages);
                            observer.complete();
                          },
                          error => {
                            observer.error(error);
                          }
                        );
                    });
                },
                error => {
                  observer.error(error);
                }
              );
          }
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  /**
   *
   * @param attribute
   * @param attributeValue
   * @param currentUser
   * @returns {Observable<any>}
   */
  deleteEventByAttribute(
    attribute,
    attributeValue,
    currentUser
  ): Observable<any> {
    let resource = 'events';
    return new Observable(observer => {
      this.sqlLiteProvider
        .deleteFromTableByAttribute(
          resource,
          attribute,
          attributeValue,
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
    });
  }

  /**
   *
   * @param currentUser
   * @returns {Observable<any>}
   */
  deleteALLEvents(currentUser): Observable<any> {
    return new Observable(observer => {
      this.sqlLiteProvider
        .dropTable('events', currentUser.currentDatabase)
        .subscribe(
          () => {
            observer.next();
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
   * @param columnsToDisplay
   * @param events
   * @param eventType
   * @returns {Observable<any>}
   */
  getTableFormatResult(columnsToDisplay, events, eventType?): Observable<any> {
    let table = { headers: [], rows: [] };
    let eventIds = this.getMapperObjectForDisplay(events).eventIds;
    let eventDataValuesArrays = this.getMapperObjectForDisplay(events)
      .eventsMapper;
    if (events && events.length > 0) {
      Object.keys(columnsToDisplay).map(key => {
        table.headers.push(columnsToDisplay[key]);
      });
      eventDataValuesArrays.map((eventDataValues: any) => {
        let row = [];
        Object.keys(columnsToDisplay).map(key => {
          if (!this.isEmpty(eventDataValues[key])) {
            row.push(eventDataValues[key]);
          } else {
            row.push('');
          }
        });
        table.rows.push(row);
      });
    } else if (!eventType) {
      Object.keys(columnsToDisplay).map(key => {
        table.headers.push(columnsToDisplay[key]);
      });
    }
    return new Observable(observer => {
      observer.next({ table: table, eventIds: eventIds });
      observer.complete();
    });
  }

  isEmpty(value) {
    return value === undefined || value === null;
  }

  /**
   *
   * @param events
   * @returns {{eventsMapper: Array; eventIds: Array}}
   */
  getMapperObjectForDisplay(events) {
    let eventIds = [];
    let eventsMapper = [];
    events.map((event: any) => {
      let mapper = {};
      if (event && event.dataValues) {
        const { eventDate } = event;
        mapper['eventDate'] = eventDate;
        event.dataValues.map((dataValue: any) => {
          mapper[dataValue.dataElement] = dataValue.value;
        });
      }
      eventsMapper.push(mapper);
      eventIds.push(event.id);
    });
    return { eventsMapper: eventsMapper, eventIds: eventIds };
  }

  /**
   *
   * @param currentProgram
   * @param currentOrgUnit
   * @param programStageId
   * @param attributeCategoryOptions
   * @param attributeCc
   * @param eventType
   * @returns {{id; program; programName; programStage: any; orgUnit; orgUnitName; status: string; deleted: boolean; attributeCategoryOptions: any; attributeCc: any; eventType: any; syncStatus: string; coordinate: {latitude: number; longitude: number}; dataValues: Array}}
   */
  getEmptyEvent(
    currentProgram,
    currentOrgUnit,
    programStageId,
    attributeCategoryOptions,
    attributeCc,
    eventType
  ) {
    const uid = dhis2.util.uid();
    const event = {
      id: uid,
      program: currentProgram.id,
      programName: currentProgram.name,
      programStage: programStageId,
      orgUnit: currentOrgUnit.id,
      orgUnitName: currentOrgUnit.name,
      status: 'ACTIVE',
      deleted: false,
      attributeCategoryOptions: attributeCategoryOptions,
      attributeCc: attributeCc,
      eventType: eventType,
      syncStatus: 'not-synced',
      coordinate: {
        latitude: '0',
        longitude: '0'
      },
      dataValues: []
    };
    return event;
  }

  getEventUid() {
    return dhis2.util.uid();
  }

  /**
   *
   * @param currentUser
   * @returns {Observable<any>}
   */
  getAllEvents(currentUser): Observable<any> {
    return new Observable(observer => {
      this.sqlLiteProvider
        .getAllDataFromTable('events', currentUser.currentDatabase)
        .subscribe(
          (events: any) => {
            observer.next(events);
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
   * @param {string} attribute
   * @param {Array<string>} attributeValues
   * @param currentUser
   * @returns {Observable<any>}
   */
  getEventsByAttribute(
    attribute: string,
    attributeValues: Array<string>,
    currentUser
  ): Observable<any[]> {
    let tableName = 'events';
    return new Observable(observer => {
      this.sqlLiteProvider
        .getDataFromTableByAttributes(
          tableName,
          attribute,
          attributeValues,
          currentUser.currentDatabase
        )
        .subscribe(
          (events: any) => {
            observer.next(events);
            observer.complete();
          },
          error => {
            observer.error({ message: error });
          }
        );
    });
  }

  /**
   *
   * @param currentUser
   * @param programStageId
   * @param trackedEntityInstance
   * @param dataDimension
   * @returns {Observable<any>}
   */
  getEventsForProgramStage(
    currentUser,
    programStageId,
    trackedEntityInstance,
    dataDimension?
  ): Observable<any> {
    let attribute = 'programStage';
    let attributeValues = [programStageId];
    let events = [];
    //@todo based on data dimension
    return new Observable(observer => {
      this.getEventsByAttribute(
        attribute,
        attributeValues,
        currentUser
      ).subscribe(
        (eventResponse: any) => {
          eventResponse.map((event: any) => {
            if (event.trackedEntityInstance == trackedEntityInstance) {
              events.push(event);
            }
          });
          events = _.sortBy(events, ['eventDate']);
          observer.next(events);
          observer.complete();
        },
        error => {
          observer.error(events);
        }
      );
    });
  }

  /**
   *
   * @param currentUser
   * @param dataDimension
   * @param programId
   * @param orgUnitId
   * @returns {Observable<any>}
   */
  getEventsBasedOnEventsSelection(
    currentUser,
    dataDimension,
    programId,
    orgUnitId
  ): Observable<any> {
    let attribute = 'program';
    let attributeValues = [programId];
    let events = [];
    return new Observable(observer => {
      this.getEventsByAttribute(
        attribute,
        attributeValues,
        currentUser
      ).subscribe(
        (eventResponse: any) => {
          eventResponse.map((event: any) => {
            if (
              event.orgUnit == orgUnitId &&
              event.attributeCc == dataDimension.attributeCc &&
              (event.attributeCategoryOptions == dataDimension.attributeCos ||
                dataDimension.attributeCos == '')
            ) {
              events.push(event);
            }
          });
          observer.next(events);
          observer.complete();
        },
        error => {
          observer.error(events);
        }
      );
    });
  }

  /**
   *
   * @param events
   * @param currentUser
   * @returns {Observable<any>}
   */
  saveEvents(events, currentUser): Observable<any> {
    let tableName = 'events';
    return new Observable(observer => {
      this.sqlLiteProvider
        .insertBulkDataOnTable(tableName, events, currentUser.currentDatabase)
        .subscribe(
          () => {
            observer.next();
            observer.complete();
          },
          error => {
            observer.error({ message: error });
          }
        );
    });
  }

  discoveringEventsFromServer(
    programId: string,
    programName: string,
    organisationUnitId: string,
    dataDimension: any,
    eventType: string,
    currentUser: CurrentUser
  ): Observable<any> {
    // @todo page size to be contolled
    const { attributeCc, attributeCos } = dataDimension;
    let url = `/api/events.json?program=${programId}&orgUnit=${organisationUnitId}&pageSize=50&order=lastUpdated:desc`;
    if (attributeCc && attributeCos && attributeCos !== '') {
      url += `&attributeCc=${attributeCc}&attributeCos=${attributeCos}`;
    }
    return new Observable(observer => {
      this.httpClientProvider.get(url, true, currentUser).subscribe(
        response => {
          const events = _.map(response.events, event => {
            return {
              ...event,
              eventType,
              attributeCc,
              programName,
              attributeCategoryOptions: attributeCos,
              id: event.event,
              syncStatus: 'synced'
            };
          });
          observer.next(events);
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
   * @param events
   * @param currentUser
   * @returns {Observable<any>}
   */
  uploadEventsToSever(events, currentUser): Observable<any> {
    return new Observable(observer => {
      let url = '/api/events';
      let success = 0,
        fail = 0;
      let updatedEventIds = [];
      let errorMessages = [];
      events = this.getFormattedEventsForUpload(events);
      if (events.length == 0) {
        observer.next({
          success: success,
          fail: fail,
          errorMessages: errorMessages
        });
        observer.complete();
      } else {
        events.map((event: any) => {
          this.httpClientProvider.post(url, event, currentUser).subscribe(
            () => {
              updatedEventIds.push(event.event);
              success++;
              if (success + fail == events.length) {
                this.updateEventStatus(
                  updatedEventIds,
                  'synced',
                  currentUser
                ).subscribe(
                  () => {
                    observer.next({
                      success: success,
                      fail: fail,
                      errorMessages: errorMessages
                    });
                    observer.complete();
                  },
                  error => {
                    observer.error(error);
                  }
                );
              }
            },
            (error: any) => {
              //try to update event
              console.log('error posting : ' + JSON.stringify(error));
              url = url + '/' + event.event;
              this.httpClientProvider.put(url, event, currentUser).subscribe(
                () => {
                  updatedEventIds.push(event.event);
                  success++;
                  if (success + fail == events.length) {
                    this.updateEventStatus(
                      updatedEventIds,
                      'synced',
                      currentUser
                    ).subscribe(
                      () => {
                        observer.next({
                          success: success,
                          fail: fail,
                          errorMessages: errorMessages
                        });
                        observer.complete();
                      },
                      error => {
                        observer.error(error);
                      }
                    );
                  }
                },
                (error: any) => {
                  fail++;
                  if (
                    error &&
                    error.response &&
                    error.response.importSummaries &&
                    error.response.importSummaries.length > 0 &&
                    error.response.importSummaries[0].description
                  ) {
                    let message = error.response.importSummaries[0].description;
                    if (errorMessages.indexOf(message) == -1) {
                      errorMessages.push(message);
                    }
                  } else if (
                    error &&
                    error.response &&
                    error.response.conflicts
                  ) {
                    error.response.conflicts.map((conflict: any) => {
                      let message = JSON.stringify(conflict);
                      if (errorMessages.indexOf(message) == -1) {
                        errorMessages.push(message);
                      }
                    });
                  } else if (error && error.httpStatusCode == 500) {
                    let message = error.message;
                    if (errorMessages.indexOf(message) == -1) {
                      errorMessages.push(message);
                    }
                  } else if (
                    error &&
                    error.response &&
                    error.response.description
                  ) {
                    let message = error.response.description;
                    if (errorMessages.indexOf(message) == -1) {
                      errorMessages.push(message);
                    }
                  } else {
                    let message = JSON.stringify(error);
                    if (errorMessages.indexOf(message) == -1) {
                      errorMessages.push(message);
                    }
                  }
                  if (success + fail == events.length) {
                    this.updateEventStatus(
                      updatedEventIds,
                      'synced',
                      currentUser
                    ).subscribe(
                      () => {
                        observer.next({
                          success: success,
                          fail: fail,
                          errorMessages: errorMessages
                        });
                        observer.complete();
                      },
                      error => {
                        observer.error(error);
                      }
                    );
                  }
                }
              );
            }
          );
        });
      }
    });
  }

  /**
   *
   * @param eventIds
   * @param status
   * @param currentUser
   * @returns {Observable<any>}
   */
  updateEventStatus(eventIds, status, currentUser): Observable<any> {
    return new Observable(observer => {
      this.getEventsByAttribute('id', eventIds, currentUser).subscribe(
        (events: any) => {
          if (events && events.length > 0) {
            events.map((event: any) => {
              event.syncStatus = status;
            });
            this.saveEvents(events, currentUser).subscribe(
              () => {
                observer.next();
                observer.complete();
              },
              error => {
                observer.error({ message: error });
              }
            );
          } else {
            observer.next();
            observer.complete();
          }
        },
        error => {
          observer.error({ message: error });
        }
      );
    });
  }

  /**
   *
   * @param events
   * @returns {any}
   */
  getFormattedEventsForUpload(events) {
    events.map((event: any) => {
      event.event = event.id;
      delete event.id;
      delete event.programName;
      delete event.orgUnitName;
      delete event.attributeCc;
      delete event.eventType;
      delete event.notes;
      delete event.syncStatus;
      //it depends on dhis versions
      delete event.deleted;
      if (event.completedDate == '0') {
        delete event.completedDate;
      }
      if (event.trackedEntityInstance == '0') {
        delete event.trackedEntityInstance;
      }
      if (event.attributeCategoryOptions == '0') {
        delete event.attributeCategoryOptions;
      }
    });
    return events;
  }

  /**
   *
   * @param status
   * @param eventType
   * @param currentUser
   * @returns {Observable<any>}
   */
  getEventsByStatusAndType(status, eventType, currentUser): Observable<any> {
    let attribute = 'syncStatus';
    let attributeArray = [status];
    let eventResults = [];
    return new Observable(observer => {
      this.getEventsByAttribute(
        attribute,
        attributeArray,
        currentUser
      ).subscribe(
        (events: any) => {
          events.map((event: any) => {
            if (event.eventType == eventType) {
              eventResults.push(event);
            }
          });
          observer.next(eventResults);
          observer.complete();
        },
        error => {
          observer.error({ message: error });
        }
      );
    });
  }
}
