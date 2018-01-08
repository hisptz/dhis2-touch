import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import {AppProvider} from "../app/app";

declare var  dhis2;

/*
  Generated class for the NetworkAvailabilityProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class NetworkAvailabilityProvider {

  constructor(public AppProvider: AppProvider,public network : Network) {}

  getNetWorkStatus(){
    return {
      isAvailable : (this.network.type == "unknown" || this.network.type == "none")?false:true,
      message : (this.network.type == "unknown" || this.network.type == "none")?"You are offline" : "You are online",
      networkType : this.network.type
    };
  }

  setNetworkStatusDetection(){
    this.network.onConnect().subscribe(data => {
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));

    this.network.onDisconnect().subscribe(data => {
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));
  }

  displayNetworkUpdate(connectionState: string){
    let networkType = this.network.type;
    console.log('networkType : ' + networkType);
    let message = `You are now ${connectionState}`;
    this.AppProvider.setTopNotification(message);
  }

}
