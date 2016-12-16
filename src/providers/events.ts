import { Injectable } from '@angular/core';
import {SqlLite} from "./sql-lite/sql-lite";
import {HttpClient} from "./http-client/http-client";
import {Observable} from 'rxjs/Rx';

/*
  Generated class for the Events provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Events {

  public resource : string;
  //id = programId+"-"+orgUnitId

  constructor(private sqlLite : SqlLite,public httpClient:HttpClient) {
    this.resource = "events";
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
    let url = "/api/events.json?orgUnit="+orgUnit.id + "&programStage="+program.programStages[0].id;
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
    let attribute = "id";
    let attributeArray = [];
    attributeArray.push(program.id + "-" +orgUnit.id);
    return new Promise(function(resolve, reject) {
      self.sqlLite.getDataFromTableByAttributes(self.resource,attribute,attributeArray,currentUser.currentDatabase).then((offlineEvents : any)=>{
        resolve(offlineEvents);
      },error=>{
        reject(error);
      })
    });
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
    event["id"] = event.program + "-"+event.orgUnit;
    return new Promise(function(resolve, reject) {
      self.sqlLite.insertDataOnTable(self.resource,event,currentUser.currentDatabase).then((success)=>{
        resolve();
      },error=>{
        reject();
      });
    });
  }

}
