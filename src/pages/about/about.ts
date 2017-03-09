import { Component,OnInit } from '@angular/core';
import { ToastController } from 'ionic-angular';
import {User} from "../../providers/user/user";
import {AppProvider} from "../../providers/app-provider/app-provider";
import {HttpClient} from '../../providers/http-client/http-client';
import {SqlLite} from "../../providers/sql-lite/sql-lite";
import {DataValues} from "../../providers/data-values";
import {Events} from "../../providers/events";


/*
  Generated class for the About page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  providers : [User,AppProvider,HttpClient,SqlLite,DataValues,Events]
})
export class About implements OnInit{

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

  constructor(private toastCtrl: ToastController,private user : User,
              private appProvider : AppProvider,private httpClient : HttpClient,
              private dataValues : DataValues,public eventProvider :Events,
              private sqlLite : SqlLite) {

  }

  ngOnInit() {
    this.user.getCurrentUser().then(user=>{
      this.currentUser = user;
      this.loadingSystemInformation();
    });
  }

  ionViewDidLoad() {
    //console.log('Hello About Page');
  }

  loadingSystemInformation(){
    this.loadingData = true;
    this.loadingMessages = [];

    this.setLoadingMessages('Loading system information');
    this.user.getCurrentUserSystemInformation().then(systemInformation=>{
      this.systemInformation = this.getArrayFromObject(systemInformation);
      this.loadAppInformation();
    });
  }

  loadAppInformation(){
    this.setLoadingMessages('Loading app information');
    this.appProvider.getAppInformation().then(appInformation=>{
      this.appInformation = this.getArrayFromObject(appInformation);
      this.loadingDataValueStatus();
    })
  }

  loadingDataValueStatus(){
    //dataValues synced , not synced
    this.setLoadingMessages('Loading data values storage status');
    this.dataValues.getDataValuesByStatus(this.currentUser,"synced").then((syncedDataValues : any)=>{
      this.dataValues.getDataValuesByStatus(this.currentUser,"not synced").then((unSyncedDataValues : any)=>{
        this.dataValuesStorage.offline = unSyncedDataValues.length;
        this.dataValuesStorage.online = syncedDataValues.length;
        this.loadingEvents();
      },error=>{
        this.setToasterMessage('Fail to loading data values storage status');
        this.loadingData = false;
      });
    },error=>{
      this.setToasterMessage('Fail to loading data values storage status');
      this.loadingData = false;
    });
    //this.dataValues.getDataValuesByStatus()

  }

  loadingEvents(){
    this.setLoadingMessages("Loading event storage status");
    this.eventProvider.getEventsFromStorageByStatus(this.currentUser,"new event").then((events :any)=>{
      this.eventsStorage.offline += events.length;
      this.eventProvider.getEventsFromStorageByStatus(this.currentUser,"not synced").then((events :any)=>{
        this.eventsStorage.offline += events.length;
      },error=>{
        this.loadingData = false;
        this.setToasterMessage('Fail to loading event storage status : ' + JSON.stringify(error));
      });
      this.eventProvider.getEventsFromStorageByStatus(this.currentUser,"synced").then((events :any)=>{
        this.eventsStorage.online += events.length;
        this.loadingData = false;
      },error=>{
        this.loadingData = false;
        this.setToasterMessage('Fail to loading event storage status : ' + JSON.stringify(error));
      });
    },error=>{
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
      duration: 3000
    });
    toast.present();
  }

  setStickToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton : true
    });
    toast.present();
  }

}
