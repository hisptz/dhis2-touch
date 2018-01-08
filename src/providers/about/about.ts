import { Injectable } from '@angular/core';
import {AppProvider} from "../app/app";
import {UserProvider} from "../user/user";

/*
  Generated class for the AboutProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AboutProvider {

  constructor(private appProvider : AppProvider,private userProvider : UserProvider) {
  }

  getAboutContentDetails(){
    let syncContents = [
      //{id : 'appInformation',name : 'App information',icon: 'assets/icon/app-information.png'},
      {id : 'dataValues',name : 'aggregate_status',icon: 'assets/icon/data-values.png'},
      {id : 'eventStatus',name : 'event_status',icon: 'assets/icon/event-status.png'},
      {id : 'eventForTrackerStatus',name : 'event_for_tracker_status',icon: 'assets/icon/event-status.png'},
      {id : 'enrollment',name : 'enrollments',icon: 'assets/icon/profile-tracker.png'},
      {id : 'systemInfo',name : 'system_info',icon: 'assets/icon/system-info.png'},
    ];
    return syncContents;
  }

  getAppInformation(){
    let appInformation = {name : '',version : '',package : ''};
    return new Promise((resolve, reject) => {
      this.appProvider.getAppInformation().then((response : any)=>{
        appInformation.name = response.appName;
        appInformation.version = response.versionNumber;
        appInformation.package = response.packageName;
        resolve(appInformation);
      },error=>{
        reject(error);
      });
    });
  }

  getSystemInformation(){
    return new Promise((resolve,reject) => {
      this.userProvider.getCurrentUserSystemInformation().then(systemInfo=>{
        resolve(this.getArrayFromObject(systemInfo));
      }).catch(error=>{
        reject(error);
      });
    });
  }

  getArrayFromObject(object){
    let array = [];
    for(let key in object){
      let newValue = object[key];
      if(newValue instanceof Object) {
        newValue = JSON.stringify(newValue)
      }
      let newKey = (key.charAt(0).toUpperCase() + key.slice(1)).replace(/([A-Z])/g, ' $1').trim();
      array.push({key : newKey,value : newValue})
    }
    return array;
  }


}
