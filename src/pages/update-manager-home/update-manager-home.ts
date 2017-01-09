import { Component } from '@angular/core';
import {ToastController,NavController } from 'ionic-angular';

import {User} from '../../providers/user/user';
import {HttpClient} from "../../providers/http-client/http-client";
import {SqlLite} from "../../providers/sql-lite/sql-lite";
/*
  Generated class for the UpdateManagerHome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-update-manager-home',
  templateUrl: 'update-manager-home.html',
  providers : [User,HttpClient,SqlLite]
})
export class UpdateManagerHome {

  public dataBaseStructure :  any;
  public resources : any;
  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;


  constructor(public navCtrl: NavController,public sqlLite : SqlLite,
              public user : User,public toastCtrl: ToastController,
              public httpClient : HttpClient) {



    this.setUpdateManagerList();
  }

  ionViewDidLoad() {
  }

  setUpdateManagerList(){
    this.resources = [];
    this.dataBaseStructure = this.sqlLite.getDataBaseStructure();
    Object.keys(this.dataBaseStructure).forEach((resource:any)=>{
      if(this.dataBaseStructure[resource].canBeUpdated){
        this.resources.push({
          name : resource,
          displayName : this.getResourceDisplayName(resource),
          status : false
        })
      }
    });
  }

  getResourceDisplayName(resourceName){
    let displayName : string;
    displayName = (resourceName.charAt(0).toUpperCase() + resourceName.slice(1)).replace(/([A-Z])/g, ' $1').trim();
    return displayName;
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

}
