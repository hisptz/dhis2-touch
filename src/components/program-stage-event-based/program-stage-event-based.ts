import {Component,Input, OnDestroy, OnInit} from '@angular/core';
import {ProgramsProvider} from "../../providers/programs/programs";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";
import {EventCaptureFormProvider} from "../../providers/event-capture-form/event-capture-form";

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

  currentOrgUnit : any;
  currentProgram : any;
  currentUser : any;
  isLoading : boolean;
  loadingMessage : string;
  dataObjectModel : any;
  eventDate : any;

  constructor(private programsProvider : ProgramsProvider,
              private eventCaptureFormProvider : EventCaptureFormProvider,
              private userProvider : UserProvider,private appProvider : AppProvider,
              private organisationUnitProvider : OrganisationUnitsProvider) {
  }

  ngOnInit(){
    this.dataObjectModel = {};
    this.currentOrgUnit = this.organisationUnitProvider.lastSelectedOrgUnit;
    this.currentProgram = this.programsProvider.lastSelectedProgram;
    this.loadingMessage = "Loading user information";
    this.isLoading = true;
    this.userProvider.getCurrentUser().then((user : any)=>{
      this.currentUser = user;
      if(this.currentEvent && this.currentEvent.dataValues && this.currentEvent.dataValues.length){
        this.updateDataObjectModel(this.currentEvent.dataValues,this.programStage.programStageDataElements);
      }
      if(this.currentEvent.eventDate){
        this.eventDate = this.currentEvent.eventDate;
      }
      this.isLoading = false;
    }).catch(error=>{
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to load user information");
    })
  }

  updateDataObjectModel(dataValues,programStageDataElements){
    let dataValuesMapper = {};
    dataValues.forEach((dataValue : any)=>{
      dataValuesMapper[dataValue.dataElement] = dataValue.value;
    });
    programStageDataElements.forEach((programStageDataElement : any)=>{
      if(programStageDataElement.dataElement && programStageDataElements.dataElement.id){
        if(dataValuesMapper[programStageDataElements.dataElement.id]){
          this.dataObjectModel[programStageDataElements.dataElement.id] = dataValuesMapper[programStageDataElements.dataElement.id];
        }
      }
    });
  }

  updateEventDate(){
    this.currentEvent["eventDate"] = this.eventDate;
    this.currentEvent["dueDate"] = this.eventDate;
    this.currentEvent.syncStatus = "not-synced";
    this.eventCaptureFormProvider.saveEvents([this.currentEvent],this.currentUser).then(()=>{
      this.appProvider.setNormalNotification("Event has been registered successfully");
    }).catch((error)=>{
      console.log(JSON.stringify(error));
    });
  }

  updateData(updatedData){
    let dataElementId = updatedData.id.split('-');
    this.dataObjectModel[dataElementId] = updatedData.value;
    let dataValues = [];
    Object.keys(this.dataObjectModel).forEach((dataElementId : any)=>{
      dataValues.push({
        dataElement : dataElementId,
        value : updatedData.value
      });
    });
    this.currentEvent.dataValues = dataValues;
    this.currentEvent.syncStatus = "not-synced";
    this.eventCaptureFormProvider.saveEvents([this.currentEvent],this.currentUser).then(()=>{
      console.log("Success saving data values");
    }).catch((error)=>{
      console.log(JSON.stringify(error));
    });
  }

  ngOnDestroy(){
    this.currentProgram = null;
    this.currentOrgUnit = null;
  }

}
