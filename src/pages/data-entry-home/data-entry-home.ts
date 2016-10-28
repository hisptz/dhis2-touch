import { Component } from '@angular/core';
import { NavController,ToastController,ModalController } from 'ionic-angular';

import {User} from '../../providers/user/user';
import {AppProvider} from '../../providers/app-provider/app-provider';
import {HttpClient} from "../../providers/http-client/http-client";
import {SqlLite} from "../../providers/sql-lite/sql-lite";
import {OrganisationUnits} from "../organisation-units/organisation-units";
import {DataSetSelection} from "../data-set-selection/data-set-selection";

declare var dhis2: any;
/*
  Generated class for the DataEntryHome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-data-entry-home',
  templateUrl: 'data-entry-home.html',
  providers : [User,AppProvider,HttpClient,SqlLite],
})
export class DataEntryHome {

  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;
  public organisationUnits : any;
  public selectedOrganisationUnit :any = {};
  public selectedOrganisationUnitLabel :string;
  public assignedDataSets : any;
  public selectedDataSet : any = {};
  public selectedDataSetLabel : string;
  public dataSetIdsByUserRoles : any;

  constructor(public modalCtrl: ModalController,public navCtrl: NavController,public toastCtrl: ToastController,public user : User,public appProvider : AppProvider,public sqlLite : SqlLite,public httpClient: HttpClient) {
    this.user.getCurrentUser().then(currentUser=>{
      this.currentUser = currentUser;
      this.getUserAssignedDataSets();
      this.loadOrganisationUnits();
      this.setDataEntrySelectionLabel();
    })
  }

  getUserAssignedDataSets(){
    this.dataSetIdsByUserRoles = [];
    this.user.getUserData().then((userData : any)=>{
      userData.userRoles.forEach((userRole:any)=>{
        if (userRole.dataSets) {
          userRole.dataSets.forEach((dataSet:any)=>{
            this.dataSetIdsByUserRoles.push(dataSet.id);
          });
        }
      });
    })
  }

  ionViewDidLoad() {

  }

  setDataEntrySelectionLabel(){
    this.setOrganisationSelectLabel();
    this.setSelectedDataSetLabel();
  }

  setOrganisationSelectLabel(){
    if(this.selectedOrganisationUnit.id){
      this.selectedOrganisationUnitLabel = this.selectedOrganisationUnit.name;
    }else{
      this.selectedOrganisationUnitLabel = "Touch to select Organisation Unit"
    }
  }

  setSelectedDataSetLabel(){
    if(this.selectedDataSet.id){
      this.selectedDataSetLabel = this.selectedDataSet.name;
    }else{
      this.selectedDataSetLabel = "Touch to select Entry Form"
    }
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
        //todo empty values of orgUnitId changes
        this.selectedOrganisationUnit = selectedOrganisationUnit;
        this.loadingDataSets();
        this.setOrganisationSelectLabel();
      }else{
        this.loadingData = false;
      }
    });
    modal.present();
  }

  loadingDataSets(){
    //todo empty data set as well as period values
    this.setLoadingMessages('Loading assigned forms');
    let resource = 'dataSets';
    let attribute = 'id';
    let attributeValue =[];
    this.assignedDataSets = [];
    this.selectedOrganisationUnit.dataSets.forEach((dataSet:any)=>{
      if(this.dataSetIdsByUserRoles.indexOf(dataSet.id) != -1){
        attributeValue.push(dataSet.id);
      }
    });
    this.sqlLite.getDataFromTableByAttributes(resource,attribute,attributeValue,this.currentUser.currentDatabase).then((dataSets : any)=>{
      dataSets.forEach((dataSet:any)=>{
        this.assignedDataSets.push({
          id: dataSet.id,
          name: dataSet.name,
          openFuturePeriods: dataSet.openFuturePeriods,
          periodType : dataSet.periodType
        });
      });
      this.loadingData = false;
    },error=>{
      this.loadingData = false;
      this.setToasterMessage('Fail to load assigned forms');
    });
  }

  openDataSetsModal(){
    this.loadingMessages = [];
    this.loadingData = true;
    this.setLoadingMessages('Please wait ...');
    let id = this.selectedDataSet.id?this.selectedDataSet.id : null;
    let modal = this.modalCtrl.create(DataSetSelection,{data : this.assignedDataSets,selectedId : id });
    modal.onDidDismiss((selectedDataSet:any) => {
      if(selectedDataSet.id){
        //todo empty values of selectedDataSet changes
        this.selectedDataSet = selectedDataSet;
        this.loadingData = false;
        this.setSelectedDataSetLabel();
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
