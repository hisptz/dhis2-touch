import { Component,OnInit } from '@angular/core';
import { NavController,ToastController,ModalController } from 'ionic-angular';

import {OrganisationUnits} from "../organisation-units/organisation-units";
import {DataSetSelection} from "../data-set-selection/data-set-selection";
import {PeriodSelection} from "../period-selection/period-selection";
import {DataEntryForm} from "../data-entry-form/data-entry-form";
import {OrganisationUnit} from "../../providers/organisation-unit";
import {DataSets} from "../../providers/data-sets";
import {User} from "../../providers/user";
import {PeriodService} from "../../providers/period-service";


/*
 Generated class for the DataEntryHome page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-data-entry-home',
  templateUrl: 'data-entry-home.html'
})
export class DataEntryHomePage implements OnInit{

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
  public currentPeriodOffset : number;
  public currentSelectionStatus :any = {};

  constructor(public modalCtrl: ModalController,public navCtrl: NavController,
              public PeriodService : PeriodService,
              public OrganisationUnit : OrganisationUnit,public DataSets : DataSets,
              public toastCtrl: ToastController,public user : User) {}

  ngOnInit() {
    this.selectedDataDimension = [];
    this.user.getCurrentUser().then(currentUser=>{
      this.currentUser = currentUser;
      this.setDataSetIdsByUserRoles();
      this.setDataEntrySelectionLabel();
    })
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
    })
  }

  ionViewDidLoad() {
    this.currentSelectionStatus.orgUnit = true;
    this.currentSelectionStatus.isOrgUnitSelected = false;
    this.currentSelectionStatus.isOrgUnitLoaded = false;
    this.currentSelectionStatus.dataSet = false;
    this.currentSelectionStatus.isDataSetSelected = false;
    this.currentSelectionStatus.isDataSetLoaded = true;
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
    this.OrganisationUnit.getOrganisationUnits(this.currentUser).then((organisationUnitsResponse : any)=>{
      this.organisationUnits = organisationUnitsResponse.organisationUnits;
      this.currentSelectionStatus.isOrgUnitLoaded = true;
      this.selectedOrganisationUnit = organisationUnitsResponse.lastSelectedOrgUnit;
      this.setDataEntrySelectionLabel();
      this.loadingDataSets();
      this.setDataEntrySelectionLabel();
    },error=>{
      this.setToasterMessage('Fail to load organisation units : ' + JSON.stringify(error));
    });
  }

  openOrganisationUnitModal(){
    if(this.currentSelectionStatus && this.currentSelectionStatus.isDataSetLoaded){
      this.loadingMessages = [];
      this.loadingData = true;
      let modal = this.modalCtrl.create(OrganisationUnits,{
        organisationUnits : this.organisationUnits,
        currentUser : this.currentUser,
        lastSelectedOrgUnit:this.selectedOrganisationUnit
      });
      modal.onDidDismiss((selectedOrganisationUnit:any) => {
        if(selectedOrganisationUnit && selectedOrganisationUnit.id){
          if(selectedOrganisationUnit.id != this.selectedOrganisationUnit.id){
            this.selectedOrganisationUnit = selectedOrganisationUnit;
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
  }

  loadingDataSets(){
    this.currentSelectionStatus.isDataSetLoaded = false;
    this.assignedDataSets = [];
    this.currentPeriodOffset = 0;
    this.selectedPeriod = {};
    this.DataSets.getAssignedDataSetsByOrgUnit(this.selectedOrganisationUnit,this.dataSetIdsByUserRoles,this.currentUser).then((dataSets : any)=>{
      this.assignedDataSets = dataSets;
      let lastSelectedDataSet = this.DataSets.getLastSelectedDataSet();
      let lastSelectedPeriod = this.DataSets.getLastSelectedDataSetPeriod();
      if(lastSelectedDataSet && lastSelectedDataSet.id){
        for(let dataSet of dataSets){
          if(dataSet.id = lastSelectedDataSet.id){
            this.selectedDataSet = lastSelectedDataSet;
            if(lastSelectedPeriod && lastSelectedPeriod.name){
              this.selectedPeriod = lastSelectedPeriod;
              this.preSelectDataSetDataDimension(lastSelectedDataSet);
            }else{
              this.preSelectPeriod(lastSelectedDataSet);
            }
          }
        }
      }else if(this.assignedDataSets.length > 0){
        this.selectedDataSet =this.assignedDataSets[0];
        this.DataSets.setLastSelectedDataSet(this.assignedDataSets[0]);
        this.preSelectPeriod(this.assignedDataSets[0]);
      }
      this.setDataEntrySelectionLabel();
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
            this.selectedDataDimension = [];
            this.selectedPeriod = {};
            this.selectedDataSet = selectedDataSet;
            let lastSelectedDataSet = this.DataSets.getLastSelectedDataSet();
            let lastSelectedPeriod = this.DataSets.getLastSelectedDataSetPeriod();
            if(lastSelectedPeriod && lastSelectedPeriod.name){
              let periodTypeCurrent = this.selectedDataSet.periodType;
              let openFuturePeriodsCurrent  = parseInt(this.selectedDataSet.openFuturePeriods);
              let periodTypePrevious = lastSelectedDataSet.periodType;
              let openFuturePeriodsPrevious = parseInt(lastSelectedDataSet.openFuturePeriods);
              if((periodTypeCurrent == periodTypePrevious) && (openFuturePeriodsCurrent ==openFuturePeriodsPrevious)){
                this.selectedPeriod = lastSelectedPeriod;
              }
            }
            this.setDataEntrySelectionLabel();
            this.DataSets.setLastSelectedDataSet(selectedDataSet);
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

  preSelectPeriod(selectedDataSet){
    this.preSelectDataSetDataDimension(selectedDataSet);
    let periods = this.PeriodService.getPeriods(selectedDataSet,this.currentPeriodOffset);
    if(periods.length == 0){
      this.currentPeriodOffset = this.currentPeriodOffset + 1;
      periods = this.PeriodService.getPeriods(selectedDataSet,this.currentPeriodOffset);
    }
    this.selectedPeriod = periods[0];
  }


  preSelectDataSetDataDimension(selectedDataSet){
    if(selectedDataSet.categoryCombo.name != 'default'){
      this.selectedDataDimension = [];
      let categoryIndex = 0;
      for(let category of selectedDataSet.categoryCombo.categories){
        this.selectedDataDimension[categoryIndex] = category.categoryOptions[0].id;
        categoryIndex = categoryIndex + 1;
      }
    }
  }


  openPeriodModal(){
    if(this.currentSelectionStatus && this.currentSelectionStatus.period){
      let modal = this.modalCtrl.create(PeriodSelection,{selectedDataSet : this.selectedDataSet,currentPeriodOffset : this.currentPeriodOffset});
      modal.onDidDismiss((selectedPeriodResponse:any) => {
        if(selectedPeriodResponse && selectedPeriodResponse.selectedPeriod){
          if(selectedPeriodResponse.selectedPeriod.name){
            this.DataSets.setLastSelectedDataSetPeriod(selectedPeriodResponse.selectedPeriod);
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

  hasDataDimensionSet(){
    let result = true;
    if(this.selectedDataSet.categoryCombo.name != 'default'){
      if(this.selectedDataDimension.length > 0 && (this.selectedDataDimension.length == this.selectedDataSet.categoryCombo.categories.length)){
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

}
