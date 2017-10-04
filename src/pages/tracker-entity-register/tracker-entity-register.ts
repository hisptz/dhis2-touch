import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {TrackerCaptureProvider} from "../../providers/tracker-capture/tracker-capture";
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";
import {ProgramsProvider} from "../../providers/programs/programs";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";

/**
 * Generated class for the TrackerEntityRegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tracker-entity-register',
  templateUrl: 'tracker-entity-register.html',
})
export class TrackerEntityRegisterPage implements OnInit{

  currentProgram : any;
  currentOrganisationUnit : any;
  currentUser : any;

  isLoading : boolean;
  loadingMessage : string;

  constructor(private navCtrl: NavController, private navParams: NavParams,
              private userProvider : UserProvider,private appProvider : AppProvider,
              private programsProvider : ProgramsProvider,
              private organisationUnitsProvider : OrganisationUnitsProvider,
              private trackerCaptureProvider : TrackerCaptureProvider) {
  }

  ngOnInit(){
    this.loadingMessage = "Loading user information";
    this.isLoading = true;

    this.currentOrganisationUnit = this.organisationUnitsProvider.lastSelectedOrgUnit;
    this.currentProgram = this.programsProvider.getLastSelectedProgram();

    this.userProvider.getCurrentUser().then((user)=>{

    }).catch(error=>{
      console.log(error);
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to load user information");
    });
  }




}

