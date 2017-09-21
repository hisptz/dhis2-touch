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

  public reportId : string;
  public reportName : string;
  public reportParams : any;
  public reportPeriods : any;
  public currentUser : any;
  public loadingData : boolean = false;
  public organisationUnits : any;
  public selectedOrganisationUnit :any = {};
  public selectedOrganisationUnitLabel :string;
  public currentSelectionStatus :any = {};
  public selectedPeriodLabel : string;
  public selectedPeriod : any = {};
  selectedOrgUnit : any;
  organisationUnitLabel: string;
  periodLabel: string;
  icons: any = {};
  periodReady: boolean = false;
  orgUnitReady: boolean = false;
  requireReportParameterorgUnit: boolean = true;
  requireReportParameterperiod: boolean = true;
  periodTypeSelected: any;

  constructor( public user: UserProvider, private modalCtrl : ModalController, public params: NavParams,public navCtrl: NavController,
               public organisationUnitsProvider: OrganisationUnitsProvider, public periodSelectionProvider: PeriodSelectionProvider,
                public standardReportProvider:StandardReportProvider) {
  }

  ngOnInit(){
    this.icons.orgUnit = "assets/reports/orgUnit.png";
    this.icons.period = "assets/reports/period.png";
    this.icons.report = "assets/reports/reports.png";

    this.reportName = this.params.get('name');
    this.reportId = this.params.get("id");
    this.reportParams = this.params.get("reportParams");
    this.reportPeriods = this.params.get("periodType");
    this.showRequiredFields();
    this.standardReportProvider.fetchReportsRelativePeriods(this.reportPeriods);
    this.periodTypeSelected = this.standardReportProvider.getFetchedPeriodType();

    this.user.getCurrentUser().then((user)=>{
      this.currentUser = user;
    });
    this.updateEventSelections();
  }

  showRequiredFields(){
    if(this.reportParams.paramOrganisationUnit){
      this.requireReportParameterorgUnit = true;
    }else{
      this.requireReportParameterorgUnit = false;
    }
      if(this.reportParams.paramReportingPeriod){
        this.requireReportParameterperiod = true;
      }else{
        this.requireReportParameterperiod = false;
      }
  }



  updateEventSelections() {
    if (this.organisationUnitsProvider.lastSelectedOrgUnit) {
      this.selectedOrgUnit = this.organisationUnitsProvider.lastSelectedOrgUnit;
      this.selectedOrganisationUnitLabel = this.selectedOrgUnit.name;
      this.orgUnitReady = true;
    } else {
      this.selectedOrganisationUnitLabel = "Touch to select organisation Unit";
    }
    if (this.periodSelectionProvider.lastSelectedPeriod) {
      this.selectedPeriodLabel = this.periodSelectionProvider.lastSelectedPeriod
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
        this.updateEventSelections();
      }
    });
    modal.present();
  }


  openReportPeriodSelection(){
    if(this.selectedOrganisationUnitLabel){
      let modal = this.modalCtrl.create('PeriodSelectionPage',{
        periodType: this.periodTypeSelected,
        currentPeriodOffset : 0,
        openFuturePeriods: 1,
        currentPeriod : this.selectedPeriod,
      });
      modal.onDidDismiss((selectedPeriod:any) => {
        if(selectedPeriod){
          this.selectedPeriod = selectedPeriod.name;
          this.periodReady = true;
          this.updateEventSelections();
        }
      });
      modal.present();
    }
  }

  goToView(){
    if(this.reportParams.paramOrganisationUnit && this.reportParams.paramReportingPeriod){
      let parameter = {
        id : this.reportId,
        name : this.reportName,
        period : this.selectedPeriod,
        organisationUnit : this.selectedOrganisationUnit,
        organisationUnitChildren :[]
      };
      this.navCtrl.push('ReportViewPage',parameter);

    }else if(this.reportParams.paramOrganisationUnit && !this.reportParams.paramReportingPeriod){
      let parameter = {
        id : this.reportId,
        name : this.reportName,
        period : null,
        organisationUnit : this.selectedOrganisationUnit,
        organisationUnitChildren :[]
      };
      this.navCtrl.push('ReportViewPage',parameter);

    }else if(!this.reportParams.paramOrganisationUnit && this.reportParams.paramReportingPeriod){
      let parameter = {
        id : this.reportId,
        name : this.reportName,
        period : this.selectedPeriod,
        organisationUnit : null,
        organisationUnitChildren :[]
      };
      this.navCtrl.push('ReportViewPage',parameter);

    }
  }


}
