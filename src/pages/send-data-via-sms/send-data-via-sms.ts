import { Component,OnInit } from '@angular/core';
import { ToastController,ModalController } from 'ionic-angular';

import {OrganisationUnits} from "../organisation-units/organisation-units";
import {DataSetSelection} from "../data-set-selection/data-set-selection";
import {PeriodSelection} from "../period-selection/period-selection";
import {SmsCommand} from "../../providers/sms-command";
import {OrganisationUnit} from "../../providers/organisation-unit";
import {DataSets} from "../../providers/data-sets";
import {User} from "../../providers/user";

declare var dhis2: any;
/*
  Generated class for the SendDataViaSms page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-send-data-via-sms',
  templateUrl: 'send-data-via-sms.html',
})
export class SendDataViaSms implements OnInit{

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
  public currentPeriodOffset : number;
  public currentSelectionStatus :any = {};
  public sendDataViaSmsObject : any = {
    orgUnit : {},dataSet : {},period : {},dataDimension : {},mobileNumber : "",isLoading : false,loadingMessage : ""
  };


  constructor(public modalCtrl: ModalController,public SmsCommand : SmsCommand,
              public OrganisationUnit : OrganisationUnit,public DataSets : DataSets,
              public toastCtrl: ToastController,public user : User) {

  }

  ngOnInit() {
    this.selectedDataDimension = [];
    this.user.getCurrentUser().then(currentUser=>{
      this.currentUser = currentUser;
      this.initiateDefaultValues();
      this.setDataSetIdsByUserRoles();
      this.setDataEntrySelectionLabel();
    });
  }

  setDataSetIdsByUserRoles(){
    this.dataSetIdsByUserRoles = [];
    this.currentPeriodOffset = 0;
    this.user.getUserData().then((userData : any)=>{
      userData.userRoles.forEach((userRole:any)=>{
        if (userRole.dataSets) {
          userRole.dataSets.forEach((dataSet:any)=>{
            this.dataSetIdsByUserRoles.push(dataSet.id);
          });
        }
      });
      this.loadOrganisationUnits();
    });
  }

  ionViewDidLoad() {
  }

  initiateDefaultValues(){
  this.currentSelectionStatus.orgUnit = true;
  this.currentSelectionStatus.isOrgUnitSelected = false;
  this.currentSelectionStatus.isOrgUnitLoaded = false;
  this.currentSelectionStatus.dataSet = false;
  this.currentSelectionStatus.isDataSetSelected = false;
  this.currentSelectionStatus.isDataSetLoaded = false;
  this.currentSelectionStatus.period = false;
  this.currentSelectionStatus.isPeriodSelected = false;
  this.currentSelectionStatus.allParameterSet = false;
  this.currentSelectionStatus.message = "";
}

  setDataEntrySelectionLabel(){
    this.setOrganisationSelectLabel();
    this.setSelectedDataSetLabel();
    this.setSelectedPeriodLabel();
  }

  setOrganisationSelectLabel(){
    if(this.selectedOrganisationUnit.id){
      this.selectedOrganisationUnitLabel = this.selectedOrganisationUnit.name;
      this.currentSelectionStatus.isOrgUnitSelected = true;
      this.currentSelectionStatus.dataSet = true;
    }else{
      this.selectedOrganisationUnitLabel = "Touch to select Organisation Unit";
      this.currentSelectionStatus.dataSet = false;
      this.currentSelectionStatus.isOrgUnitSelected = false;
      this.currentSelectionStatus.allParameterSet = false;
      if (this.currentSelectionStatus.orgUnit && !this.currentSelectionStatus.dataSet) {
        this.currentSelectionStatus.message = "Please select organisation unit";
      }
    }
  }

  setSelectedDataSetLabel(){
    if(this.selectedDataSet.id){
      this.selectedDataSetLabel = this.selectedDataSet.name;
      this.currentSelectionStatus.period = true;
      this.currentSelectionStatus.isDataSetSelected = true;
    }else{
      this.selectedDataSetLabel = "Touch to select Entry Form";
      this.currentSelectionStatus.period = false;
      this.sendDataViaSmsObject.mobileNumber = "";
      this.sendDataViaSmsObject.isLoading = false;
      this.sendDataViaSmsObject.loadingMessage = "";
      this.currentSelectionStatus.isDataSetSelected = false;
      this.currentSelectionStatus.allParameterSet = false;
      if (this.currentSelectionStatus.dataSet && !this.currentSelectionStatus.period) {
        this.currentSelectionStatus.message = "Please select entry form";
      }
    }
  }

  setSelectedPeriodLabel(){
    if(this.selectedPeriod.name){
      this.selectedPeriodLabel = this.selectedPeriod.name;
      this.currentSelectionStatus.isPeriodSelected = true;
      this.currentSelectionStatus.message = "";
      this.hasDataDimensionSet();
    }else{
      this.selectedPeriodLabel = "Touch to select Period";
      this.currentSelectionStatus.isPeriodSelected = false;
      if(this.currentSelectionStatus.period){
        this.currentSelectionStatus.message = "Please select period for entry form";
      }
      this.currentSelectionStatus.allParameterSet = false;
    }
  }

  loadOrganisationUnits(){
    this.currentSelectionStatus.isDataSetLoaded = true;
    this.currentSelectionStatus.isOrgUnitLoaded = false;
    this.OrganisationUnit.getOrganisationUnits(this.currentUser).then((organisationUnits : any)=>{
      this.organisationUnits = organisationUnits;
      this.currentSelectionStatus.isOrgUnitLoaded = true;
      if(organisationUnits.length > 0){
        this.selectedOrganisationUnit = organisationUnits[0];
        this.setDataEntrySelectionLabel();
        this.loadingDataSets();
        this.setDataEntrySelectionLabel();
      }
    },error=>{
      this.setToasterMessage('Fail to load organisation units : ' + JSON.stringify(error));
    });
  }

  openOrganisationUnitModal(){
    if(this.currentSelectionStatus && this.currentSelectionStatus.isDataSetLoaded){
      let modal = this.modalCtrl.create(OrganisationUnits,{data : this.organisationUnits,selectedOrganisationUnit:this.selectedOrganisationUnit});
      modal.onDidDismiss((selectedOrganisationUnit:any) => {
        if(selectedOrganisationUnit && selectedOrganisationUnit.id){
          if(selectedOrganisationUnit.id != this.selectedOrganisationUnit.id){
            this.selectedOrganisationUnit = selectedOrganisationUnit;
            this.selectedDataSet = {};
            this.selectedPeriod = {};
            this.loadingDataSets();
            this.setDataEntrySelectionLabel();
          }
        }
      });
      modal.present();
    }
  }

  loadingDataSets(){
    this.currentSelectionStatus.isDataSetLoaded = false;
    this.assignedDataSets = [];
    this.currentPeriodOffset = 0;
    this.DataSets.getAssignedDataSetsByOrgUnit(this.selectedOrganisationUnit,this.dataSetIdsByUserRoles,this.currentUser).then((dataSets : any)=>{
      this.assignedDataSets = dataSets;
      if(this.assignedDataSets.length == 1){
        this.selectedDataSet =this.assignedDataSets[0];
        this.setDataEntrySelectionLabel();
      }
      this.currentSelectionStatus.isDataSetLoaded = true;
    },error=>{
      this.setToasterMessage('Fail to load assigned forms : ' + JSON.stringify(error));
    });
  }

  openDataSetsModal(){
    if(this.currentSelectionStatus && this.currentSelectionStatus.dataSet){
      if(this.assignedDataSets.length > 0){
        let modal = this.modalCtrl.create(DataSetSelection,{data : this.assignedDataSets,selectedDataSet : this.selectedDataSet});
        modal.onDidDismiss((selectedDataSet:any) => {
          if(selectedDataSet && selectedDataSet.id){
            if(selectedDataSet.id != this.selectedDataSet.id){
              this.selectedDataDimension = [];
              this.selectedDataSet = selectedDataSet;
              this.selectedPeriod = {};
              this.setDataEntrySelectionLabel();
            }
          }
        });
        modal.present();
      }else{
        this.setToasterMessage("No entry form to select on " + this.selectedOrganisationUnitLabel);
      }
    }else{
      this.setToasterMessage("Please select organisation first");
    }
  }

  openPeriodModal(){
    if(this.currentSelectionStatus && this.currentSelectionStatus.period){
      let modal = this.modalCtrl.create(PeriodSelection,{selectedDataSet : this.selectedDataSet,currentPeriodOffset : this.currentPeriodOffset});
      modal.onDidDismiss((selectedPeriodResponse:any) => {
        if(selectedPeriodResponse && selectedPeriodResponse.selectedPeriod){
          if(selectedPeriodResponse.selectedPeriod.name){
            this.selectedPeriod = selectedPeriodResponse.selectedPeriod;
            this.currentPeriodOffset = selectedPeriodResponse.currentPeriodOffset;
            this.setDataEntrySelectionLabel();
          }
        }
      });
      modal.present();
    }else{
      this.setToasterMessage("Please select entry form first");
    }
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
    this.currentSelectionStatus.allParameterSet = (result && (this.selectedPeriodLabel.indexOf("Touch to select Period") < 0 ))?true:false;
    return result;
  }


  sendDataViaSms(){
    this.sendDataViaSmsObject.orgUnit = {id :this.selectedOrganisationUnit.id,name :this.selectedOrganisationUnitLabel};
    this.sendDataViaSmsObject.dataSet = {id : this.selectedDataSet.id,name : this.selectedDataSet.name};
    this.sendDataViaSmsObject.period = {iso : this.selectedPeriod.iso,name : this.selectedPeriod.name };
    if(this.hasDataDimensionSet()){
      this.sendDataViaSmsObject.dataDimension = this.getDataDimension();
    }
    this.sendDataViaSmsObject.isLoading = true;
    this.sendDataViaSmsObject.loadingMessage = "Loading Sms Configuration";
    this.SmsCommand.getSmsCommandForDataSet(this.selectedDataSet.id,this.currentUser).then((smsCommand:any)=>{
      this.sendDataViaSmsObject.loadingMessage = "Preparing Data";
      let dataElements = this.SmsCommand.getEntryFormDataElements(this.selectedDataSet);
      this.SmsCommand.getEntryFormDataValuesObjectFromStorage(this.selectedDataSet.id,this.selectedPeriod.iso,this.selectedOrganisationUnit.id,dataElements,this.currentUser).then((entryFormDataValuesObject:any)=>{
        let key = Object.keys(entryFormDataValuesObject);
        if(key.length > 0){
          this.sendDataViaSmsObject.loadingMessage = "Preparing sms";
          this.SmsCommand.getSmsForReportingData(smsCommand,entryFormDataValuesObject,this.selectedPeriod).then((reportingSms:any)=>{
           this.sendDataViaSmsObject.loadingMessage = "Uploading "+reportingSms.length+ (reportingSms.length == 1)?" SMS " : " SMSes";
            this.SmsCommand.sendSmsForReportingData(this.sendDataViaSmsObject.mobileNumber,reportingSms).then((response)=>{
              this.sendDataViaSmsObject.isLoading = false;
              this.sendDataViaSmsObject.loadingMessage = "";
              this.setToasterMessage("SMS has been sent");
            },error=>{
              this.sendDataViaSmsObject.isLoading = false;
              this.sendDataViaSmsObject.loadingMessage = "";
              this.setToasterMessage("Fail to send some of SMS, Please go into your SMS inbox and resend them manually");
            });
          });
        }else{
          this.sendDataViaSmsObject.isLoading = false;
          this.sendDataViaSmsObject.loadingMessage = "";
          this.setToasterMessage("There is no data to be sent via SMS for " + this.selectedDataSet.name);
        }
      },error=>{
        this.sendDataViaSmsObject.isLoading = false;
        this.sendDataViaSmsObject.loadingMessage = "";
        this.setToasterMessage("Fail to prepare data for " +this.selectedDataSet.name);
      });
    },error=>{
      this.sendDataViaSmsObject.isLoading = false;
      this.sendDataViaSmsObject.loadingMessage = "";
      this.setToasterMessage("Fail to load sms configuration for " +this.selectedDataSet.name);
    });
  }

  setToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }



}
