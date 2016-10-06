import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';

import {ObjectToArray} from '../../pipes/objectToArray';
import {User} from '../../providers/user/user';
import {AppProvider} from '../../providers/app-provider/app-provider';
import {HttpClient} from "../../providers/http-client/http-client";
import {SqlLite} from "../../providers/sql-lite/sql-lite";

/*
  Generated class for the ProfilePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/profile/profile.html',
  providers : [User,AppProvider,HttpClient,SqlLite],
  pipes : [ObjectToArray]
})
export class ProfilePage {

  private loadingData : boolean = false;
  private loadingMessages : any = [];
  private profileInformation : any;
  private userRoles : any;
  private assignOrgUnits : any;

  constructor(private navCtrl: NavController,private toastCtrl: ToastController,private user : User,private appProvider : AppProvider,private sqlLite : SqlLite,private httpClient: HttpClient) {
    this.loadingProfileInformation();
  }

  loadingProfileInformation(){
    this.loadingData = true;
    this.loadingMessages = [];
    this.setLoadingMessages('Loading profiles information');
    this.user.getUserData().then((userData :any)=>{
      this.profileInformation = userData;
      alert(JSON.stringify(userData));
      alert(JSON.stringify(userData.userRoles));
      alert(JSON.stringify(userData.organisationUnits));
    },error=>{
      this.loadingData = false;
      this.setToasterMessage('Fail to load profile information');
    });
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
