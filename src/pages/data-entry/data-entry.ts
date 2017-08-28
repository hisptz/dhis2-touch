import { Component,OnInit } from '@angular/core';
import {IonicPage, ModalController, NavController} from 'ionic-angular';
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";
import {DataSetsProvider} from "../../providers/data-sets/data-sets";
import {PeriodSelectionProvider} from "../../providers/period-selection/period-selection";

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

  dataSetIdsByUserRoles : Array<any>;
  dataSets : Array<any>;

  currentPeriodOffset : number;

  icons : any = {};

  constructor(private navCtrl: NavController,private modalCtrl : ModalController,
              private userProvider : UserProvider,private appProvider : AppProvider,
              private dataSetProvider : DataSetsProvider,private periodSelection : PeriodSelectionProvider,
              private organisationUnitsProvider : OrganisationUnitsProvider) {
  }

  ngOnInit(){
    this.icons.orgUnit = "assets/data-entry/orgUnit.png";
    this.icons.dataSet = "assets/data-entry/form.png";
    this.icons.period = "assets/data-entry/period.png";

    this.loadingMessage = "Loading user information";
    this.isLoading = true;
    this.currentPeriodOffset = 0;

    this.userProvider.getCurrentUser().then((currentUser: any)=>{
      this.currentUser = currentUser;
      this.userProvider.getUserData().then((userData : any)=>{
        this.dataSetIdsByUserRoles = [];
        userData.userRoles.forEach((userRole:any)=>{
          if (userRole.dataSets) {
            userRole.dataSets.forEach((dataSet:any)=>{
              this.dataSetIdsByUserRoles.push(dataSet.id);
            });
          }
        });
        this.organisationUnitsProvider.getLastSelectedOrganisationUnitUnit(currentUser).then((lastSelectedOrgunit)=>{
          this.selectedOrgUnit = lastSelectedOrgunit;
          this.updateDataEntryFormSelections();
          this.loadingEntryForm();
        });
        this.updateDataEntryFormSelections();
      });
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
    modal.onDidDismiss((selectedOrgUnit : any)=>{
      if(selectedOrgUnit && selectedOrgUnit.id){
        this.selectedOrgUnit = selectedOrgUnit;
        this.updateDataEntryFormSelections();
        this.loadingEntryForm();
      }
    });
    modal.present();
  }

  loadingEntryForm(){
    this.dataSetProvider.getAssignedDataSets(this.selectedOrgUnit.id,this.dataSetIdsByUserRoles,this.currentUser).then((dataSets: any)=>{
      this.dataSets = dataSets;
      this.selectedDataSet = this.dataSetProvider.lastSelectedDataSet;
      this.updateDataEntryFormSelections();
      this.loadPeriodSelection();
    },error=>{
      this.appProvider.setNormalNotification("Fail to reload entry form");
    });
  }

  openEntryFormList(){
    if(this.dataSets && this.dataSets.length > 0){
      let modal = this.modalCtrl.create('DataSetSelectionPage',{dataSetsList : this.dataSets,currentDataSet :this.selectedDataSet.name  });
      modal.onDidDismiss((selectedDataSet : any)=>{
        if(selectedDataSet && selectedDataSet.id && selectedDataSet.id != this.selectedDataSet.id){
          this.selectedDataSet = selectedDataSet;
          this.currentPeriodOffset = 0;
          this.updateDataEntryFormSelections();
          this.loadPeriodSelection();
        }
      });
      modal.present();
    }else{
      this.appProvider.setNormalNotification("There are no entry form to select on " + this.selectedOrgUnit.name );
    }
  }

  loadPeriodSelection(){
    let periodType = this.selectedDataSet.periodType;
    let openFuturePeriods = parseInt(this.selectedDataSet.openFuturePeriods);

    let periods = this.periodSelection.getPeriods(periodType,openFuturePeriods,this.currentPeriodOffset);
    if(periods && periods.length > 0){
      this.selectedPeriod = periods[0];
    }
    this.updateDataEntryFormSelections();
  }

  openPeriodList(){
    if(this.selectedDataSet && this.selectedDataSet.id){
      let modal = this.modalCtrl.create('PeriodSelectionPage', {
        periodType: this.selectedDataSet.periodType,
        currentPeriodOffset : this.currentPeriodOffset,
        openFuturePeriods: this.selectedDataSet.openFuturePeriods
      });
      modal.onDidDismiss((selectedOrgUnit : any)=>{});
      modal.present();
    }else{
      this.appProvider.setNormalNotification("Please select entry form first");
    }
  }

}
