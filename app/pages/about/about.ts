import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';

import {ObjectToArray} from '../../pipes/objectToArray';
import {User} from '../../providers/user/user';
import {AppProvider} from '../../providers/app-provider/app-provider';
import {HttpClient} from "../../providers/http-client/http-client";
import {SqlLite} from "../../providers/sql-lite/sql-lite";

/*
  Generated class for the AboutPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/about/about.html',
  providers : [User,AppProvider,HttpClient,SqlLite],
  pipes : [ObjectToArray]
})
export class AboutPage {

  private loadingData : boolean = false;
  private loadingMessages : any = [];
  private systemInformation : any;
  private appInformation : any;

  constructor(private navCtrl: NavController,private toastCtrl: ToastController,private user : User,private appProvider : AppProvider,private sqlLite : SqlLite,private httpClient: HttpClient) {
    this.loadingSystemInformation();
  }

  loadingSystemInformation(){
    this.loadingData = true;
    this.loadingMessages = [];
    this.setLoadingMessages('Loading system information');
    this.user.getCurrentUserSystemInformation().then(systemInformation=>{
      this.systemInformation = systemInformation;
      this.loadAppInformation();
    });
  }

  loadAppInformation(){
    this.setLoadingMessages('Loading app information');
    this.appProvider.getAppInformation().then(appInformation=>{
      this.appInformation = appInformation;
      this.loadingData = false;
    })
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
