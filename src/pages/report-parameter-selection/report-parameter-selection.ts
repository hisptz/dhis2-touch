import {Component, OnInit} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {AppProvider} from "../../providers/app/app";
import {ReportViewPage} from "../report-view/report-view";
import {OrganisationUnitTreeComponent} from "../../components/organisation-unit-tree/organisation-unit-tree";
import {PeriodSelectionComponent} from "../../components/period-selection/period-selection";

/**
 * Generated class for the ReportParameterSelectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report-parameter-selection',
  templateUrl: 'report-parameter-selection.html',
})
export class ReportParameterSelectionPage implements OnInit{

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public user: UserProvider, public orgUnitProvider: OrganisationUnitsProvider,
              public appProvider: AppProvider, public modalCtrl: ModalController) {
  }

  ngOnInit(){
    this.reportName = this.navParams.get('name');
    this.reportId = this.navParams.get("id");
    this.reportParams = this.navParams.get("reportParams");
    this.user.getCurrentUser().then((user)=>{
      this.currentUser = user;
      this.loadOrganisationUnits();

    });
  }

  ionViewDidLoad() {
    this.currentSelectionStatus.orgUnit = true;
    this.currentSelectionStatus.isOrgUnitSelected = false;
    this.currentSelectionStatus.isOrgUnitLoaded = false;
    this.currentSelectionStatus.period = false;
    this.currentSelectionStatus.isPeriodSelected = false;
    this.currentSelectionStatus.isPeriodLoaded = true;
  }

  loadOrganisationUnits(){
    this.currentSelectionStatus.isOrgUnitLoaded = false;
    this.currentSelectionStatus.isPeriodLoaded = true;
    this.orgUnitProvider.getOrganisationUnits(this.currentUser).then((organisationUnitsResponse : any)=>{
      this.organisationUnits = organisationUnitsResponse.organisationUnits;
      this.selectedOrganisationUnit = organisationUnitsResponse.lastSelectedOrgUnit;
      this.setReportSelectionLabel();
      this.currentSelectionStatus.isOrgUnitLoaded = true;
    },error=>{
      this.loadingData = false;
      this.appProvider.setNormalNotification('Fail to load organisation units ');
    });
  }

  openOrganisationUnitModal(){
    if(this.currentSelectionStatus && this.currentSelectionStatus.orgUnit){
      let modal = this.modalCtrl.create(OrganisationUnitTreeComponent,{
        organisationUnits : this.organisationUnits,
        currentUser : this.currentUser,
        lastSelectedOrgUnit:this.selectedOrganisationUnit
      });
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
  }

  openReportPeriodSelection(){
    if(this.currentSelectionStatus && this.currentSelectionStatus.period){
      let modal = this.modalCtrl.create(PeriodSelectionComponent,{});
      modal.onDidDismiss((selectedPeriod:any) => {
        if(selectedPeriod && selectedPeriod.iso){
          this.selectedPeriod = selectedPeriod;
          this.setReportSelectionLabel();
        }
      });
      modal.present();
    }
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


  goToView(){
    let parameter = {
      id : this.reportId,name : this.reportName,
      period : this.selectedPeriod,
      organisationUnit : this.selectedOrganisationUnit,
      organisationUnitChildren :[]
    };
    this.navCtrl.push(ReportViewPage,parameter);
  }




}
