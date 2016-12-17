import { Component } from '@angular/core';
import {ToastController,NavParams,ActionSheetController } from 'ionic-angular';

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

  //pagination controller
  public currentPage : number ;
  public paginationLabel : string = "";


  constructor(public params:NavParams,public eventProvider :Events,public Program : Program,
              public toastCtrl: ToastController,public user : User,public actionSheetCtrl: ActionSheetController,
              public ProgramStageDataElements : ProgramStageDataElements,
              public ProgramStageSections:ProgramStageSections,
              public EventCaptureFormProvider : EventCaptureFormProvider,
              public sqlLite : SqlLite,public httpClient: HttpClient){

    this.programStageDataElements  = [];
    this.programStageSections = [];
    this.currentPage = 0;
    this.user.getCurrentUser().then(user=>{
      this.currentUser = user;
      this.entryFormParameter = this.params.get("params");
      if(this.entryFormParameter.programId){
        this.loadProgramMetadata(this.entryFormParameter.programId);
      }
    })

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
    //
    // notes completedDate
    //"status": "COMPLETED"
  }

  loadProgramMetadata(programId){
    this.loadingData = true;
    this.loadingMessages = [];
    this.setLoadingMessages("Loading program metadata");
    this.Program.getProgramById(programId,this.currentUser).then((program : any)=>{
      this.currentProgram = program;
      //initiate event
      this.initiateNewEvent(this.entryFormParameter,program);
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
    this.ProgramStageDataElements.getProgramStageDataElements(programStageDataElementsIds,this.currentUser).then((programStageDataElements:any)=>{
      this.programStageDataElements = programStageDataElements;
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


  //@todo change usage of acton sheet to display tooltips
  showTooltips(dataElement,categoryComboName){
    let title = dataElement.name + (categoryComboName != 'default' ? " " +categoryComboName:"");
    if(dataElement.description){
      title = dataElement.description;
    }
    let actionSheet = this.actionSheetCtrl.create({
      title: title
    });
    actionSheet.present();
  }

  //todo get input label attribute form setting
  getDisplayName(dataElement){
    return dataElement.displayName;
    //return if()
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
