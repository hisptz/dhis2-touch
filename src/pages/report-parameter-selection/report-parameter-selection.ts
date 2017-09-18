import {Component, OnInit} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {PeriodSelectionProvider} from "../../providers/period-selection/period-selection";
import {PeriodSelectionPage} from "../period-selection/period-selection";
import {ReportViewPage} from "../report-view/report-view";

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
  selectedOrgUnit : any;
  organisationUnitLabel: string;
  periodLabel: string;

  constructor( public user: UserProvider, private modalCtrl : ModalController, public params: NavParams,public navCtrl: NavController,
               public organisationUnitsProvider: OrganisationUnitsProvider, public periodSelectionProvider: PeriodSelectionProvider) {
  }

  ngOnInit(){

    this.reportName = this.params.get('name');
    this.reportId = this.params.get("id");
    this.reportParams = this.params.get("reportParams");
    this.user.getCurrentUser().then((user)=>{
      this.currentUser = user;
    });
    this.updateEventSelections();
  }

  updateEventSelections() {
    if (this.organisationUnitsProvider.lastSelectedOrgUnit) {
      this.selectedOrgUnit = this.organisationUnitsProvider.lastSelectedOrgUnit;
      this.selectedOrganisationUnitLabel = this.selectedOrgUnit.name;
    } else {
      this.selectedOrganisationUnitLabel = "Touch to select organisation Unit";
    }
    if (this.periodSelectionProvider.lastSelectedPeriod) {
      this.selectedPeriodLabel = this.periodSelectionProvider.lastSelectedPeriod;
    } else {
      this.selectedPeriodLabel = "Touch to select Period";
    }
  }

  openOrganisationUnitTree(){
    let modal = this.modalCtrl.create('OrganisationUnitSelectionPage',{});
    modal.onDidDismiss((selectedOrgUnit : any)=>{
      if(selectedOrgUnit && selectedOrgUnit.id){
        this.selectedOrgUnit = selectedOrgUnit;
        this.updateEventSelections();
      }
    });
    modal.present();
  }


  openReportPeriodSelection(){
    if(this.currentSelectionStatus && this.currentSelectionStatus.period){
      let modal = this.modalCtrl.create(PeriodSelectionPage,{});
      modal.onDidDismiss((selectedPeriod:any) => {
        if(selectedPeriod && selectedPeriod.iso){
          this.selectedPeriod = selectedPeriod;
          this.updateEventSelections();
        }
      });
      modal.present();
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
