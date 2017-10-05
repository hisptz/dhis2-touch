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

  programTrackedEntityAttributes : Array<any>;
  registrationContents : Array<any>;
  isRegistrationContentOpen : any = {};
  isLoading : boolean;
  loadingMessage : string;
  today : any;

  incidentDate : any;
  enrollmentDate : any;

  constructor(private navCtrl: NavController, private navParams: NavParams,
              private userProvider : UserProvider,private appProvider : AppProvider,
              private programsProvider : ProgramsProvider,
              private organisationUnitsProvider : OrganisationUnitsProvider,
              private trackerCaptureProvider : TrackerCaptureProvider) {
  }

  ngOnInit(){
    this.loadingMessage = "Loading user information";
    this.isLoading = true;
    this.incidentDate = (new Date()).toISOString();
    this.enrollmentDate = (new Date()).toISOString();
    this.registrationContents = this.getRegistrationContents();
    this.toggleRegistrationContents(this.registrationContents[0]);
    this.currentOrganisationUnit = this.organisationUnitsProvider.lastSelectedOrgUnit;
    this.currentProgram = this.programsProvider.getLastSelectedProgram();
    this.userProvider.getCurrentUser().then((user)=>{
      this.currentUser = user;
      this.loadTrackedEntityRegistration(this.currentProgram.id,this.currentUser);
    }).catch(error=>{
      console.log(error);
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to load user information");
    });
  }

  loadTrackedEntityRegistration(programId,currentUser){
    this.loadingMessage = "Loading registration form " + this.currentProgram.name;
    this.isLoading = true;
    this.trackerCaptureProvider.getTrackedEntityRegistration(programId,currentUser).then((programTrackedEntityAttributes : any)=>{
      this.programTrackedEntityAttributes = programTrackedEntityAttributes;
      this.isLoading = false;
    }).catch(error=>{
      this.isLoading = false;
      console.log(JSON.stringify(error));
      this.appProvider.setNormalNotification("Fail to load registration form for " + this.currentProgram.name);
    });
  }


  getRegistrationContents(){
    return [
      {id : 'enrollment',name : 'Enrollment',icon: 'assets/'},
      {id : 'profile',name : 'profile',icon: 'assets/'},
    ];
  }

  toggleRegistrationContents(content){
    if(content && content.id){
      if(this.isRegistrationContentOpen[content.id]){
        this.isRegistrationContentOpen[content.id] = false;
      }else{
        Object.keys(this.isRegistrationContentOpen).forEach(id=>{
          this.isRegistrationContentOpen[id] = false;
        });
        this.isRegistrationContentOpen[content.id] = true;
      }
    }
  }

}

