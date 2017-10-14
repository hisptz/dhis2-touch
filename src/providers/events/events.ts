import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {HttpClientProvider} from "../http-client/http-client";

/*
 Generated class for the EventsProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class EventsProvider {

  resource : String;

  constructor(public http: Http, private sqlLite : SqlLiteProvider,public httpClient: HttpClientProvider) {
    this.resource = "events";
  }

  /**
   *
   * @param orgUnit
   * @param program
   * @param dataDimension
   * @param currentUser
   * @returns {Promise<any>}
   */
  downloadEventsFromServer(orgUnit,program,dataDimension,currentUser){
    console.log("dataDimension : " + JSON.stringify(dataDimension));
    let url = "/api/25/events.json?orgUnit="+orgUnit.id+"&program="+program.id ;
    return new Promise((resolve, reject) =>{
      this.httpClient.get(url,currentUser).then((eventsData: any)=>{
        resolve(JSON.parse(eventsData.data));
      },error=>{
        reject(error);
      });
    });
  }



}
