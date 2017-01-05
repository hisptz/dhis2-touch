import { Component } from '@angular/core';
import { NavController,ToastController,ModalController } from 'ionic-angular';

import {User} from '../../providers/user/user';
import {AppProvider} from '../../providers/app-provider/app-provider';
import {HttpClient} from "../../providers/http-client/http-client";
import {SqlLite} from "../../providers/sql-lite/sql-lite";
import {OrganisationUnits} from "../organisation-units/organisation-units";
import {DataSetSelection} from "../data-set-selection/data-set-selection";
import {PeriodSelection} from "../period-selection/period-selection";
import {DataEntryForm} from "../data-entry-form/data-entry-form";
import {OrganisationUnit} from "../../providers/organisation-unit";

declare var dhis2: any;
/*
  Generated class for the DataEntryHome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-data-entry-home',
  templateUrl: 'data-entry-home.html',
  providers : [User,AppProvider,HttpClient,SqlLite,OrganisationUnit],
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
  public selectedPeriod : any = {};
  public selectedPeriodLabel : string;
  public selectedDataDimension : any ;

  constructor(public modalCtrl: ModalController,public navCtrl: NavController,
              public OrganisationUnit : OrganisationUnit,
              public toastCtrl: ToastController,public user : User,
              public appProvider : AppProvider,public sqlLite : SqlLite,
              public httpClient: HttpClient) {
    this.selectedDataDimension = [];
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
    this.setSelectedPeriodLabel();
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
      this.selectedDataSetLabel = "Touch to select Entry Form";
    }
  }

  setSelectedPeriodLabel(){
    if(this.selectedPeriod.name){
      this.selectedPeriodLabel = this.selectedPeriod.name;
    }else{
      this.selectedPeriodLabel = "Touch to select Period";
    }
  }

  loadOrganisationUnits():void{
    this.loadingData = true;
    this.loadingMessages=[];
    this.setLoadingMessages('Loading organisation units');
    this.OrganisationUnit.getOrganisationUnits(this.currentUser).then((organisationUnits : any)=>{
      this.organisationUnits = organisationUnits;
      this.loadingData = false;
    },error=>{
      this.loadingData = false;
      this.setToasterMessage('Fail to load organisation units : ' + JSON.stringify(error));
    });
  }

  openOrganisationUnitModal(){
    this.loadingMessages = [];
    this.loadingData = true;
    let modal = this.modalCtrl.create(OrganisationUnits,{data : this.organisationUnits,selectedOrganisationUnit:this.selectedOrganisationUnit});
    modal.onDidDismiss((selectedOrganisationUnit:any) => {
      if(selectedOrganisationUnit.id){
        if(selectedOrganisationUnit.id != this.selectedOrganisationUnit.id){
          this.selectedOrganisationUnit = selectedOrganisationUnit;
          this.selectedDataSet = {};
          this.loadingDataSets();
          this.setDataEntrySelectionLabel();
        }else{
          this.loadingData = false;
        }
      }else{
        this.loadingData = false;
      }
    });
    modal.present();
  }


  //@todo services for data sets managements
  loadingDataSets(){
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
          periodType : dataSet.periodType,
          categoryCombo : dataSet.categoryCombo
        });
      });
      if(this.assignedDataSets.length == 1){
        this.selectedDataSet =this.assignedDataSets[0];
      }

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
    let modal = this.modalCtrl.create(DataSetSelection,{data : this.assignedDataSets,selectedDataSet : this.selectedDataSet});
    modal.onDidDismiss((selectedDataSet:any) => {
      if(selectedDataSet.id){
        if(selectedDataSet.id != this.selectedDataSet.id){
          this.selectedDataDimension = [];
          this.selectedDataSet = selectedDataSet;
          this.loadingData = false;
          this.selectedPeriod = {};
          this.setDataEntrySelectionLabel();
        }else{
          this.loadingData = false;
        }
      }else{
        this.loadingData = false;
      }
    });
    modal.present();
  }

  openPeriodModal(){
    this.loadingMessages = [];
    this.loadingData = true;
    this.setLoadingMessages('Please wait ...');
    let modal = this.modalCtrl.create(PeriodSelection,{data : this.selectedDataSet});
    modal.onDidDismiss((selectedPeriod:any) => {
      if(selectedPeriod.name){
        this.selectedPeriod = selectedPeriod;
        this.loadingData = false;
        this.setDataEntrySelectionLabel();
      }else{
        this.loadingData = false;
      }
    });
    modal.present();
  }


  hasDataDimensionSet(){
    let result = true;
    if(this.selectedDataSet.categoryCombo.name != 'default'){
      if(this.selectedDataDimension.length > 0){
        this.selectedDataDimension.forEach((dimension : any)=>{
          if(dimension == null){
            result = false;
          }
        });
      }else{
        result = false;
      }
    }
    return result;
  }

  goToEntryForm(){
    let data = {
      orgUnit : {id :this.selectedOrganisationUnit.id,name :this.selectedOrganisationUnitLabel },
      period : {iso : this.selectedPeriod.iso,name : this.selectedPeriod.name },
      formId : this.selectedDataSet.id,
      dataDimension : {}
    };
    if(this.hasDataDimensionSet()){
      data.dataDimension = this.getDataDimension();
    }
    this.navCtrl.push(DataEntryForm,{data : data});
  }

  getDataDimension(){
    let cc = this.selectedDataSet.categoryCombo.id;
    let cp = "";
    this.selectedDataDimension.forEach((dimension : any,index:any)=>{
      if(index == 0){
        cp +=dimension;
      }else{
        cp += ";" + dimension;
      }
    });
    return {cc : cc,cp:cp};
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
