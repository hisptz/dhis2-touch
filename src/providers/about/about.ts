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
      //{id : 'appInformation',name : 'App information',icon: 'assets/about-icons/app-information.png'},
      {id : 'dataValues',name : 'Aggregate status',icon: 'assets/about-icons/data-values.png'},
      {id : 'eventStatus',name : 'Event status',icon: 'assets/about-icons/event-status.png'},
      {id : 'eventForTrackerStatus',name : 'Event for tracker status',icon: 'assets/about-icons/event-status.png'},
      {id : 'enrollment',name : 'Enrollments',icon: 'assets/tracker/profile.png'},
      {id : 'systemInfo',name : 'System info',icon: 'assets/about-icons/system-info.png'},
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
