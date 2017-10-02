import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {HttpClientProvider} from "../http-client/http-client";
import {AppProvider} from "../app/app";

/*
  Generated class for the EventsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class EventsProvider {

  public resource : string;
  lastChoosedOrgUnit: any;

  constructor(public http: Http, private sqlLite : SqlLiteProvider,public httpClient: HttpClientProvider, public appProvider:AppProvider) {
    this.resource = "events";
  }

  setLastChoosedOrgUnit(orgUnitId){
    this.lastChoosedOrgUnit = orgUnitId;
  }

  getLastChoosedOrgUnit(){
    return this.lastChoosedOrgUnit;
  }

  downloadEventsFromServer(orgUnitId,programId,currentUser){
    let url = "/api/25/events.json?orgUnit="+orgUnitId+"&program="+programId ;

    return new Promise((resolve, reject) =>{
      this.httpClient.get(url,currentUser).then((eventsData: any)=>{
        eventsData = JSON.parse(eventsData.data);

        // alert("Events Downloaded Length: "+JSON.stringify(eventsData.events.length))

        resolve(eventsData)

      },error=>{
        reject(error);
        this.appProvider.setTopNotification("Downloading events from server failed")
      });
    });
  }


  /**
   * get formatted datavalues for event
   * @param dataElementValueObject
   * @param programStageDataElements
   * @returns {Promise<T>}
   */
  getEventDataValues(dataElementValueObject,programStageDataElements){
    let dataValues = [];
    return new Promise((resolve, reject) =>{
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
  loadEventsFromServer(orgUnit,programId,programComboId,dataDimensions,currentUser){
    let url = "/api/25/events.json?orgUnit="+orgUnit.id + "&programStage="+programId;
    if(dataDimensions.length > 0){
      let attributeCos = dataDimensions.toString();
      //attributeCos = attributeCos.replace(/,/g, ';');
      url += "&attributeCc="+programComboId+"&attributeCos="+attributeCos;
    }
    url += "&pageSize=50&page=1&totalPages=true";
    return new Promise((resolve, reject) =>{
      this.http.get(url,currentUser).subscribe(events=>{
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
    let attribute = "orgUnit";
    let attributeArray = [];
    let events = [];
    attributeArray.push(orgUnit.id);
    return new Promise((resolve, reject)=>{
      this.sqlLite.getDataFromTableByAttributes(this.resource,attribute,attributeArray,currentUser.currentDatabase).then((offlineEvents : any)=>{
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
    let attribute = "id";
    let attributeArray = [];
    attributeArray.push(eventTableId);
    return new Promise((resolve, reject)=>{
      this.sqlLite.getDataFromTableByAttributes(this.resource,attribute,attributeArray,currentUser.currentDatabase).then((offlineEvents : any)=>{
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
    let attribute = "syncStatus";
    let attributeArray = [];
    attributeArray.push(status);
    return new Promise((resolve, reject)=>{
      this.sqlLite.getDataFromTableByAttributes(this.resource,attribute,attributeArray,currentUser.currentDatabase).then((events : any)=>{
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
    return new Promise((resolve, reject)=>{
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
    return new Promise((resolve, reject)=>{
      let tableFormat = {
        header : [],rows : []
      };
      //set headers
      Object.keys(dataElementToDisplay).forEach((dataElementId:any)=>{
        tableFormat.header.push({
          id : dataElementId, name : dataElementToDisplay[dataElementId].name
        })
      });
      //setting rows
      this.getEventDataValuesMapper(events).then((eventDataValuesMapper:any)=>{
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
    return new Promise((resolve, reject)=>{
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


  /**
   * get formatted events
   * @param event
   * @returns {any}
   */
  formatEventForUpload(event){
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
    return new Promise((resolve, reject)=>{
      if(eventsFromServer.events.length == 0){
        resolve();
      }else{
        let bulkData = [];
        for(let event of eventsFromServer.events){
          let eventData = event;
          eventData["eventDate"] = this.getFormattedDate(event.eventDate);
          eventData["syncStatus"] = "synced";
          eventData["id"] = event.program + "-"+event.orgUnit+ "-" +event.event;
          bulkData.push(eventData);
        }
        this.sqlLite.insertBulkDataOnTable(this.resource,bulkData,currentUser.currentDatabase).then(()=>{
          resolve();
        },error=>{
          console.log(JSON.stringify(error));
          reject(error);
        });
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
    event["id"] = event.program + "-"+event.orgUnit+ "-" +event.event;
    return new Promise((resolve, reject)=>{
      this.sqlLite.insertDataOnTable(this.resource,event,currentUser.currentDatabase).then((success)=>{
        resolve();
      },error=>{
        reject();
      });
    });
  }

}
