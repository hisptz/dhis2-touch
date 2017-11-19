import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ProgramsProvider} from "../../providers/programs/programs";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";
import {EventCaptureFormProvider} from "../../providers/event-capture-form/event-capture-form";
import {ActionSheetController} from "ionic-angular";

/**
 * Generated class for the ProgramStageEventBasedComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'program-stage-event-based',
  templateUrl: 'program-stage-event-based.html'
})
export class ProgramStageEventBasedComponent implements OnInit, OnDestroy{

  @Input() programStage;
  @Input() dataDimension;
  @Input() currentEvent;
  @Output() onDeleteEvent = new EventEmitter();

  currentOrgUnit : any;
  currentProgram : any;
  currentUser : any;
  isLoading : boolean;
  loadingMessage : string;
  dataObjectModel : any;
  eventDate : any;
  dataValuesSavingStatusClass : any;

  constructor(private programsProvider : ProgramsProvider,
              private actionSheetCtrl: ActionSheetController,
              private eventCaptureFormProvider : EventCaptureFormProvider,
              private userProvider : UserProvider,private appProvider : AppProvider,
              private organisationUnitProvider : OrganisationUnitsProvider) {
  }

  ngOnInit(){
    this.dataObjectModel = {};
    this.dataValuesSavingStatusClass = {};
    this.currentOrgUnit = this.organisationUnitProvider.lastSelectedOrgUnit;
    this.currentProgram = this.programsProvider.lastSelectedProgram;
    this.loadingMessage = "Loading user information";
    this.isLoading = true;
    if(this.currentEvent && this.currentEvent.eventDate){
      this.eventDate = this.currentEvent.eventDate;
    }
    this.userProvider.getCurrentUser().then((user : any)=>{
      this.currentUser = user;
      if(this.currentEvent && this.currentEvent.dataValues && this.currentEvent.dataValues.length > 0){
        this.updateDataObjectModel(this.currentEvent.dataValues,this.programStage.programStageDataElements);
      }
      this.isLoading = false;
    }).catch(error=>{
      this.isLoading = false;
      console.log(JSON.stringify(error));
      this.appProvider.setNormalNotification("Fail to load user information");
    })
  }

  canEventBeDeleted(){
    return (this.currentEvent && this.currentEvent.eventDate);
  }

  deleteEvent(currentEventId) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'You are about to delete this event, are you sure?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.isLoading = true;
            this.loadingMessage = "Deleting event";
            this.eventCaptureFormProvider.deleteEventByAttribute('id', currentEventId, this.currentUser).then(() => {
              this.appProvider.setNormalNotification("Event has been deleted successfully");
              this.onDeleteEvent.emit();
            }).catch(error => {
              console.log(JSON.stringify(error));
              this.isLoading = false;
              this.appProvider.setNormalNotification("Fail to delete event");
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

  updateDataObjectModel(dataValues,programStageDataElements){
    let dataValuesMapper = {};
    dataValues.forEach((dataValue : any)=>{
      dataValuesMapper[dataValue.dataElement] = dataValue;
    });
    programStageDataElements.forEach((programStageDataElement : any)=>{
      if(programStageDataElement.dataElement && programStageDataElement.dataElement.id){
        let dataElementId = programStageDataElement.dataElement.id;
        let fieldId = programStageDataElement.dataElement.id +"-dataElement";
        if(dataValuesMapper[dataElementId]){
          this.dataObjectModel[fieldId] = dataValuesMapper[dataElementId];
        }
      }
    });
  }

  updateEventDate(){
    //this.currentEvent["eventDate"] = this.eventDate;
    //this.currentEvent["dueDate"] = this.eventDate;
    this.currentEvent.syncStatus = "not-synced";
    // this.eventCaptureFormProvider.saveEvents([this.currentEvent],this.currentUser).then(()=>{
    //   this.appProvider.setNormalNotification("Event has been registered successfully");
    // }).catch((error)=>{
    //   console.log(JSON.stringify(error));
    // });
  }

  updateData(updatedData){
    this.currentEvent["eventDate"] = this.eventDate;
    this.currentEvent["dueDate"] = this.eventDate;
    this.currentEvent.syncStatus = "not-synced";
    let dataValues = [];
    Object.keys(this.dataObjectModel).forEach((key : any)=>{
      let dataElementId = key.split('-')[0];
      dataValues.push({
        dataElement : dataElementId,
        value : this.dataObjectModel[key].value
      });
    });
    this.currentEvent.dataValues = dataValues;
    this.currentEvent.syncStatus = "not-synced";
    this.eventCaptureFormProvider.saveEvents([this.currentEvent],this.currentUser).then(()=>{
      this.dataObjectModel[updatedData.id] = updatedData;
      this.dataValuesSavingStatusClass[updatedData.id] ="input-field-container-success";
    }).catch((error)=>{
      this.dataValuesSavingStatusClass[updatedData.id] ="input-field-container-failed";
      console.log(JSON.stringify(error));
    });
  }

  ngOnDestroy(){
    this.currentProgram = null;
    this.currentOrgUnit = null;
  }

}
