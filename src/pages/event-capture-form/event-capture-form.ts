import { Component } from '@angular/core';
import {ToastController,NavParams } from 'ionic-angular';

import {User} from '../../providers/user/user';
import {HttpClient} from "../../providers/http-client/http-client";
import {SqlLite} from "../../providers/sql-lite/sql-lite";
import {ProgramSelection} from "../program-selection/program-selection";
import {Program} from "../../providers/program";
import {OrganisationUnit} from "../../providers/organisation-unit";
import {Events} from "../../providers/events";
import {ProgramStageDataElements} from "../../providers/program-stage-data-elements";
import {ProgramStageSections} from "../../providers/program-stage-sections";

/*
  Generated class for the EventCaptureForm page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-event-capture-form',
  templateUrl: 'event-capture-form.html',
  providers : [User,HttpClient,SqlLite,Program,Events,ProgramStageDataElements,ProgramStageSections]
})
export class EventCaptureForm {

  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;
  public entryFormParameter : any;
  public currentProgram : any;
  public programStageDataElements : any;
  public programStageSections : any;

  constructor(public params:NavParams,public eventProvider :Events,public Program : Program,
              public toastCtrl: ToastController,public user : User,
              public ProgramStageDataElements : ProgramStageDataElements,
              public ProgramStageSections:ProgramStageSections,
              public sqlLite : SqlLite,public httpClient: HttpClient){

    this.dataElements  = [];
    this.entryFormSection = [];
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

  loadProgramMetadata(programId){
    this.loadingData = true;
    this.loadingMessages = [];
    this.setLoadingMessages("Loading program metadata");
    this.Program.getProgramById(programId,this.currentUser).then((program : any)=>{
      this.currentProgram = program;
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
      this.loadingData = false;
    },error=>{
      this.loadingData = false;
      this.setToasterMessage("Fail to load entry fields details : " + JSON.stringify(error));
    });
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
