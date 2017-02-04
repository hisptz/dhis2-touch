import { Injectable } from '@angular/core';

declare var navigator: any;

/*
  Generated class for the NetworkAvailability provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class NetworkAvailability {

  constructor() {
  }

  getNetWorkStatus(){
    let netWorkStatus = {
      isAvailable : (navigator.connection.type == "unknown" || navigator.connection.type == "none")?false:true,
      message : (navigator.connection.type == "unknown" || navigator.connection.type == "none")?"You are offline" : "You are online",
      networkType : navigator.connection.type
    };
    return netWorkStatus;
  }
}
