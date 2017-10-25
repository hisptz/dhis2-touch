import {Component,Input, OnDestroy, OnInit} from '@angular/core';
import {ProgramsProvider} from "../../providers/programs/programs";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";
import {EventCaptureFormProvider} from "../../providers/event-capture-form/event-capture-form";

/**
 * Generated class for the ProgramStageTrackerBasedComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'program-stage-tracker-based',
  templateUrl: 'program-stage-tracker-based.html'
})
export class ProgramStageTrackerBasedComponent implements OnInit, OnDestroy{

  @Input() programStage;
  @Input() trackedEntityInstance;

  currentOrgUnit : any;
  currentProgram : any;
  currentUser : any;
  isLoading : boolean;
  loadingMessage : string;
  selectedDataDimension : any;
  dataObjectModel : any;
  currentEvents : Array<any>;
  shouldAddNewEvent : boolean = false;
  currentOpenEvent : any;

  constructor(private programsProvider : ProgramsProvider,
              private userProvider : UserProvider,private appProvider : AppProvider,
              private eventCaptureFormProvider : EventCaptureFormProvider,
              private organisationUnitProvider : OrganisationUnitsProvider) {
  }

  ngOnInit(){
    //@todo loading events based to render forms
    this.dataObjectModel = {};
    this.currentEvents = [];
    //@todo add support of data dimensions
    this.selectedDataDimension = [];
    console.log("trackedEntityInstance : " + this.trackedEntityInstance);
    this.currentOrgUnit = this.organisationUnitProvider.lastSelectedOrgUnit;
    this.currentProgram = this.programsProvider.lastSelectedProgram;
    this.loadingMessage = "Loading user information";
    this.isLoading = true;
    this.userProvider.getCurrentUser().then((user)=>{
      this.currentUser = user;
      if(this.programStage && this.programStage.id){
        this.loadEventsBasedOnProgramStage(this.programStage.id);
      }
    }).catch(error=>{
      this.appProvider.setNormalNotification("Fail to load user information");
    })
  }

  loadEventsBasedOnProgramStage(programStageId){
    this.loadingMessage = "Loading events";
    this.eventCaptureFormProvider.getEventsByAttribute('programStage',[programStageId],this.currentUser).then((events : any)=>{
      this.currentEvents = events;
      this.isLoading = false;
    }).catch(error=>{
      console.log(JSON.stringify(error));
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to load events");
    });
  }

  addNewEvent(){
    //@todo creation of empty events based on
    let dataDimension : any = this.getDataDimensions();
    this.currentOpenEvent = this.eventCaptureFormProvider.getEmptyEvent(this.currentProgram,this.currentOrgUnit,this.programStage.id,dataDimension.attributeCos,dataDimension.attributeCc,'tracker');
    this.dataObjectModel = {};
    this.shouldAddNewEvent = true;
  }

  ngOnDestroy(){
    this.currentProgram = null;
    this.currentOrgUnit = null;
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

  updateData(updatedData){
    this.dataObjectModel[updatedData.id] = updatedData;
    let dataValues = [];
    Object.keys(this.dataObjectModel).forEach((key : any)=>{
      let dataElementId = key.split('-')[0];
      dataValues.push({
        dataElement : dataElementId,
        value : this.dataObjectModel[key].value
      });
    });
    this.currentOpenEvent.dataValues = dataValues;
    this.currentOpenEvent.syncStatus = "not-synced";
    this.eventCaptureFormProvider.saveEvents([this.currentOpenEvent],this.currentUser).then(()=>{
      console.log("Success saving data values");
    }).catch((error)=>{
      console.log(JSON.stringify(error));
    });
  }

  getDataDimensions(){
    if(this.currentProgram && this.currentProgram.categoryCombo){
      let attributeCc = this.currentProgram.categoryCombo.id;
      let attributeCos = "";
      this.selectedDataDimension.forEach((dimension : any,index:any)=>{
        if(index == 0){
          attributeCos +=dimension.id;
        }else{
          attributeCos += ";" + dimension.id;
        }
      });
      return {attributeCc : attributeCc,attributeCos:attributeCos};
    }else{
      return {};
    }
  }


}
