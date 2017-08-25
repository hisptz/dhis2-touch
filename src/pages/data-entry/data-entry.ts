import { Component,OnInit } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";

/**
 * Generated class for the DataEntryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-data-entry',
  templateUrl: 'data-entry.html',
})
export class DataEntryPage implements OnInit{

  selectedOrgUnit : any;
  selectedDataSet : any;
  selectedPeriod : any;
  currentUser : any;

  isLoading : boolean;
  loadingMessage : string;

  organisationUnitLabel : string;
  dataSetLabel : string;
  periodLabel : string;

  icons : any = {};

  constructor(private navCtrl: NavController,private modalCtrl : ModalController,
              private userProvider : UserProvider,private appProvider : AppProvider,
              private organisationUnitsProvider : OrganisationUnitsProvider) {
  }

  ngOnInit(){

    this.icons.orgUnit = "assets/data-entry/orgUnit.png";
    this.icons.dataSet = "assets/data-entry/form.png";
    this.icons.period = "assets/data-entry/period.png";

    this.loadingMessage = "Loading user information";
    this.isLoading = true;
    this.userProvider.getCurrentUser().then(currentUser=>{
      this.currentUser = currentUser;
      this.updateDataEntryFormSelections();
    },error=>{
      this.isLoading = false;
      this.loadingMessage = "";
      this.appProvider.setNormalNotification("Fail to load user information");
    })

  }

  updateDataEntryFormSelections(){
    if(this.organisationUnitsProvider.lastSelectedOrgUnit){
      this.selectedOrgUnit = this.organisationUnitsProvider.lastSelectedOrgUnit;
      this.organisationUnitLabel = this.selectedOrgUnit.name;
    }else{
      this.organisationUnitLabel = "Touch to select organisation Unit";
    }

    if(this.selectedDataSet && this.selectedDataSet.name){
      this.dataSetLabel = this.selectedDataSet.name;
    }else {
      this.dataSetLabel = "Touch to select entry form";
    }

    if(this.selectedPeriod && this.selectedPeriod.name){
      this.periodLabel = this.selectedPeriod.name;
    }else{
      this.periodLabel = "Touch to select period"
    }

    this.isLoading = false;
    this.loadingMessage = "";
  }

  openOrganisationUnitTree(){
    let modal = this.modalCtrl.create('OrganisationUnitSelectionPage',{});
    modal.onDidDismiss((selectedOrgUnit : any)=>{});
    modal.present();
  }

  openEntryFormList(){
    let modal = this.modalCtrl.create('DataSetSelectionPage',{});
    modal.onDidDismiss((selectedOrgUnit : any)=>{});
    modal.present();
  }

  openPeriodList(){
    let modal = this.modalCtrl.create('PeriodSelectionPage',{});
    modal.onDidDismiss((selectedOrgUnit : any)=>{});
    modal.present();
  }

}
