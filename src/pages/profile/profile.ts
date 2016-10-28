import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';

import {User} from '../../providers/user/user';
import {AppProvider} from '../../providers/app-provider/app-provider';
import {HttpClient} from "../../providers/http-client/http-client";
import {SqlLite} from "../../providers/sql-lite/sql-lite";

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers : [User,AppProvider,HttpClient,SqlLite]
})
export class Profile {

  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;
  public profileInformation : any;
  public userRoles : any;
  public assignedForms : any;
  public assignedPrograms : any;
  public assignOrgUnits : any;

  constructor(public toastCtrl: ToastController,public user : User,public appProvider : AppProvider,public sqlLite : SqlLite,public httpClient: HttpClient) {
    this.user.getCurrentUser().then(currentUser=>{
      this.currentUser = currentUser;
      this.loadingProfileInformation();
    });
  }

  ionViewDidLoad() {
    //console.log('Hello Profile Page');
  }

  loadingProfileInformation(){
    this.loadingData = true;
    this.loadingMessages = [];


    this.setLoadingMessages('Loading profiles information');
    this.user.getUserData().then((userData :any)=>{
      let data = {};
      for(let key in userData){
        let value = userData[key];
        if(!(value instanceof Object)){
          data[key] = value
        }
      }
      this.profileInformation = this.getArrayFromObject(data);
      alert(JSON.stringify(this.profileInformation));
      //this.setUserRoles(userData);
    },error=>{
      this.loadingData = false;
      this.setToasterMessage('Fail to load profile information');
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
