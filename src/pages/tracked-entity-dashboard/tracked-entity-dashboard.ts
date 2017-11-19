import {Component, OnInit, ViewChild} from '@angular/core';
import {ActionSheetController, Content, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {TrackedEntityAttributeValuesProvider} from "../../providers/tracked-entity-attribute-values/tracked-entity-attribute-values";
import {EventCaptureFormProvider} from "../../providers/event-capture-form/event-capture-form";
import {AppProvider} from "../../providers/app/app";
import {ProgramsProvider} from "../../providers/programs/programs";
import {UserProvider} from "../../providers/user/user";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {TrackerCaptureProvider} from "../../providers/tracker-capture/tracker-capture";
import {TrackedEntityInstancesProvider} from "../../providers/tracked-entity-instances/tracked-entity-instances";

/**
 * Generated class for the TrackedEntityDashboardPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tracked-entity-dashboard',
  templateUrl: 'tracked-entity-dashboard.html',
})
export class TrackedEntityDashboardPage implements OnInit{

  currentOrgUnit : any;
  currentProgram : any;
  currentUser : any;

  trackedEntityInstance : any;
  enrollment : any;

  programStages : Array<any>;
  programTrackedEntityAttributes : Array<any>;
  dataObject : any = {};
  trackedEntityAttributesSavingStatusClass : any;
  trackedEntityAttributeValuesObject : any = {};

  isLoading : boolean;
  loadingMessage : string;

  dashboardWidgets : Array<any>;
  isDashboardWidgetOpen : any;

  currentWidget : any;
  currentWidgetIndex : any;
  icons : any = {};
  @ViewChild(Content) content: Content;

  constructor(private navCtrl: NavController,
              private modalCtrl : ModalController,
              private actionSheetCtrl: ActionSheetController,
              private eventCaptureFormProvider : EventCaptureFormProvider,
              private userProvider : UserProvider,private appProvider : AppProvider,
              private programsProvider : ProgramsProvider,
              private trackerCaptureProvider : TrackerCaptureProvider,
              private organisationUnitsProvider : OrganisationUnitsProvider,
              private trackedEntityAttributeValuesProvider : TrackedEntityAttributeValuesProvider,
              private trackedEntityInstancesProvider : TrackedEntityInstancesProvider,
              private navParams: NavParams) {
  }

  ngOnInit(){
    this.isDashboardWidgetOpen = {};
    this.trackedEntityAttributesSavingStatusClass = {};
    this.icons["menu"] = "assets/dashboard/menu.png";
    this.loadingMessage = "Loading user information";
    this.isLoading = true;
    let trackedEntityInstancesId = this.navParams.get("trackedEntityInstancesId");
    this.currentProgram = this.programsProvider.lastSelectedProgram;
    this.currentOrgUnit = this.organisationUnitsProvider.lastSelectedOrgUnit;
    this.dashboardWidgets = this.getDashboardWidgets();
    this.userProvider.getCurrentUser().then(user=>{
      this.currentUser = user;
      this.loadTrackedEntityInstanceData(trackedEntityInstancesId);
    }).catch((error)=>{
      console.log(JSON.stringify(error));
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to load user information");
    })
  }

  loadTrackedEntityInstanceData(trackedEntityInstanceId){
    this.loadingMessage = "Loading tracked entity";
    this.trackerCaptureProvider.getTrackedEntityInstance(trackedEntityInstanceId,this.currentUser).then((response : any)=>{
      this.trackedEntityInstance = response;
      if(response && response.attributes){
        response.attributes.forEach((attributeObject : any)=>{
          this.trackedEntityAttributeValuesObject[attributeObject.attribute] = attributeObject.value;
          let id = attributeObject.attribute + "-trackedEntityAttribute";
          this.dataObject[id] = {"id" : id,"value" : attributeObject.value};
        });
      }
      this.loadingProgramStages(this.currentProgram.id,this.currentUser);
    }).catch(error=>{})
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
      if(this.dashboardWidgets.length > 0){
        this.changeDashboardWidget(this.dashboardWidgets[0]);
      }
      this.loadTrackedEntityRegistration(programId,currentUser);
    }).catch(error=>{
      console.log(JSON.stringify(error));
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to load program stages " + this.currentProgram.name);
    });
  }

  loadTrackedEntityRegistration(programId,currentUser){
    this.loadingMessage = "Loading registration fields " + this.currentProgram.name;
    this.isLoading = true;
    this.trackerCaptureProvider.getTrackedEntityRegistration(programId,currentUser).then((programTrackedEntityAttributes : any)=>{
      this.programTrackedEntityAttributes = programTrackedEntityAttributes;
      this.isLoading = false;
    }).catch(error=>{
      this.isLoading = false;
      console.log(JSON.stringify(error));
      this.appProvider.setNormalNotification("Fail to load registration fields for " + this.currentProgram.name);
    });
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


  updateData(updateDataValue){
    let id = updateDataValue.id.split("-")[0];
    this.trackedEntityAttributeValuesObject[id] = updateDataValue.value;
    let trackedEntityAttributeValues = [];
    Object.keys(this.trackedEntityAttributeValuesObject).forEach(key=>{
      trackedEntityAttributeValues.push({
        value : this.trackedEntityAttributeValuesObject[key],attribute : key
      })
    });
    this.trackedEntityAttributeValuesProvider.savingTrackedEntityAttributeValues(this.trackedEntityInstance.id,trackedEntityAttributeValues,this.currentUser).then(()=>{
      this.trackedEntityInstancesProvider.updateSavedTrackedEntityInstancesByStatus([this.trackedEntityInstance],this.currentUser,'not-synced').then(()=>{
        this.dataObject[updateDataValue.id] = updateDataValue;
        this.trackedEntityAttributesSavingStatusClass[updateDataValue.id] ="input-field-container-success";
      }).catch((error)=>{
        this.trackedEntityAttributesSavingStatusClass[updateDataValue.id] ="input-field-container-failed";
        console.log(JSON.stringify(error));
      })
    }).catch(error=>{
      this.trackedEntityAttributesSavingStatusClass[updateDataValue.id] ="input-field-container-failed";
      console.log(JSON.stringify(error));
    });
  }

  updateWidgetPagination(widgetIndex){
    let widget = this.dashboardWidgets[widgetIndex];
    if(widget && widget.id){
      this.changeDashboardWidget(widget);
    }
  }

  changeDashboardWidget(widget){
    if(widget && widget.id){
      this.currentWidgetIndex = this.dashboardWidgets.indexOf(widget);
      this.currentWidget = widget;
      if(!this.isDashboardWidgetOpen[widget.id]){
        Object.keys(this.isDashboardWidgetOpen).forEach(id=>{
          this.isDashboardWidgetOpen[id] = false;
        });
      }
      this.isDashboardWidgetOpen[widget.id] = true;
    }
  }

  openWidgetList(){
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
  }

  getDashboardWidgets(){
    return [
      {id : 'enrollment',name : 'Enrollment & Profile',icon: 'assets/tracker/profile.png'}
    ];
  }



}
