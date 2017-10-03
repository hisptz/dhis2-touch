import {Component, OnInit} from '@angular/core';
import {IonicPage, ModalController, NavController} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";

/**
 * Generated class for the TrackerCapturePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tracker-capture',
  templateUrl: 'tracker-capture.html',
})
export class TrackerCapturePage implements OnInit{

  selectedOrgUnit : any;
  selectedProgram : any;
  currentUser: any;
  programIdsByUserRoles: Array<string>;
  isLoading : boolean;
  loadingMessage : string;
  organisationUnitLabel: string;
  programLabel: string;
  isFormReady : boolean;
  isProgramDimensionApplicable : boolean;
  programDimensionNotApplicablableMessage : string;
  programCategoryCombo : any;
  selectedDataDimension : Array<any>;
  icons : any = {};

  //WITH_REGISTRATION  WITHOUT_REGISTRATION

  constructor(public navCtrl: NavController,private modalCtrl : ModalController,
              private userProvider : UserProvider,private appProvider : AppProvider,
              private organisationUnitsProvider : OrganisationUnitsProvider) {
  }

  ionViewDidLoad() {
  }

  ngOnInit(){
    this.icons.orgUnit = "assets/data-entry/orgUnit.png";
    this.icons.program = "";

    this.loadingMessage = "Loading. user information";
    this.isLoading = true;
    this.isProgramDimensionApplicable = false;
    this.userProvider.getCurrentUser().then((currentUser: any)=>{
      this.currentUser = currentUser;
      this.userProvider.getUserData().then((userData : any)=>{
        this.programIdsByUserRoles = [];
        userData.userRoles.forEach((userRole:any)=>{
          if (userRole.programs) {
            userRole.programs.forEach((program:any)=>{
              this.programIdsByUserRoles.push(program.id);
            });
          }
        });
        this.organisationUnitsProvider.getLastSelectedOrganisationUnitUnit(currentUser).then((lastSelectedOrgunit)=>{
          this.selectedOrgUnit = lastSelectedOrgunit;
          this.updateTrackerCaptureSelections();
        });
      });
    },error=>{
      this.isLoading = false;
      this.loadingMessage = "";
      this.appProvider.setNormalNotification("Fail to load user information");
    })
  }

  updateTrackerCaptureSelections(){
    if(this.organisationUnitsProvider.lastSelectedOrgUnit){
      this.selectedOrgUnit = this.organisationUnitsProvider.lastSelectedOrgUnit;
      this.organisationUnitLabel = this.selectedOrgUnit.name;
    }else{
      this.organisationUnitLabel = "Touch to select organisation Unit";
    }


    this.isLoading = false;
    this.loadingMessage = "";
  }

  openOrganisationUnitTree(){
    let modal = this.modalCtrl.create('OrganisationUnitSelectionPage',{});
    modal.onDidDismiss((selectedOrgUnit : any)=>{
      if(selectedOrgUnit && selectedOrgUnit.id){
        this.selectedOrgUnit = selectedOrgUnit;
        this.updateTrackerCaptureSelections();
      }
    });
    modal.present();
  }



}
