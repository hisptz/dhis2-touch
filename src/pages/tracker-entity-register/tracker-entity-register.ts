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
  isRegistrationProcessingRunning : boolean;
  loadingMessage : string;

  incidentDate : any;
  enrollmentDate : any;
  dataObject : any;
  trackedEntityAttributeValuesObject : any;

  isFormReady : boolean;

  constructor(private navCtrl: NavController, private navParams: NavParams,
              private userProvider : UserProvider,private appProvider : AppProvider,
              private programsProvider : ProgramsProvider,
              private organisationUnitsProvider : OrganisationUnitsProvider,
              private trackerCaptureProvider : TrackerCaptureProvider) {
  }

  ngOnInit(){
    this.isFormReady = false;
    this.loadingMessage = "Loading user information";
    this.isLoading = true;
    this.isRegistrationProcessingRunning  = false;
    let today = ((new Date()).toISOString()).split('T')[0];
    this.dataObject = {};
    this.trackedEntityAttributeValuesObject = {};
    this.incidentDate = today;
    this.enrollmentDate = today;
    this.registrationContents = this.getRegistrationContents();
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

  resetRegistration(){
    let today = ((new Date()).toISOString()).split('T')[0];
    this.dataObject = {};
    this.trackedEntityAttributeValuesObject = {};
    this.incidentDate = today;
    this.enrollmentDate = today;
    this.registrationContents = this.getRegistrationContents();
    this.registrationContents.forEach(registrationContent=>{
      this.isRegistrationContentOpen[registrationContent.id] = true;
    });
    this.isFormReady = this.isALlRequiredFieldHasValue(this.programTrackedEntityAttributes,this.trackedEntityAttributeValuesObject);
  }

  loadTrackedEntityRegistration(programId,currentUser){
    this.loadingMessage = "Loading registration form " + this.currentProgram.name;
    this.isLoading = true;
    this.trackerCaptureProvider.getTrackedEntityRegistration(programId,currentUser).then((programTrackedEntityAttributes : any)=>{
      this.programTrackedEntityAttributes = programTrackedEntityAttributes;
      this.isLoading = false;
      this.resetRegistration();
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

  updateData(updateDataValue){
    let id = updateDataValue.id.split("-")[0];
    this.trackedEntityAttributeValuesObject[id] = updateDataValue.value;
    this.dataObject[updateDataValue.id] = updateDataValue;
    this.isFormReady = this.isALlRequiredFieldHasValue(this.programTrackedEntityAttributes,this.trackedEntityAttributeValuesObject);
  }

  registerEntity(){
    this.isRegistrationProcessingRunning = true;
    let trackedEntityAttributeValues = [];
    Object.keys(this.trackedEntityAttributeValuesObject).forEach(key=>{
      trackedEntityAttributeValues.push({
        value : this.trackedEntityAttributeValuesObject[key],attribute : key
      })
    });
    this.trackerCaptureProvider.saveTrackedEntityRegistration(this.incidentDate,this.enrollmentDate,trackedEntityAttributeValues,this.currentUser).then((reseponse : any)=>{
      this.isRegistrationProcessingRunning = false;
      this.navCtrl.pop().then(()=>{
        this.appProvider.setNormalNotification("Registration has been completed");
      }).catch(error=>{
        console.log(JSON.stringify(error))
      });
    }).catch(error=>{
      this.isRegistrationProcessingRunning = false;
      this.appProvider.setNormalNotification("Fail to register a new case");
      console.log(JSON.stringify(error));
    });
  }

  cancelRegistration(){
    this.navCtrl.pop();
  }

  isALlRequiredFieldHasValue(programTrackedEntityAttributes,trackedEntityAttributeValuesObject){
    let result = true;
    programTrackedEntityAttributes.forEach((programTrackedEntityAttribute : any)=>{
      if(programTrackedEntityAttribute && programTrackedEntityAttribute.mandatory && programTrackedEntityAttribute.trackedEntityAttribute && programTrackedEntityAttribute.trackedEntityAttribute.id){
        if(!trackedEntityAttributeValuesObject[programTrackedEntityAttribute.trackedEntityAttribute.id]){
          result = false;
        }
      }
    });
    return result;
  }

}

