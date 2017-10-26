import { Injectable } from '@angular/core';
import {ProgramsProvider} from "../programs/programs";
import {DataElementsProvider} from "../data-elements/data-elements";
import {SqlLiteProvider} from "../sql-lite/sql-lite";

declare var dhis2: any;

/*
  Generated class for the EventCaptureFormProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class EventCaptureFormProvider {

  constructor(private programsProvider:ProgramsProvider,
              private sqliteProvider : SqlLiteProvider,
              private dataElementProvider:DataElementsProvider) {}

  /**
   *
   * @param programId
   * @param currentUser
   * @returns {Promise<any>}
   */
  getProgramStages(programId, currentUser){
    let dataElementIds = [];
    let dataElementMapper = {};
    return new Promise((resolve, reject) =>  {
      this.programsProvider.getProgramsStages(programId,currentUser).then((programsStages:any)=>{
        //@todo sections on program stages
        //obtain section ids
        //programstage sections
        //merge program stage with program stage sections
        //sorting by sortOrder
        programsStages.forEach((programsStage:any)=>{
          programsStage.programStageDataElements.forEach((programStageDataElement)=>{
            if(programStageDataElement.dataElement && programStageDataElement.dataElement.id){
              dataElementIds.push(programStageDataElement.dataElement.id);
            }
          });
        });
        this.dataElementProvider.getDataElementsByIdsForEvents(dataElementIds,currentUser).then((dataElements : any)=>{
          dataElements.forEach((dataElement : any)=>{
            dataElementMapper[dataElement.id] = dataElement;
          });
          programsStages.forEach((programsStage:any)=>{
            let ids = programsStage.id.split("-");
            if(ids.length > 1){
              programsStage.id = ids[1];
            }
            programsStage.hideDueDate = JSON.parse(programsStage.hideDueDate);
            programsStage.repeatable = JSON.parse(programsStage.repeatable);
            programsStage.allowGenerateNextVisit = JSON.parse(programsStage.allowGenerateNextVisit);
            programsStage.autoGenerateEvent = JSON.parse(programsStage.autoGenerateEvent);
            programsStage.blockEntryForm = JSON.parse(programsStage.blockEntryForm);
            programsStage.generatedByEnrollmentDate = JSON.parse(programsStage.generatedByEnrollmentDate);
            programsStage.captureCoordinates = JSON.parse(programsStage.captureCoordinates);
            programsStage.programStageDataElements.forEach((programStageDataElement)=>{
              if(programStageDataElement.dataElement && programStageDataElement.dataElement.id){
                let dataElementId = programStageDataElement.dataElement.id;
                if(dataElementId && dataElementMapper[dataElementId]){
                  programStageDataElement.dataElement = dataElementMapper[dataElementId]
                }
              }
            });
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

          resolve(programsStages);
        }).catch(error=>{reject(error)});
      }).catch(error=>{reject(error)});
    });
  }

  /**
   *
   * @param columnsToDisplay
   * @param events
   * @returns {Promise<any>}
   */
  getTableFormatResult(columnsToDisplay,events){
    let table = {headers: [], rows: []};
    let eventIds = this.getMapperObjectForDisplay(events).eventIds;
    let eventDataValuesArrays = this.getMapperObjectForDisplay(events).eventsMapper;
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
    return new Promise((resolve, reject) => {
      resolve({table: table, eventIds: eventIds});
    });
  }

  /**
   *
   * @param events
   * @returns {{eventsMapper: Array; eventIds: Array}}
   */
  getMapperObjectForDisplay(events){
    let eventIds = [];
    let eventsMapper = [];
    events.forEach((event : any)=>{
      let mapper = {};
      if(event && event.dataValues){
        event.dataValues.forEach((dataValue : any)=>{
          mapper[dataValue.dataElement] = dataValue.value;
        });
      }
      eventsMapper.push(mapper);
      eventIds.push(event.id);
    });
    return {eventsMapper : eventsMapper,eventIds : eventIds}
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
  getEmptyEvent(currentProgram,currentOrgUnit,programStageId,attributeCategoryOptions,attributeCc,eventType){
    let event = {
      id : dhis2.util.uid(),
      program : currentProgram.id,
      programName : currentProgram.name,
      programStage : programStageId,
      orgUnit : currentOrgUnit.id,
      orgUnitName : currentOrgUnit.name,
      status : "ACTIVE",
      deleted : false,
      attributeCategoryOptions : attributeCategoryOptions,
      attributeCc : attributeCc,
      eventType : eventType,
      syncStatus : "not-synced",
      coordinate : {
        "latitude": 0,
        "longitude": 0
      },
      dataValues : []
    };
    return event;
  }

  /**
   *
   * @param {string} attribute
   * @param {Array<string>} attributeValues
   * @param currentUser
   * @returns {Promise<any>}
   */
  getEventsByAttribute(attribute : string,attributeValues : Array<string>,currentUser){
    let tableName = "events";
    return new Promise((resolve,reject)=>{
      this.sqliteProvider.getDataFromTableByAttributes(tableName,attribute,attributeValues,currentUser.currentDatabase).then((events : any)=>{
        resolve(events);
      }).catch((error=>{
        reject({message : error});
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
  getEventsForProgramStage(currentUser,programStageId,trackedEntityInstance,dataDimension?){
    let attribute = "programStage";
    let attributeValues = [programStageId];
    let events = [];
    //@todo based on data dimension
    return new Promise((resolve,reject)=>{
      this.getEventsByAttribute(attribute,attributeValues,currentUser).then((eventResponse : any)=>{
        eventResponse.forEach((event : any)=>{
          if(event.trackedEntityInstance == trackedEntityInstance){
            events.push(event);
          }
        });
        resolve(events);
      }).catch((error)=>{
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
  getEventsBasedOnEventsSelection(currentUser,dataDimension,programId,orgUnitId){
    let attribute = "program";
    let attributeValues = [programId];
    let events = [];
    return new Promise((resolve,reject)=>{
      this.getEventsByAttribute(attribute,attributeValues,currentUser).then((eventResponse : any)=>{
        eventResponse.forEach((event : any)=>{
          if(event.orgUnit == orgUnitId && event.attributeCategoryOptions == dataDimension.attributeCos && event.attributeCc == dataDimension.attributeCc){
            events.push(event);
          }
        });
        resolve(events);
      }).catch((error)=>{
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
  saveEvents(events,currentUser){
    let tableName  = "events";
    return new Promise((resolve,reject)=>{
      this.sqliteProvider.insertBulkDataOnTable(tableName,events,currentUser.currentDatabase).then(()=>{
        resolve();
      }).catch(error=>{
        reject({message : error});
      });
    });
  }

}
