import { Component,OnInit } from '@angular/core';

import { ToastController,NavController } from 'ionic-angular';
import {Events} from "../../providers/events";
import {User} from "../../providers/user";
import {AppProvider} from "../../providers/app-provider";
import {DataValues} from "../../providers/data-values";
import {DataSetSyncContainerPage} from "../data-set-sync-container/data-set-sync-container";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  providers : [Events]
})
export class AboutPage implements OnInit{

  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;
  public systemInformation : any = [];
  public appInformation : any;
  public dataValuesStorage : any = { online : 0,offline : 0};
  public eventsStorage : any = { online : 0,offline : 0};
  public hideAndShowObject : any = {
    systemInformation : {
      status : false,count : 4
    }
  };

  constructor(public user : User,public toastCtrl : ToastController,
              public appProvider : AppProvider,public navCtrl: NavController,
              public dataValues : DataValues,public eventProvider :Events) {
  }

  ngOnInit() {
    this.user.getCurrentUser().then(user=>{
      this.currentUser = user;
      this.loadingSystemInformation();
    });
  }

  ionViewDidEnter() {
    if(this.dataValuesStorage.offline > 0 || this.dataValuesStorage.online > 0){
      this.loadingSystemInformation();
    }
  }

  reLoadContents(ionRefresher){
    this.loadingSystemInformation(ionRefresher);
  }

  loadingSystemInformation(ionRefresher?){
    this.loadingData = true;
    this.loadingMessages = [];

    this.setLoadingMessages('Loading system information');
    this.user.getCurrentUserSystemInformation().then(systemInformation=>{
      this.systemInformation = this.getArrayFromObject(systemInformation);
      this.loadAppInformation(ionRefresher);
    });
  }

  loadAppInformation(ionRefresher?){
    this.setLoadingMessages('Loading app information');
    this.appProvider.getAppInformation().then(appInformation=>{
      this.appInformation = this.getArrayFromObject(appInformation);
      this.loadingDataValueStatus(ionRefresher);
    })
  }

  loadingDataValueStatus(ionRefresher?){
    //dataValues synced , not synced
    this.setLoadingMessages('Loading data values storage status');
    this.dataValues.getDataValuesByStatus(this.currentUser,"synced").then((syncedDataValues : any)=>{
      this.dataValues.getDataValuesByStatus(this.currentUser,"not synced").then((unSyncedDataValues : any)=>{
        this.dataValuesStorage.offline = unSyncedDataValues.length;
        this.dataValuesStorage.online = syncedDataValues.length;
        this.dataValuesStorage["synced"] = syncedDataValues;
        this.dataValuesStorage["not_synced"] = unSyncedDataValues;
        this.loadingEvents(ionRefresher);
      },error=>{
        if(ionRefresher){
          ionRefresher.complete();
        }
        this.setToasterMessage('Fail to loading data values storage status');
        this.loadingData = false;
      });
    },error=>{
      if(ionRefresher){
        ionRefresher.complete();
      }
      this.setToasterMessage('Fail to loading data values storage status');
      this.loadingData = false;
    });
  }

  viewDataValuesSynchronisationStatusByDataSets(syncStatus){
    if(this.dataValuesStorage[syncStatus].length > 0){
      this.navCtrl.push(DataSetSyncContainerPage,{dataValues : this.dataValuesStorage[syncStatus],syncStatus:syncStatus});
    }else{
      this.setToasterMessage("There is nothing to view");
    }
  }

  viewEventsSynchronisationStatusByProgram(syncStatus){
    if(this.eventsStorage[syncStatus].length > 0){
      this.setToasterMessage("Viewing " + this.eventsStorage[syncStatus].length + " events coming soon");
      //this.navCtrl.push(DataSetSyncContainerPage,{dataValues : this.dataValuesStorage[syncStatus],syncStatus:syncStatus});
    }else{
      this.setToasterMessage("There is nothing to view");
    }
  }

  loadingEvents(ionRefresher?){
    this.setLoadingMessages("Loading event storage status");
    this.eventsStorage["synced"] = [];
    this.eventsStorage["not_synced"] = [];
    this.eventsStorage.offline = 0;
    this.eventsStorage.online = 0;
    this.eventProvider.getEventsFromStorageByStatus(this.currentUser,"new event").then((events :any)=>{
      this.eventsStorage.offline += events.length;
      for(let event of events ){
        this.eventsStorage["not_synced"].push(event);
      }
      this.eventProvider.getEventsFromStorageByStatus(this.currentUser,"not synced").then((events :any)=>{
        this.eventsStorage.offline += events.length;
        for(let event of events ){
          this.eventsStorage["not_synced"].push(event);
        }
        if(ionRefresher){
          ionRefresher.complete();
        }
      },error=>{
        this.loadingData = false;
        if(ionRefresher){
          ionRefresher.complete();
        }
        this.setToasterMessage('Fail to loading event storage status : ' + JSON.stringify(error));
      });
      this.eventProvider.getEventsFromStorageByStatus(this.currentUser,"synced").then((events :any)=>{
        for(let event of events ){
          this.eventsStorage["synced"].push(event);
        }
        this.eventsStorage.online += events.length;
        this.loadingData = false;
        if(ionRefresher){
          ionRefresher.complete();
        }
      },error=>{
        if(ionRefresher){
          ionRefresher.complete();
        }
        this.loadingData = false;
        this.setToasterMessage('Fail to loading event storage status : ' + JSON.stringify(error));
      });
    },error=>{
      if(ionRefresher){
        ionRefresher.complete();
      }
      this.loadingData = false;
      this.setToasterMessage('Fail to loading event storage status : ' + JSON.stringify(error));
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

  hideAndShowDetails(key,totalCount){
    if(this.hideAndShowObject[key].status){
      this.hideAndShowObject[key].count = 4;
    }else{
      this.hideAndShowObject[key].count = totalCount;
    }
    this.hideAndShowObject[key].status = !this.hideAndShowObject[key].status;
  }

  setLoadingMessages(message){
    this.loadingMessages.push(message);
  }

  setToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 4000
    });
    toast.present();
  }
}
