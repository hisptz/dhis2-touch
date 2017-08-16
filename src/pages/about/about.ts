import { Component,OnInit } from '@angular/core';

import {NavController } from 'ionic-angular';
import {Events} from "../../providers/events";
import {AppProvider} from "../../providers/app-provider";
import {DataValues} from "../../providers/data-values";
import {DataSetSyncContainerPage} from "../data-set-sync-container/data-set-sync-container";
import {AboutProvider} from "../../providers/about";
import {User} from "../../providers/user";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage implements OnInit{

  logoUrl : string;
  appInformation : any;
  systemInfo : any;
  loadingMessage : string;
  isLoading : boolean = true;
  currentUser : any;
  aboutContents : Array<any>;
  isAboutContentOpen : any = {};

  dataValuesStorage : any = { online : 0,offline : 0};
  eventsStorage : any = { online : 0,offline : 0};

  constructor(public navCtrl: NavController,
              private userServices : User,
              private appProvider : AppProvider,
              public dataValues : DataValues,public eventProvider :Events,
              private aboutProvider : AboutProvider) {
  }

  ngOnInit(){
    this.loadingMessage = 'Loading app information';
    this.isLoading = true;
    this.logoUrl = 'assets/img/logo.png';
    this.aboutContents = this.aboutProvider.getAboutContentDetails();
    this.userServices.getCurrentUser().then(currentUser =>{
      this.currentUser = currentUser;
      this.aboutProvider.getAppInformation().then(appInformation=>{
        this.appInformation = appInformation;
        this.loadingMessage = 'Loading system information';
        this.aboutProvider.getSystemInformation().then(systemInfo=>{
          this.systemInfo = systemInfo;
          this.loadingDataValueStatus();
        }).catch(error=>{
          this.isLoading = false;
          this.loadingMessage = '';
          console.log(JSON.stringify(error));
          this.appProvider.setNormalNotification('Fail to load system information');
        });
      }).catch(error=>{
        this.isLoading = false;
        this.loadingMessage = '';
        console.log(JSON.stringify(error));
        this.appProvider.setNormalNotification('Fail to load app information');
      })
    });
  }

  reLoadContents(ionRefresher){
    this.loadingDataValueStatus(ionRefresher);
    this.isAboutContentOpen = {};
  }

  loadingDataValueStatus(ionRefresher?){
    this.loadingMessage = 'Loading data values storage status';
    this.isLoading = true;
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
        this.appProvider.setNormalNotification('Fail to loading data values storage status');
        this.isLoading = false;
      });
    },error=>{
      if(ionRefresher){
        ionRefresher.complete();
      }
      this.appProvider.setNormalNotification('Fail to loading data values storage status');
      this.isLoading = false;
    });
  }

  viewDataValuesSynchronisationStatusByDataSets(syncStatus){
    if(this.dataValuesStorage[syncStatus].length > 0){
      this.navCtrl.push(DataSetSyncContainerPage,{dataValues : this.dataValuesStorage[syncStatus],syncStatus:syncStatus});
    }else{
      this.appProvider.setNormalNotification("There is nothing to view");
    }
  }

  viewEventsSynchronisationStatusByProgram(syncStatus){
    if(this.eventsStorage[syncStatus].length > 0){
      this.appProvider.setNormalNotification("Viewing " + this.eventsStorage[syncStatus].length + " events coming soon");
    }else{
      this.appProvider.setNormalNotification("There is nothing to view");
    }
  }

  loadingEvents(ionRefresher?){
    this.loadingMessage = "Loading event storage status";
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
        this.isLoading = false;
        if(ionRefresher){
          ionRefresher.complete();
        }
        this.appProvider.setNormalNotification('Fail to loading event storage status : ' + JSON.stringify(error));
      });
      this.eventProvider.getEventsFromStorageByStatus(this.currentUser,"synced").then((events :any)=>{
        for(let event of events ){
          this.eventsStorage["synced"].push(event);
        }
        this.eventsStorage.online += events.length;
        this.isLoading = false;
        if(ionRefresher){
          ionRefresher.complete();
        }
      },error=>{
        if(ionRefresher){
          ionRefresher.complete();
        }
        this.isLoading = false;
        this.loadingMessage = '';
        this.appProvider.setNormalNotification('Fail to loading event storage status ');
        console.log(JSON.stringify(error))
      });
    },error=>{
      if(ionRefresher){
        ionRefresher.complete();
      }
      this.isLoading = false;
      this.appProvider.setNormalNotification('Fail to loading event storage status ');
      console.log(JSON.stringify(error))
    });
  }

  toggleAboutContents(content){
    if(content && content.id){
      if(this.isAboutContentOpen[content.id]){
        this.isAboutContentOpen[content.id] = false;
      }else{
        Object.keys(this.isAboutContentOpen).forEach(id=>{
          this.isAboutContentOpen[id] = false;
        });
        this.isAboutContentOpen[content.id] = true;
      }
    }
  }


}
