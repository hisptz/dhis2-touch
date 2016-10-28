import { Component } from '@angular/core';
import { NavController,ToastController,ModalController } from 'ionic-angular';

import {User} from '../../providers/user/user';
import {AppProvider} from '../../providers/app-provider/app-provider';
import {HttpClient} from "../../providers/http-client/http-client";
import {SqlLite} from "../../providers/sql-lite/sql-lite";
import {OrganisationUnits} from "../organisation-units/organisation-units";

declare var dhis2: any;

/*
  Generated class for the TrackerCaptureHome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tracker-capture-home',
  templateUrl: 'tracker-capture-home.html',
  providers : [User,AppProvider,HttpClient,SqlLite]
})
export class TrackerCaptureHome {

  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;
  public organisationUnits : any;
  public selectedOrganisationUnit :any = {};

  constructor(public modalCtrl: ModalController,public navCtrl: NavController,public toastCtrl: ToastController,public user : User,public appProvider : AppProvider,public sqlLite : SqlLite,public httpClient: HttpClient) {
    this.user.getCurrentUser().then(currentUser=>{
      this.currentUser = currentUser;
      this.loadOrganisationUnits();
    })
  }

  ionViewDidLoad() {

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

  openOrganisationUnitModal(){
    this.loadingMessages = [];
    this.loadingData = true;
    let id = this.selectedOrganisationUnit.id?this.selectedOrganisationUnit.id : null;
    let modal = this.modalCtrl.create(OrganisationUnits,{data : this.organisationUnits,selectedId : id });
    modal.onDidDismiss((selectedOrganisationUnit:any) => {
      if(selectedOrganisationUnit.id){
        this.selectedOrganisationUnit = selectedOrganisationUnit;
        //todo loading programs
        this.loadingData = false;
      }else{
        this.loadingData = false;
      }
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
