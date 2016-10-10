import { Component } from '@angular/core';
import { NavController,ToastController ,ModalController} from 'ionic-angular';

import {User} from '../../providers/user/user';
import {AppProvider} from '../../providers/app-provider/app-provider';
import {HttpClient} from "../../providers/http-client/http-client";
import {SqlLite} from "../../providers/sql-lite/sql-lite";

import {OrganisationUnitsPage} from "../organisation-units/organisation-units"

declare var dhis2: any;

/*
  Generated class for the DataEntryHomePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/data-entry-home/data-entry-home.html',
  providers : [User,AppProvider,HttpClient,SqlLite],
})
export class DataEntryHomePage {

  private loadingData : boolean = false;
  private loadingMessages : any = [];
  private currentUser : any;
  private organisationUnits : any;

  constructor(private modalCtrl: ModalController,private navCtrl: NavController,private toastCtrl: ToastController,private user : User,private appProvider : AppProvider,private sqlLite : SqlLite,private httpClient: HttpClient) {
    this.user.getCurrentUser().then(currentUser=>{
      this.currentUser = currentUser;
      this.loadOrganisationUnits();
    })
  }

  loadOrganisationUnits():void{
    this.loadingData = true;
    this.loadingMessages=[];
    this.setLoadingMessages('Loading organisation units');
    let resource  = "organisationUnits";
    this.sqlLite.getAllDataFromTable(resource,this.currentUser.currentDatabase).then((organisationUnits : any)=>{
      this.organisationUnits = organisationUnits;
      this.loadingData = false;
    },error=>{
      this.loadingData = false;
      this.setToasterMessage('Fail to load organisation units');
    })
  }

  openModal(){
    this.loadingMessages = [];
    this.loadingData = true;
    this.setLoadingMessages('Please wait...');
    let modal = this.modalCtrl.create(OrganisationUnitsPage,{data : this.organisationUnits});
    modal.onDidDismiss(data => {
      this.loadingData = false;
      alert(JSON.stringify(data));
    });
    modal.present();
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

