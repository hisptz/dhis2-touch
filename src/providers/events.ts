import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {SqlLite} from "./sql-lite";
import {HttpClient} from "./http-client";

/*
  Generated class for the Events provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Events {

  public resource : string;
  //id = programId+"-"+orgUnitId+"-"+eventId

  constructor(private sqlLite : SqlLite,public httpClient:HttpClient) {
    this.resource = "events";
  }


  /**
   * get formatted datavalues for event
   * @param dataElementValueObject
   * @param programStageDataElements
   * @returns {Promise<T>}
     */
  getEventDataValues(dataElementValueObject,programStageDataElements){
    let dataValues = [];
    return new Promise(function(resolve, reject) {
      programStageDataElements.forEach((programStageDataElement:any)=>{
        let dataElementId = programStageDataElement.dataElement.id;
        if(dataElementValueObject[dataElementId]){
          dataValues.push({
            dataElement : dataElementId, value : dataElementValueObject[dataElementId]
          })
        }
      });
      resolve(dataValues)
    });
  }


  /**
   * get dhis 2 formatted event
   * @param value
   * @returns {string}
     */
  getFormattedDate(value){
    let month,date = (new Date(value));
    month = date.getMonth() + 1;
    let formattedDate = date.getFullYear() + '-';
    if(month > 9){
      formattedDate = formattedDate + month + '-';
    }else{
      formattedDate = formattedDate + '0' + month + '-';
    }
    if(date.getDate() > 9){
      formattedDate = formattedDate + date.getDate();
    }else{
      formattedDate = formattedDate + '0' +date.getDate();
    }
    return formattedDate;
  }

  /**
   * loading 50 most recent events from the server
   * @param orgUnit
   * @param program
   * @param dataDimensions
   * @param currentUser
   * @returns {Promise<T>}
     */
  loadEventsFromServer(orgUnit,program,dataDimensions,currentUser){
    let url = "/api/25/events.json?orgUnit="+orgUnit.id + "&programStage="+program.programStages[0].id;
    if(dataDimensions.length > 0){
      let attributeCos = dataDimensions.toString();
      attributeCos = attributeCos.replace(/,/g, ';');
      url += "&attributeCc="+program.categoryCombo.id+"&attributeCos="+attributeCos;
    }
    url += "&pageSize=50&page=1&totalPages=true";
    let self = this;
    return new Promise(function(resolve, reject) {
      self.httpClient.get(url,currentUser).subscribe(events=>{
        resolve(events.json())
      },error=>{
        reject(error.json());
      });
    });
  }




  /**
   * loading all events fro local storage using
   * @param orgUnit
   * @param program
   * @param currentUser
   * @returns {Promise<T>}
     */
  loadingEventsFromStorage(orgUnit,program,currentUser){
    let self = this;
    let attribute = "orgUnit";
    let attributeArray = [];
    let events = [];
    attributeArray.push(orgUnit.id);
    return new Promise(function(resolve, reject) {
      self.sqlLite.getDataFromTableByAttributes(self.resource,attribute,attributeArray,currentUser.currentDatabase).then((offlineEvents : any)=>{
        //program.id
        offlineEvents.forEach((offlineEvent:any)=>{
          if(offlineEvent.program == program.id){
            events.push(offlineEvent);
          }
        });
        resolve(events);
      },error=>{
        reject(error);
      })
    });
  }

  /**
   * get event by event table id
   * eventTableId == programId+"-"+orgUnitId+"-"+eventId
   * @param eventTableId
   * @param currentUser
   * @returns {Promise<T>}
     */
  loadingEventByIdFromStorage(eventTableId,currentUser){
    let self = this;
    let attribute = "id";
    let attributeArray = [];
    attributeArray.push(eventTableId);
    return new Promise(function(resolve, reject) {
      self.sqlLite.getDataFromTableByAttributes(self.resource,attribute,attributeArray,currentUser.currentDatabase).then((offlineEvents : any)=>{
        if(offlineEvents.length > 0){
          resolve(offlineEvents[0]);
        }else{
          resolve({});
        }
      },error=>{
        reject(error);
      })
    });
  }

  /**
   * get events by status
   * @param currentUser
   * @param status
   * @returns {Promise<T>}
     */
  getEventsFromStorageByStatus(currentUser,status){
    let self = this;
    let attribute = "syncStatus";
    let attributeArray = [];
    attributeArray.push(status);
    return new Promise(function(resolve, reject) {
      self.sqlLite.getDataFromTableByAttributes(self.resource,attribute,attributeArray,currentUser.currentDatabase).then((events : any)=>{
        resolve(events);
      },error=>{
        reject(error)
      });
    })
  }

  /**
   * get event list as sections for easy pagination
   * @param events
     */
  getEventSections(events){
    let pager = 4;
    let sectionsCounter = Math.ceil(events.length/pager);
    let sections = [];
    return new Promise(function(resolve, reject) {
      for(let index = 0; index < sectionsCounter; index ++){
        sections.push({
          name : "defaultSection",
          id : index,
          events :events.splice(0,pager)
        });
      }
      resolve(sections);
    });

  }

  getEventListInTableFormat(events,dataElementToDisplay){
    let self = this;
    return new Promise(function(resolve, reject) {
      let tableFormat = {
        header : [],rows : []
      };
      //set headers
      Object.keys(dataElementToDisplay).forEach((dataElementId:any)=>{
        tableFormat.header.push({
          id : dataElementId,name : dataElementToDisplay[dataElementId].name
        })
      });
      //setting rows
      self.getEventDataValuesMapper(events).then((eventDataValuesMapper:any)=>{
        events.forEach((event:any)=>{

          let dataValueMapper = eventDataValuesMapper[event.event];
          let row = {event : event.event,data : []};
          tableFormat.header.forEach((header : any)=>{
            let value =(dataValueMapper[header.id])? dataValueMapper[header.id] : "";
            row.data.push(value)
          });
          tableFormat.rows.push(row);
        });
        resolve(tableFormat);
      })
    });
  }

  getEventDataValuesMapper(events){
    return new Promise(function(resolve, reject) {
      let eventDataValuesMapper = {};
      events.forEach((event : any)=>{
        let dataValueMapper = {};
        event.dataValues.forEach((dataValue : any)=>{
          dataValueMapper[dataValue.dataElement] = dataValue.value;
        });
        eventDataValuesMapper[event.event] = dataValueMapper;
      });
      resolve(eventDataValuesMapper);
    });
  }

  uploadEventsToServer(events,currentUser){
    let self = this;
    return new Promise(function(resolve, reject) {
      events.forEach((event:any)=> {
        if(event["syncStatus"] == "new event"){
          //delete event id for new event
          let eventTobUploaded = event;
          let eventToUpload = self.formatEventForUpload(eventTobUploaded);
          let url = "/api/25/events";
          console.log(JSON.stringify(eventToUpload));
          self.httpClient.post(url,eventToUpload,currentUser).subscribe(response=>{
            response = response.json();
            console.log(JSON.stringify(response));
            self.updateUploadedLocalStoredEvent(event,response,currentUser).then(()=>{
            },error=>{
            });
          },error=>{
            console.log("error on post : " + JSON.stringify(error.json()));
          })
        }else{
          let eventTobUploaded = event;
          let eventToUpload = self.formatEventForUpload(eventTobUploaded);
          let url = "/api/25/events/"+eventToUpload.event;
          self.httpClient.put(url,eventToUpload,currentUser).subscribe(response=>{
            response = response.json();
            self.updateUploadedLocalStoredEvent(event,response,currentUser).then(()=>{
            },error=>{

            });
          },error=>{
            console.log("error on put : " + JSON.stringify(error.json()));
          })
        }
      });
      //
      resolve();
    });
  }


  updateUploadedLocalStoredEvent(event,response,currentUser){
    let self = this;
    response = response.response;
    if(response.importSummaries[0].reference){
      event.event = response.importSummaries[0].reference;
    }
    event["syncStatus"] = "synced";
    return new Promise(function(resolve, reject) {
      self.saveEvent(event,currentUser).then(response=>{
        resolve();
      },error=>{
        reject();
      })
    })
  }

  /**
   * get formatted events
   * @param event
   * @returns {any}
     */
  formatEventForUpload(event){
    //@todo update event notes to the server
    //delete some field unnecessary for uploading to server
    delete event.id;
    delete event.syncStatus;

    if(event.completedDate == "0"){
      delete event.completedDate;
    }
    if(event.attributeCategoryOptions == "0"){
      delete event.attributeCategoryOptions;
    }
    if(event.notes == "0"){
      delete event.notes;
    }else{
      event.notes = String(event.notes);
    }
    delete event.notes;
    return event;
  }

  /**
   * saving events downloaded from the server
   * @param eventsFromServer
   * @param currentUser
   * @returns {Promise<T>}
     */
  savingEventsFromServer(eventsFromServer,currentUser){
    let self = this;
    let promises = [];
    return new Promise(function(resolve, reject) {
      if(eventsFromServer.events.length == 0){
        resolve();
      }else{
        eventsFromServer.events.forEach((event)=>{
          let eventData = event;
          eventData["eventDate"] = self.getFormattedDate(event.eventDate);
          eventData["syncStatus"] = "synced";
          promises.push(
            self.saveEvent(eventData,currentUser).then(()=>{},error=>{})
          );
        });
        Observable.forkJoin(promises).subscribe(() => {
            resolve();
          },
          (error) => {
            reject(error);
          })
      }
    })
  }

  /***
   * saving single event
   * @param event
   * @param currentUser
   * @returns {Promise<T>}
     */
  saveEvent(event,currentUser){
    let self = this;
    event["id"] = event.program + "-"+event.orgUnit+ "-" +event.event;
    return new Promise(function(resolve, reject) {
      self.sqlLite.insertDataOnTable(self.resource,event,currentUser.currentDatabase).then((success)=>{
        resolve();
      },error=>{
        reject();
      });
    });
  }

}
