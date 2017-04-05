import { Component, OnInit} from '@angular/core';
import { NavController,NavParams,ToastController,ModalController } from 'ionic-angular';
import {ReportView} from "../report-view/report-view";

import {OrganisationUnits} from "../organisation-units/organisation-units";
import {ReportSelectionPeriod} from "../report-selection-period/report-selection-period";
import {OrganisationUnit} from "../../providers/organisation-unit";
import {User} from "../../providers/user";

/*
  Generated class for the ReportParameterSelection page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-report-parameter-selection',
  templateUrl: 'report-parameter-selection.html',
})
export class ReportParameterSelection implements OnInit{

  public reportId : string;
  public reportName : string;
  public reportParams : any;
  public currentUser : any;
  public loadingData : boolean = false;
  public organisationUnits : any;
  public selectedOrganisationUnit :any = {};
  public selectedOrganisationUnitLabel :string;
  public currentSelectionStatus :any = {};
  public selectedPeriodLabel : string;
  public selectedPeriod : any = {};

  constructor(public navCtrl: NavController,private params:NavParams,
              public OrganisationUnit : OrganisationUnit,
              public toastCtrl: ToastController,public modalCtrl: ModalController,
              public user : User) {
  }

  ngOnInit() {
    this.reportName = this.params.get('name');
    this.reportId = this.params.get("id");
    this.reportParams = this.params.get("reportParams");
    this.user.getCurrentUser().then((user)=>{
      this.currentUser = user;
      this.loadOrganisationUnits();

    });
  }

  loadOrganisationUnits(){
    this.currentSelectionStatus.isOrgUnitLoaded = false;
    this.currentSelectionStatus.isPeriodLoaded = true;
    this.OrganisationUnit.getOrganisationUnits(this.currentUser).then((organisationUnits : any)=>{
      this.organisationUnits = organisationUnits;
      this.setReportSelectionLabel();
      this.currentSelectionStatus.isOrgUnitLoaded = true;
    },error=>{
      this.loadingData = false;
      this.setToasterMessage('Fail to load organisation units ');
    });
  }

  openOrganisationUnitModal(){
    let modal = this.modalCtrl.create(OrganisationUnits,{data : this.organisationUnits,selectedOrganisationUnit:this.selectedOrganisationUnit});
    modal.onDidDismiss((selectedOrganisationUnit:any) => {
      if(selectedOrganisationUnit && selectedOrganisationUnit.id){
        if(selectedOrganisationUnit.id != this.selectedOrganisationUnit.id){
          this.selectedOrganisationUnit = selectedOrganisationUnit;
          this.selectedPeriod = {};
          this.setReportSelectionLabel();
        }
      }
    });
    modal.present();
  }

  openReportPeriodSelection(){
    let modal = this.modalCtrl.create(ReportSelectionPeriod,{});
    modal.onDidDismiss((selectedPeriod:any) => {
      if(selectedPeriod && selectedPeriod.iso){
        this.selectedPeriod = selectedPeriod;
        this.setReportSelectionLabel();
      }
    });
    modal.present();
  }

  setReportSelectionLabel(){
    this.setOrganisationSelectLabel();
    this.setSelectedPeriod();
  }

  setOrganisationSelectLabel(){
    if(this.selectedOrganisationUnit.id){
      this.selectedOrganisationUnitLabel = this.selectedOrganisationUnit.name;
      this.currentSelectionStatus.period = true;
      this.currentSelectionStatus.isOrgUnitSelected = true;
    }else{
      this.selectedOrganisationUnitLabel = "Touch to select Organisation Unit";
      this.currentSelectionStatus.isOrgUnitSelected = false;
      this.currentSelectionStatus.period = false;
    }
  }

  setSelectedPeriod(){
    if(this.selectedPeriod.iso){
      this.selectedPeriodLabel = this.selectedPeriod.name;
      this.currentSelectionStatus.isPeriodSelected = true;
    }else{
      this.selectedPeriodLabel = "Touch to select period";
      this.currentSelectionStatus.isPeriodSelected = false;
    }
  }

  ionViewDidLoad() {
    this.currentSelectionStatus.orgUnit = true;
    this.currentSelectionStatus.isOrgUnitSelected = false;
    this.currentSelectionStatus.isOrgUnitLoaded = false;
    this.currentSelectionStatus.period = false;
    this.currentSelectionStatus.isPeriodSelected = false;
    this.currentSelectionStatus.isPeriodLoaded = false;
  }

  goToView(){
    let parameter = {
      id : this.reportId,name : this.reportName,
      period : this.selectedPeriod,
      organisationUnit : this.selectedOrganisationUnit,
      organisationUnitChildren :[]
    };
    this.navCtrl.push(ReportView,parameter);
  }



  setToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton : true
    });
    toast.present();
  }

}
