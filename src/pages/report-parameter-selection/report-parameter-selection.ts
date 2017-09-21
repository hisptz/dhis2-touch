import {Component, OnInit} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {PeriodSelectionProvider} from "../../providers/period-selection/period-selection";
import {PeriodSelectionPage} from "../period-selection/period-selection";
import {ReportViewPage} from "../report-view/report-view";
import {Observable} from "rxjs/Observable";
import {StandardReportProvider} from "../../providers/standard-report/standard-report";

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

  reportId : string;
  reportName : string;
  reportParams : any;
  currentUser : any;
  loadingData : boolean = false;
  selectedOrganisationUnitLabel :string;
  selectedPeriodLabel : string;
  selectedPeriod : any = {};
  selectedOrgUnit : any;
  icons: any = {};
  periodReady: boolean = false;
  orgUnitReady: boolean = false;
  reportPeriodType : any;

  constructor( private user: UserProvider, private modalCtrl : ModalController, private params: NavParams,private navCtrl: NavController,
               private organisationUnitsProvider: OrganisationUnitsProvider, private periodSelectionProvider: PeriodSelectionProvider,
                private standardReportProvider:StandardReportProvider) {
  }

  ngOnInit(){
    this.icons.orgUnit = "assets/reports/orgUnit.png";
    this.icons.period = "assets/reports/period.png";
    this.icons.report = "assets/reports/reports.png";

    this.reportName = this.params.get('name');
    this.reportId = this.params.get("id");
    this.reportParams = this.params.get("reportParams");
    this.reportPeriodType  = this.standardReportProvider.getReportPeriodType(this.params.get("relativePeriods"));
    this.user.getCurrentUser().then((user)=>{
      this.currentUser = user;
      this.updateReportParameterSelections();
    });
  }

  updateReportParameterSelections() {
    if (this.organisationUnitsProvider.lastSelectedOrgUnit) {
      this.selectedOrgUnit = this.organisationUnitsProvider.lastSelectedOrgUnit;
      this.selectedOrganisationUnitLabel = this.selectedOrgUnit.name;
      this.orgUnitReady = true;
    } else {
      this.selectedOrganisationUnitLabel = "Touch to select organisation Unit";
    }
    if (this.periodSelectionProvider.lastSelectedPeriod) {
      this.selectedPeriodLabel = this.periodSelectionProvider.lastSelectedPeriod;
      this.periodReady = true;
    } else {
      this.selectedPeriodLabel = "Touch to select Period";
    }
  }

  openOrganisationUnitTree(){
    let modal = this.modalCtrl.create('OrganisationUnitSelectionPage',{});
    modal.onDidDismiss((selectedOrgUnit : any)=>{
      if(selectedOrgUnit && selectedOrgUnit.id){
        this.selectedOrgUnit = selectedOrgUnit;
        this.orgUnitReady = true;
        this.updateReportParameterSelections();
      }
    });
    modal.present();
  }


  openReportPeriodSelection(){
    if(this.selectedOrganisationUnitLabel){
      let modal = this.modalCtrl.create('PeriodSelectionPage',{
        periodType: this.reportPeriodType ,
        currentPeriodOffset : 0,
        openFuturePeriods: 1,
        currentPeriod : this.selectedPeriod,
      });
      modal.onDidDismiss((selectedPeriod:any) => {
        if(selectedPeriod){
          this.selectedPeriod = selectedPeriod;
          this.periodReady = true;
          this.updateReportParameterSelections();
        }
      });
      modal.present();
    }
  }

  goToView(){
    let parameter = {
      id : this.reportId,
      name : this.reportName,
      period : (this.reportParams.paramReportingPeriod && this.selectedPeriod && this.selectedPeriod.name ) ? this.selectedPeriod : null,
      organisationUnit : (this.reportParams.paramOrganisationUnit && this.selectedOrgUnit && this.selectedOrgUnit.id )? this.selectedOrgUnit : null,
      organisationUnitChildren :[]
    };
    this.navCtrl.push('ReportViewPage',parameter);
  }


}
