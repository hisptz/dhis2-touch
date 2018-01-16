import {Component, OnInit} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {PeriodSelectionProvider} from "../../providers/period-selection/period-selection";
import {PeriodSelectionPage} from "../period-selection/period-selection";
import {ReportViewPage} from "../report-view/report-view";
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
  reportPeriodType : any;
  currentPeriodOffset : number = 0;
  isAllReportParameterSet : boolean;
  openFuturePeriods : any;

  constructor( private user: UserProvider, private modalCtrl : ModalController, private params: NavParams,private navCtrl: NavController,
               private organisationUnitsProvider: OrganisationUnitsProvider, private periodSelectionProvider: PeriodSelectionProvider,
                private standardReportProvider:StandardReportProvider) {
  }

  ngOnInit(){
    this.icons.orgUnit = "assets/icon/orgUnit.png";
    this.icons.period = "assets/icon/period.png";
    this.icons.report = "assets/icon/reports.png";
    this.isAllReportParameterSet = false;
    this.openFuturePeriods = this.params.get("openFuturePeriods");
    this.reportName = this.params.get('name');
    this.reportId = this.params.get("id");
    this.reportParams = this.params.get("reportParams");
    this.reportPeriodType  = this.standardReportProvider.getReportPeriodType(this.params.get("relativePeriods"));
    this.user.getCurrentUser().then((user)=>{
      this.currentUser = user;
      this.organisationUnitsProvider.getLastSelectedOrganisationUnitUnit(user).then((lastSelectedOrgunit)=>{
        this.selectedOrgUnit = lastSelectedOrgunit;
        let periods = this.periodSelectionProvider.getPeriods(this.reportPeriodType,this.openFuturePeriods,this.currentPeriodOffset);
        if(periods && periods.length > 0){
          //this.selectedPeriod = periods[0];
        }
        this.updateReportParameterSelections();
      });
    });
  }

  updateReportParameterSelections() {
    if (this.selectedOrgUnit && this.selectedOrgUnit.id) {
      this.selectedOrgUnit = this.organisationUnitsProvider.lastSelectedOrgUnit;
      this.selectedOrganisationUnitLabel = this.selectedOrgUnit.name;
    } else {
      this.selectedOrganisationUnitLabel = "touch_to_select_organisation_unit";
    }
    if (this.selectedPeriod && this.selectedPeriod.name) {
      this.selectedPeriodLabel = this.selectedPeriod.name;

    } else {
      this.selectedPeriodLabel = "touch_to_select_period";
    }
    this.isAllReportParameterSet = this.isAllReportParameterSelected();
  }

  openOrganisationUnitTree(){
    let modal = this.modalCtrl.create('OrganisationUnitSelectionPage',{});
    modal.onDidDismiss((selectedOrgUnit : any)=>{
      if(selectedOrgUnit && selectedOrgUnit.id){
        this.selectedOrgUnit = selectedOrgUnit;
        this.updateReportParameterSelections();
      }
    });
    modal.present();
  }

  openReportPeriodSelection(){
    if(this.selectedOrganisationUnitLabel){
      let modal = this.modalCtrl.create('PeriodSelectionPage',{
        periodType: this.reportPeriodType ,
        currentPeriodOffset : this.currentPeriodOffset,
        openFuturePeriods: this.openFuturePeriods,
        currentPeriod : this.selectedPeriod,
      });
      modal.onDidDismiss((response:any) => {
        if(response && response.selectedPeriod){
          this.selectedPeriod = response.selectedPeriod;
          this.currentPeriodOffset = response.currentPeriodOffset;
          this.updateReportParameterSelections();
        }
      });
      modal.present();
    }
  }

  isAllReportParameterSelected(){
    let isAllReportParameterSet = true;
    if(this.reportParams.paramOrganisationUnit){
      if(!(this.selectedOrgUnit && this.selectedOrgUnit.id)){
        isAllReportParameterSet = false;
      }
    }
    if(this.reportParams.paramReportingPeriod){
      if(!(this.selectedPeriod && this.selectedPeriod.name )){
        isAllReportParameterSet = false;
      }
    }
    return isAllReportParameterSet;
  }

  goToView(){
    let parameter = {
      id : this.reportId,
      name : this.reportName,
      reportType : this.params.get('reportType'),
      period : (this.reportParams.paramReportingPeriod && this.selectedPeriod && this.selectedPeriod.name ) ? this.selectedPeriod : null,
      organisationUnit : (this.reportParams.paramOrganisationUnit && this.selectedOrgUnit && this.selectedOrgUnit.id )? this.selectedOrgUnit : null,
      organisationUnitChildren :[]
    };
    this.navCtrl.push('ReportViewPage',parameter);
  }


}
