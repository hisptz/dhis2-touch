import { Injectable } from '@angular/core';
import { ProgramsProvider } from '../programs/programs';
import { DataElementsProvider } from '../data-elements/data-elements';
import { SqlLiteProvider } from '../sql-lite/sql-lite';
import { HttpClientProvider } from '../http-client/http-client';
import { ProgramStageSectionsProvider } from '../program-stage-sections/program-stage-sections';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

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
    private dataElementProvider: DataElementsProvider
  ) {}

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
                          const matchedDataElement = _.find(dataElements, {
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
                                const matchedDataElement = _.find(
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
                              const matchedSection = _.find(
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
                      observer.next(programsStages);
                      observer.complete();
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
          if (eventDataValues[key]) {
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
    let event = {
      id: dhis2.util.uid(),
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
        latitude: 0,
        longitude: 0
      },
      dataValues: []
    };
    return event;
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
  ): Observable<any> {
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
              event.attributeCategoryOptions == dataDimension.attributeCos &&
              event.attributeCc == dataDimension.attributeCc
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

  /**
   *
   * @param events
   * @param currentUser
   * @returns {Observable<any>}
   */
  uploadEventsToSever(events, currentUser): Observable<any> {
    return new Observable(observer => {
      let url = '/api/25/events';
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
          this.httpClientProvider
            .defaultPost(url, event, currentUser)
            .subscribe(
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
                      observer.error();
                    }
                  );
                }
              },
              (error: any) => {
                //try to update event
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
                          observer.error();
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
                      let message =
                        error.response.importSummaries[0].description;
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
                    } else {
                      let message =
                        'There are and error with connection to server, please check the network';
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
