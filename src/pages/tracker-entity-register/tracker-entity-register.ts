import {Component, OnInit, ViewChild} from '@angular/core';
import {ActionSheetController, Content, IonicPage, ModalController, NavController} from 'ionic-angular';
import {TrackerCaptureProvider} from "../../providers/tracker-capture/tracker-capture";
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";
import {ProgramsProvider} from "../../providers/programs/programs";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {TrackedEntityAttributeValuesProvider} from "../../providers/tracked-entity-attribute-values/tracked-entity-attribute-values";
import {EventCaptureFormProvider} from "../../providers/event-capture-form/event-capture-form";


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
  dashboardWidgets : Array<any>;
  programStages : Array<any>;
  isDashboardWidgetOpen : any = {};
  isLoading : boolean;
  isRegistrationProcessingRunning : boolean;
  loadingMessage : string;

  incidentDate : any;
  enrollmentDate : any;
  dataObject : any;
  trackedEntityAttributesSavingStatusClass : any;
  trackedEntityAttributeValuesObject : any;
  isTrackedEntityRegistered : boolean = false;
  trackedEntityInstance : string;
  icons : any = {};

  currentWidget : any;
  currentWidgetIndex : any;

  @ViewChild(Content) content: Content;

  constructor(private navCtrl: NavController,
              private modalCtrl : ModalController,
              private actionSheetCtrl: ActionSheetController,
              private eventCaptureFormProvider : EventCaptureFormProvider,
              private userProvider : UserProvider,private appProvider : AppProvider,
              private programsProvider : ProgramsProvider,
              private trackedEntityAttributeValuesProvider : TrackedEntityAttributeValuesProvider,
              private organisationUnitsProvider : OrganisationUnitsProvider,
              private trackerCaptureProvider : TrackerCaptureProvider) {
  }

  ngOnInit(){
    this.icons["addNewCase"] = "assets/tracker/add-new-case.png";
    this.icons["menu"] = "assets/dashboard/menu.png";
    this.loadingMessage = "Loading user information";
    this.isLoading = true;
    this.isRegistrationProcessingRunning  = false;
    let today = ((new Date()).toISOString()).split('T')[0];
    this.dataObject = {};
    this.trackedEntityAttributesSavingStatusClass = {};
    this.trackedEntityAttributeValuesObject = {};
    this.incidentDate = today;
    this.enrollmentDate = today;
    this.dashboardWidgets = this.getDashboardWidgets();
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
    this.dashboardWidgets = this.getDashboardWidgets();
    this.isTrackedEntityRegistered = false;
    if(this.dashboardWidgets.length > 0){
      this.changeDashboardWidget(this.dashboardWidgets[0]);
    }
    this.trackedEntityInstance =  dhis2.util.uid();
    this.loadingProgramStages(this.currentProgram.id,this.currentUser);
  }

  loadingProgramStages(programId,currentUser){
    this.loadingMessage = "Loading program stages " + this.currentProgram.name;
    this.eventCaptureFormProvider.getProgramStages(programId,currentUser).then((programStages : any)=>{
      this.programStages = programStages;
      if(programStages && programStages.length > 0){
        let counter = 1;
        programStages.forEach((programStage : any)=>{
          this.dashboardWidgets.push({id : programStage.id,name : programStage.name,iconName: counter});
          counter ++;
        })
      }
    }).catch(error=>{
      console.log(JSON.stringify(error));
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to load program stages " + this.currentProgram.name);
    });
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

  getDashboardWidgets(){
    return [
      {id : 'enrollment',name : 'Enrollment & Profile',icon: 'assets/tracker/profile.png'}
    ];
  }

  openWidgetList(){
    if(this.isTrackedEntityRegistered){
      let modal = this.modalCtrl.create('TrackedEntityWidgetSelectionPage',{
        dashboardWidgets : this.dashboardWidgets,
        currentWidget : this.currentWidget
      });
      modal.onDidDismiss((currentWidget : any)=>{
        this.changeDashboardWidget(currentWidget);
        setTimeout(() => {
          this.content.scrollToTop(1300);
        },200);
      });
      modal.present();
    }else{
      this.appProvider.setNormalNotification("A case has not yet registered");
    }
  }

  updateWidgetPagination(widgetIndex){
    let widget = this.dashboardWidgets[widgetIndex];
    if(widget && widget.id){
      this.changeDashboardWidget(widget);
    }
  }

  changeDashboardWidget(content){
    if(content && content.id){
      this.currentWidgetIndex = this.dashboardWidgets.indexOf(content);
      this.currentWidget = content;
      if(!this.isDashboardWidgetOpen[content.id]){
        Object.keys(this.isDashboardWidgetOpen).forEach(id=>{
          this.isDashboardWidgetOpen[id] = false;
        });
      }
      this.isDashboardWidgetOpen[content.id] = true;
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

  deleteTrackedEntity(trackedEntityInstanceId){
    const actionSheet = this.actionSheetCtrl.create({
      title: 'You are about to delete all information related to this tracked entity instance, are you sure?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.isLoading = true;
            this.loadingMessage = "Deleting all information related to this tracked entity instance";
            this.trackerCaptureProvider.deleteTrackedEntityInstance(trackedEntityInstanceId,this.currentUser).then(()=>{
              this.navCtrl.pop();
              this.appProvider.setNormalNotification("Tracked entity instance has been delete successfully");
            }).catch(error=>{
              this.isLoading = false;
              console.log(JSON.stringify(error));
              this.appProvider.setNormalNotification("Fail to delete all information related to this tracked entity instance")
            });
          }
        },{
          text: 'No',
          handler: () => {}
        }
      ]
    });
    actionSheet.present();
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
      let caseName = "case";
      if(this.currentProgram.trackedEntity.displayName && this.currentProgram.trackedEntity && this.currentProgram.trackedEntity.displayName){
        caseName = this.currentProgram.trackedEntity.displayName;
      }
      this.trackerCaptureProvider.saveTrackedEntityRegistration(this.incidentDate,this.enrollmentDate,this.currentUser,this.trackedEntityInstance).then((reseponse : any)=>{
        this.appProvider.setNormalNotification("A " +caseName + " has been saved successfully");
        this.isTrackedEntityRegistered = true;
        this.registerEntity();
      }).catch(error=>{
        this.appProvider.setNormalNotification("Fail to save a "+caseName);
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

