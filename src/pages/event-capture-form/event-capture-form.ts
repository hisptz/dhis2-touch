import { Component } from '@angular/core';
import {ToastController,NavParams,ActionSheetController,NavController } from 'ionic-angular';

import {User} from '../../providers/user/user';
import {HttpClient} from "../../providers/http-client/http-client";
import {SqlLite} from "../../providers/sql-lite/sql-lite";
import {ProgramSelection} from "../program-selection/program-selection";
import {Program} from "../../providers/program";
import {OrganisationUnit} from "../../providers/organisation-unit";
import {Events} from "../../providers/events";
import {ProgramStageDataElements} from "../../providers/program-stage-data-elements";
import {ProgramStageSections} from "../../providers/program-stage-sections";
import {EventCaptureFormProvider} from "../../providers/event-capture-form-provider";

declare var dhis2: any;

/*
  Generated class for the EventCaptureForm page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-event-capture-form',
  templateUrl: 'event-capture-form.html',
  providers : [User,HttpClient,SqlLite,Program,Events,ProgramStageDataElements,ProgramStageSections,EventCaptureFormProvider]
})
export class EventCaptureForm {

  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;
  public entryFormParameter : any;
  public currentProgram : any;
  public programStageDataElements : any;
  public programStageSections : any;
  public entryFormSections : any;
  public event : any;
  public dataValues : any;
  public eventComment : string;

  //pagination controller
  public currentPage : number ;
  public paginationLabel : string = "";


  constructor(public params:NavParams,public eventProvider :Events,public Program : Program,
              public toastCtrl: ToastController,public user : User,public actionSheetCtrl: ActionSheetController,
              public ProgramStageDataElements : ProgramStageDataElements,
              public ProgramStageSections:ProgramStageSections,public navCtrl: NavController,
              public EventCaptureFormProvider : EventCaptureFormProvider,
              public sqlLite : SqlLite,public httpClient: HttpClient){

    this.programStageDataElements  = [];
    this.programStageSections = [];
    this.currentPage = 0;
    this.user.getCurrentUser().then(user=>{
      this.currentUser = user;
      this.eventProvider.getEventsFromStorageByStatus(user,"new event").then((events :any)=>{
        this.eventProvider.uploadEventsToServer(events,this.currentUser).then((response)=>{
        },error=>{});
        this.eventProvider.getEventsFromStorageByStatus(user,"not synced").then((events :any)=>{
          this.eventProvider.uploadEventsToServer(events,this.currentUser).then((response)=>{
          },error=>{});
        });
      });
      this.entryFormParameter = this.params.get("params");
      if(this.entryFormParameter.programId){
        this.loadProgramMetadata(this.entryFormParameter.programId);
      }
    });
  }

  ionViewDidLoad() {
  }

  initiateNewEvent(entryFormParameter,program){
    this.dataValues = {};
    this.event = {
      program : program.id,
      programStage:program.programStages[0].id,
      orgUnit : entryFormParameter.orgUnitId,
      status : "ACTIVE",
      eventDate : "",
      dataValues : []
    };
    //add category combination
    if(entryFormParameter.selectedDataDimension.length > 0){
      let attributeCategoryOptions = entryFormParameter.selectedDataDimension.toString();
      attributeCategoryOptions = attributeCategoryOptions.replace(/,/g, ';');
      this.event["attributeCategoryOptions"] = attributeCategoryOptions;
    }
  }

  loadProgramMetadata(programId){
    this.loadingData = true;
    this.loadingMessages = [];
    this.setLoadingMessages("Loading program metadata");
    this.Program.getProgramById(programId,this.currentUser).then((program : any)=>{
      this.currentProgram = program;
      if(this.entryFormParameter.event ==""){
        //initiate new event
        this.initiateNewEvent(this.entryFormParameter,program);
      }else{
        this.loadingEvent(this.entryFormParameter.programId,this.entryFormParameter.orgUnitId,this.entryFormParameter.event);
      }
      if(program.programStageSections !=null || program.programStageSections){
        this.loadProgramStageSections(program.programStageSections);
      }else{
        this.loadProgramStageDataElements(this.currentProgram.programStages[0].programStageDataElements);
      }
    },error=>{
      this.loadingData = false;
      this.setToasterMessage("Fail to load program metadata : " + JSON.stringify(error));
    });
  }

  loadProgramStageSections(programStageSectionsIds){
    this.setLoadingMessages("Loading program's sections");
    this.ProgramStageSections.getProgramStageSections(programStageSectionsIds,this.currentUser).then((programStageSections:any)=>{
      this.programStageSections = programStageSections;
      this.loadProgramStageDataElements(this.currentProgram.programStages[0].programStageDataElements);
    },error=>{
      this.loadingData = false;
      this.setToasterMessage("Fail to load program's sections : " + JSON.stringify(error));
    });
  }

  loadProgramStageDataElements(programStageDataElementsIds){
    this.setLoadingMessages("Loading Entry fields details");
    this.programStageDataElements = [];
    this.ProgramStageDataElements.getProgramStageDataElements(programStageDataElementsIds,this.currentUser).then((programStageDataElements:any)=>{
      programStageDataElements.forEach((programStageDataElement)=>{
        this.programStageDataElements.push(programStageDataElement);
      });
      this.EventCaptureFormProvider.getEventCaptureEntryFormMetaData(this.programStageSections,this.programStageDataElements).then((entryFormSections:any)=>{
        this.entryFormSections = entryFormSections;
        this.paginationLabel = (this.currentPage + 1) + "/"+this.entryFormSections.length;
        this.loadingData = false;
      },error=>{
        this.loadingData = false;
      });

    },error=>{
      this.loadingData = false;
      this.setToasterMessage("Fail to load entry fields details : " + JSON.stringify(error));
    });
  }

  loadingEvent(programId,orgUnitId,eventId){
    this.setLoadingMessages("Loading event");
    let eventTableId = programId+"-"+orgUnitId+"-"+eventId;
    this.dataValues = {};
    this.eventProvider.loadingEventByIdFromStorage(eventTableId,this.currentUser).then((event:any)=>{
      this.event = event;
      if(event.notes !="0"){
        this.eventComment = event.notes;
      }
      event.dataValues.forEach((dataValue : any)=>{
        this.dataValues[dataValue.dataElement] = dataValue.value;
      });
    },error=>{
      //fail to load event from local storage
    });
  }

  saveEvent(){
    this.loadingMessages = [];
    this.loadingData = true;
    this.setLoadingMessages("Preparing data for saving");
    this.ProgramStageDataElements.getProgramStageDataElements(this.currentProgram.programStages[0].programStageDataElements,this.currentUser).then((programStageDataElements:any)=>{
      let isFormValid = this.hasFormValidForSubmission(programStageDataElements);
      if(isFormValid){
        //checking for event status completion
        this.event.status == "COMPLETED"? this.event["completedDate"] = this.eventProvider.getFormattedDate(new Date()) : delete this.event.completedDate;
        //checking for event comments
        this.eventComment !=""?this.event.notes = this.eventComment : delete this.event.notes;
        //empty event dataValues
        this.event.dataValues = [];
        //update event sync status
        // if has been updated change status to 'not synced'
        if(this.entryFormParameter.event ==""){
          this.event["syncStatus"] = "new event";
          this.event["event"]= dhis2.util.uid();
        }else{
          this.event["syncStatus"] = "not synced";
        }
        this.eventProvider.getEventDataValues(this.dataValues,programStageDataElements).then((dataValues:any)=>{
          dataValues.forEach(dataValue=>{
            this.event.dataValues.push(dataValue);
          });
          //saving event to local storage
          this.setLoadingMessages("Saving new event to local storage");
          this.eventProvider.saveEvent(this.event,this.currentUser).then(()=>{
            this.loadingData = false;
            this.navCtrl.pop();
          },error=>{
            this.loadingData = false;
            this.setToasterMessage("Fail to save new event to local storage : " + JSON.stringify(error));
          });
        })
      }else{
        this.loadingData = false;
        this.setToasterMessage("Please make sure your enter all required fields, before saving");
      }
    });
  }

  cancel(){
    this.navCtrl.pop();
  }

  /**
   * checking if all required fields has been field
   * @param programStageDataElements
   * @returns {boolean}
     */
  hasFormValidForSubmission(programStageDataElements){
    let isValid = true;
    programStageDataElements.forEach((programStageDataElement:any)=>{
      if(programStageDataElement.compulsory !="0" && !this.dataValues[programStageDataElement.dataElement.id]){
        isValid = false;
      }
    });
    return isValid;
  }

  //@todo add more information
  showTooltips(dataElement,categoryComboName,isMandatory){
    let title = dataElement.name + (categoryComboName != 'default' ? " " +categoryComboName:"");
    let subTitle = "";
    if(isMandatory == "true"){
      title += ". This field is mandatory";
    }else{
      title += ". This field is optional";
    }
    if(dataElement.description){
      title += ". Description : " + dataElement.description;
    }
    subTitle += "Value Type : " +dataElement.valueType.toLocaleLowerCase().replace(/_/g," ");
    if(dataElement.optionSet){
      title += ". It has " +dataElement.optionSet.options.length + " options to select.";
    }
    let actionSheet = this.actionSheetCtrl.create({
      title: title,subTitle:subTitle
    });
    actionSheet.present();
  }

  //todo get input label attribute form setting
  getDisplayName(dataElement){
    return dataElement.displayName;
  }

  changePagination(page){
    page = parseInt(page);
    if(page == -1){
      this.currentPage = 0;
    }else if(page == this.entryFormSections.length){
      this.currentPage = this.entryFormSections.length - 1;
    }else{
      this.currentPage = page;
    }
    this.paginationLabel = (this.currentPage + 1) + "/"+this.entryFormSections.length;
  }

  setLoadingMessages(message){
    this.loadingMessages.push(message);
  }

  setToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  setStickToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton : true
    });
    toast.present();
  }

}
