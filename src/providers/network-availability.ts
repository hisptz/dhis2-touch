import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { ToastController} from 'ionic-angular';

declare var navigator: any;
declare var  dhis2;

/*
  Generated class for the NetworkAvailability provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class NetworkAvailability {

  constructor(public network : Network,public toast : ToastController) {
  }

  getNetWorkStatus(){
    return dhis2.network;
  }

  setNetworkStatusDetection(){
    this.updateNetworkStatus();
    this.network.onConnect().subscribe(data => {
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));

    this.network.onDisconnect().subscribe(data => {
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));
  }

  displayNetworkUpdate(connectionState: string){
    this.updateNetworkStatus();
    let networkType = this.network.type;
    this.toast.create({
      message: `You are now ${connectionState} via ${networkType}`,
      position : 'top',
      duration: 3500
    }).present();
  }

  updateNetworkStatus(){
    dhis2.network = {
      isAvailable : (this.network.type == "unknown" || this.network.type == "none")?false:true,
      message : (this.network.type == "unknown" || this.network.type == "none")?"You are offline" : "You are online",
      networkType : this.network.type
    };
  }
}
