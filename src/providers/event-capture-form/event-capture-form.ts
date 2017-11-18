import {Injectable} from '@angular/core';
import {ProgramsProvider} from "../programs/programs";
import {DataElementsProvider} from "../data-elements/data-elements";
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {HttpClientProvider} from "../http-client/http-client";
import {ProgramStageSectionsProvider} from "../program-stage-sections/program-stage-sections";

declare var dhis2: any;

/*
  Generated class for the EventCaptureFormProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class EventCaptureFormProvider {

  constructor(private programsProvider: ProgramsProvider,
              private sqlLiteProvider: SqlLiteProvider,
              private httpClientProvider: HttpClientProvider,
              private programStageSectionsProvider : ProgramStageSectionsProvider,
              private dataElementProvider: DataElementsProvider) {
  }

  /**
   *
   * @param programId
   * @param currentUser
   * @returns {Promise<any>}
   */
  getProgramStages(programId, currentUser) {
    let dataElementIds = [];
    let dataElementMapper = {};
    let programStageSectionIds = [];
    let programStageSectionMapper = {};
    return new Promise((resolve, reject) => {
      this.programsProvider.getProgramsStages(programId, currentUser).then((programsStages: any) => {
        //prepare data elements ids as well as program stage sections ids if any
        programsStages.forEach((programsStage: any) => {
          if(programsStage.programStageSections){
            programsStage.programStageSections.forEach((programStageSection : any)=>{
              programStageSectionIds.push(programStageSection.id);
            });
          }
          programsStage.programStageDataElements.forEach((programStageDataElement) => {
            if (programStageDataElement.dataElement && programStageDataElement.dataElement.id) {
              dataElementIds.push(programStageDataElement.dataElement.id);
            }
          });
        });
        //loading data elements by ids
        this.dataElementProvider.getDataElementsByIdsForEvents(dataElementIds, currentUser).then((dataElements: any) => {
          dataElements.forEach((dataElement: any) => {
            dataElementMapper[dataElement.id] = dataElement;
          });
          programsStages.forEach((programsStage: any) => {
            let ids = programsStage.id.split("-");
            if (ids.length > 1) {
              programsStage.id = ids[1];
            }
            programsStage.hideDueDate = JSON.parse(programsStage.hideDueDate);
            programsStage.repeatable = JSON.parse(programsStage.repeatable);
            programsStage.allowGenerateNextVisit = JSON.parse(programsStage.allowGenerateNextVisit);
            programsStage.autoGenerateEvent = JSON.parse(programsStage.autoGenerateEvent);
            programsStage.blockEntryForm = JSON.parse(programsStage.blockEntryForm);
            programsStage.generatedByEnrollmentDate = JSON.parse(programsStage.generatedByEnrollmentDate);
            programsStage.captureCoordinates = JSON.parse(programsStage.captureCoordinates);
            programsStage.programStageDataElements.forEach((programStageDataElement) => {
              if (programStageDataElement.dataElement && programStageDataElement.dataElement.id) {
                let dataElementId = programStageDataElement.dataElement.id;
                if (dataElementId && dataElementMapper[dataElementId]) {
                  programStageDataElement.dataElement = dataElementMapper[dataElementId]
                }
              }
            });
            //loading programStageSections
            this.programStageSectionsProvider.getProgramStageSectionsByIds(programStageSectionIds,currentUser).then((programStageSections : any)=>{
              programStageSections.forEach((programStageSection : any)=>{
                let dataElements = [];
                programStageSection.dataElements.forEach((dataElement : any)=>{
                  let dataElementId = dataElement.id;
                  if (dataElementId && dataElementMapper[dataElementId]) {
                    dataElements.push(dataElementMapper[dataElementId]);
                  }
                });
                programStageSection.dataElements = dataElements;
                programStageSectionMapper[programStageSection.id] = programStageSection;
              });
              programsStages.sort((a, b) => {
                if (a.sortOrder > b.sortOrder) {
                  return 1;
                }
                if (a.sortOrder < b.sortOrder) {
                  return -1;
                }
                return 0;
              });
              //merge back program sections
              programsStages.forEach((programsStage: any) => {
                if(programsStage.programStageSections){
                  let programStageSections = [];
                  programsStage.programStageSections.forEach((programStageSection : any)=>{
                    programStageSections.push(programStageSectionMapper[programStageSection.id]);
                  });
                  programStageSections.sort((a, b) => {
                    if (a.sortOrder > b.sortOrder) {
                      return 1;
                    }
                    if (a.sortOrder < b.sortOrder) {
                      return -1;
                    }
                    return 0;
                  });
                  programsStage.programStageSections = programStageSections;
                }
              });
              resolve(programsStages);
            });
          });
        }).catch(error => {
          reject(error)
        });
      }).catch(error => {
        reject(error)
      });
    });
  }

  /**
   *
   * @param attribute
   * @param attributeValue
   * @param currentUser
   * @returns {Promise<any>}
   */
  deleteEventByAttribute(attribute, attributeValue, currentUser) {
    let resource = "events";
    return new Promise((resolve, reject) => {
      this.sqlLiteProvider.deleteFromTableByAttribute(resource, attribute, attributeValue, currentUser.currentDatabase).then(() => {
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  }

  /**
   *
   * @param currentUser
   * @returns {Promise<any>}
   */
  deleteALLEvents(currentUser){
    return new Promise((resolve,reject)=>{
      this.sqlLiteProvider.dropTable('events',currentUser.currentDatabase).then(()=>{
        resolve();
      }).catch(error=>{
        reject();
      });
    });
  }

  /**
   *
   * @param columnsToDisplay
   * @param events
   * @returns {Promise<any>}
   */
  getTableFormatResult(columnsToDisplay, events, eventType?) {
    let table = {headers: [], rows: []};
    let eventIds = this.getMapperObjectForDisplay(events).eventIds;
    let eventDataValuesArrays = this.getMapperObjectForDisplay(events).eventsMapper;
    if (events && events.length > 0) {
      Object.keys(columnsToDisplay).forEach(key => {
        table.headers.push(columnsToDisplay[key]);
      });
      eventDataValuesArrays.forEach((eventDataValues: any) => {
        let row = [];
        Object.keys(columnsToDisplay).forEach(key => {
          if (eventDataValues[key]) {
            row.push(eventDataValues[key]);
          } else {
            row.push("");
          }
        });
        table.rows.push(row);
      });
    }else if(!eventType){
      Object.keys(columnsToDisplay).forEach(key => {
        table.headers.push(columnsToDisplay[key]);
      });
    }
    return new Promise((resolve, reject) => {
      resolve({table: table, eventIds: eventIds});
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
    events.forEach((event: any) => {
      let mapper = {};
      if (event && event.dataValues) {
        event.dataValues.forEach((dataValue: any) => {
          mapper[dataValue.dataElement] = dataValue.value;
        });
      }
      eventsMapper.push(mapper);
      eventIds.push(event.id);
    });
    return {eventsMapper: eventsMapper, eventIds: eventIds}
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
  getEmptyEvent(currentProgram, currentOrgUnit, programStageId, attributeCategoryOptions, attributeCc, eventType) {
    let event = {
      id: dhis2.util.uid(),
      program: currentProgram.id,
      programName: currentProgram.name,
      programStage: programStageId,
      orgUnit: currentOrgUnit.id,
      orgUnitName: currentOrgUnit.name,
      status: "ACTIVE",
      deleted: false,
      attributeCategoryOptions: attributeCategoryOptions,
      attributeCc: attributeCc,
      eventType: eventType,
      syncStatus: "not-synced",
      coordinate: {
        "latitude": 0,
        "longitude": 0
      },
      dataValues: []
    };
    return event;
  }

  /**
   *
   * @param currentUser
   * @returns {Promise<any>}
   */
  getAllEvents(currentUser){
    return new Promise((resolve,reject)=>{
      this.sqlLiteProvider.getAllDataFromTable('events', currentUser.currentDatabase).then((events : any)=>{
        resolve(events);
      }).catch(error=>{
        reject(error);
      });
    })
  }


  /**
   *
   * @param {string} attribute
   * @param {Array<string>} attributeValues
   * @param currentUser
   * @returns {Promise<any>}
   */
  getEventsByAttribute(attribute: string, attributeValues: Array<string>, currentUser) {
    let tableName = "events";
    return new Promise((resolve, reject) => {
      this.sqlLiteProvider.getDataFromTableByAttributes(tableName, attribute, attributeValues, currentUser.currentDatabase).then((events: any) => {
        resolve(events);
      }).catch((error => {
        reject({message: error});
      }));
    });
  }

  /**
   *
   * @param currentUser
   * @param programStageId
   * @param trackedEntityInstance
   * @param dataDimension
   * @returns {Promise<any>}
   */
  getEventsForProgramStage(currentUser, programStageId, trackedEntityInstance, dataDimension?) {
    let attribute = "programStage";
    let attributeValues = [programStageId];
    let events = [];
    //@todo based on data dimension
    return new Promise((resolve, reject) => {
      this.getEventsByAttribute(attribute, attributeValues, currentUser).then((eventResponse: any) => {
        eventResponse.forEach((event: any) => {
          if (event.trackedEntityInstance == trackedEntityInstance) {
            events.push(event);
          }
        });
        resolve(events);
      }).catch((error) => {
        resolve(events);
      });
    });
  }

  /**
   *
   * @param currentUser
   * @param dataDimension
   * @param programId
   * @param orgUnitId
   * @returns {Promise<any>}
   */
  getEventsBasedOnEventsSelection(currentUser, dataDimension, programId, orgUnitId) {
    let attribute = "program";
    let attributeValues = [programId];
    let events = [];
    return new Promise((resolve, reject) => {
      this.getEventsByAttribute(attribute, attributeValues, currentUser).then((eventResponse: any) => {
        eventResponse.forEach((event: any) => {
          if (event.orgUnit == orgUnitId && event.attributeCategoryOptions == dataDimension.attributeCos && event.attributeCc == dataDimension.attributeCc) {
            events.push(event);
          }
        });
        resolve(events);
      }).catch((error) => {
        resolve(events);
      });
    });
  }

  /**
   *
   * @param events
   * @param currentUser
   * @returns {Promise<any>}
   */
  saveEvents(events, currentUser) {
    let tableName = "events";
    return new Promise((resolve, reject) => {
      this.sqlLiteProvider.insertBulkDataOnTable(tableName, events, currentUser.currentDatabase).then(() => {
        resolve();
      }).catch(error => {
        reject({message: error});
      });
    });
  }

  /**
   *
   * @param events
   * @param currentUser
   * @returns {Promise<any>}
   */
  uploadEventsToSever(events, currentUser) {
    return new Promise((resolve, reject) => {
      let url = "/api/25/events";
      let success = 0, fail = 0;
      let updatedEventIds = [];
      let errorMessages = [];
      events = this.getFormattedEventsForUpload(events);
      if (events.length == 0) {
        resolve({success: success, fail: fail, errorMessages: errorMessages});
      } else {
        events.forEach((event: any) => {
          this.httpClientProvider.defaultPost(url, event, currentUser).then(() => {
            updatedEventIds.push(event.event);
            success++;
            if (success + fail == events.length) {
              this.updateEventStatus(updatedEventIds, 'synced', currentUser).then(() => {
                resolve({success: success, fail: fail, errorMessages: errorMessages});
              }).catch(error => {
                reject();
              })
            }
          }).catch((error: any) => {
            //try to update event
            url = url + "/" + event.event;
            this.httpClientProvider.put(url, event, currentUser).then(() => {
              updatedEventIds.push(event.event);
              success++;
              if (success + fail == events.length) {
                this.updateEventStatus(updatedEventIds, 'synced', currentUser).then(() => {
                  resolve({success: success, fail: fail, errorMessages: errorMessages});
                }).catch(error => {
                  reject();
                })
              }
            }).catch((error: any) => {
              fail++;
              if (error && error.response && error.response.importSummaries && error.response.importSummaries.length > 0 && error.response.importSummaries[0].description) {
                let message = error.response.importSummaries[0].description;
                if (errorMessages.indexOf(message) == -1) {
                  errorMessages.push(message);
                }
              } else if(error && error.response && error.response.conflicts){
                error.response.conflicts.forEach((conflict : any)=>{
                  let message = JSON.stringify(conflict);
                  if (errorMessages.indexOf(message) == -1) {
                    errorMessages.push(message);
                  }
                })
              } else if (error && error.httpStatusCode == 500) {
                let message = error.message;
                if (errorMessages.indexOf(message) == -1) {
                  errorMessages.push(message);
                }
              }else {
                let message = "There are and error with connection to server, please check the network";
                if (errorMessages.indexOf(message) == -1) {
                  errorMessages.push(message);
                }
              }
              if (success + fail == events.length) {
                this.updateEventStatus(updatedEventIds, 'synced', currentUser).then(() => {
                  resolve({success: success, fail: fail, errorMessages: errorMessages});
                }).catch(error => {
                  reject();
                })
              }
            });
          })
        });
      }
    });
  }

  /**
   *
   * @param eventIds
   * @param status
   * @param currentUser
   * @returns {Promise<any>}
   */
  updateEventStatus(eventIds, status, currentUser) {
    return new Promise((resolve, reject) => {
      this.getEventsByAttribute('id', eventIds, currentUser).then((events: any) => {
        if (events && events.length > 0) {
          events.forEach((event: any) => {
            event.syncStatus = status;
          });
          this.saveEvents(events, currentUser).then(() => {
            resolve();
          }).catch(error => {
            reject({message: error});
          });
        } else {
          resolve();
        }
      }).catch(error => {
        reject({message: error});
      })
    })
  }

  /**
   *
   * @param events
   * @returns {any}
   */
  getFormattedEventsForUpload(events) {
    events.forEach((event: any) => {
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
      if (event.completedDate == "0") {
        delete event.completedDate;
      }
      if (event.trackedEntityInstance == "0") {
        delete event.trackedEntityInstance;
      }
      if (event.attributeCategoryOptions == "0") {
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
   * @returns {Promise<any>}
   */
  getEventsByStatusAndType(status, eventType, currentUser) {
    let attribute = "syncStatus";
    let attributeArray = [status];
    let eventResults = [];
    return new Promise((resolve, reject) => {
      this.getEventsByAttribute(attribute, attributeArray, currentUser).then((events: any) => {
        events.forEach((event: any) => {
          if (event.eventType == eventType) {
            eventResults.push(event);
          }
        });
        resolve(eventResults)
      }).catch((error) => {
        reject({message: error});
      });
    });
  }

}
