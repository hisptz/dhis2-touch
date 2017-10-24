import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import {TrackerCaptureProvider} from "../../providers/tracker-capture/tracker-capture";
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";
import {ProgramsProvider} from "../../providers/programs/programs";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {TrackedEntityAttributeValuesProvider} from "../../providers/tracked-entity-attribute-values/tracked-entity-attribute-values";


declare var dhis2: any;
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
  isTrackedEntityRegistered : boolean = false;
  trackedEntityInstance : string;
  icons : any = {};

  constructor(private navCtrl: NavController,
              private userProvider : UserProvider,private appProvider : AppProvider,
              private programsProvider : ProgramsProvider,
              private trackedEntityAttributeValuesProvider : TrackedEntityAttributeValuesProvider,
              private organisationUnitsProvider : OrganisationUnitsProvider,
              private trackerCaptureProvider : TrackerCaptureProvider) {
  }

  ngOnInit(){
    this.icons["addNewCase"] = "assets/tracker/add-new-case.png";
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
    this.isTrackedEntityRegistered = false;
    if(this.registrationContents.length > 0){
      this.toggleRegistrationContents(this.registrationContents[0]);
    }
    this.trackedEntityInstance =  dhis2.util.uid();
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
      {id : 'enrollment',name : 'Enrollment',icon: 'assets/tracker/profile.png'},
    ];
  }

  //@todo hide key board
  toggleRegistrationContents(content){
    if(content && content.id){
      if(!this.isRegistrationContentOpen[content.id]){
        Object.keys(this.isRegistrationContentOpen).forEach(id=>{
          this.isRegistrationContentOpen[id] = false;
        });
      }
      this.isRegistrationContentOpen[content.id] = true;
    }
  }

  //@todo changes of enrollments as well
  updateData(updateDataValue){
    let id = updateDataValue.id.split("-")[0];
    this.trackedEntityAttributeValuesObject[id] = updateDataValue.value;
    this.dataObject[updateDataValue.id] = updateDataValue;
    let isFormReady = this.isALlRequiredFieldHasValue(this.programTrackedEntityAttributes,this.trackedEntityAttributeValuesObject);
    if(isFormReady){
      this.registerEntity();
    }
  }

  registerEntity(){
    let trackedEntityAttributeValues = [];
    Object.keys(this.trackedEntityAttributeValuesObject).forEach(key=>{
      trackedEntityAttributeValues.push({
        value : this.trackedEntityAttributeValuesObject[key],attribute : key
      })
    });
    //@todo color codes changes on saving
    if(this.isTrackedEntityRegistered){
      this.trackedEntityAttributeValuesProvider.savingTrackedEntityAttributeValues(this.trackedEntityInstance,trackedEntityAttributeValues,this.currentUser).then(()=>{
      }).catch(error=>{
        console.log(JSON.stringify(error));
      });
    }else{
      this.trackerCaptureProvider.saveTrackedEntityRegistration(this.incidentDate,this.enrollmentDate,this.currentUser,this.trackedEntityInstance).then((reseponse : any)=>{
        this.appProvider.setNormalNotification("A case has been saved successfully");
        this.isTrackedEntityRegistered = true;

        this.registerEntity();
      }).catch(error=>{
        this.appProvider.setNormalNotification("Fail to save a case");
        console.log(JSON.stringify(error));
      });
    }
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

