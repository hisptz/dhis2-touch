import { Component,OnInit } from '@angular/core';
import {NavController,ToastController,NavParams } from 'ionic-angular';

import {Program} from "../../providers/program";
import {Events} from "../../providers/events";
import {ProgramStageDataElements} from "../../providers/program-stage-data-elements";
import {User} from "../../providers/user";
import {EventCaptureForm} from "../event-capture-form/event-capture-form";

/*
  Generated class for the EventView page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-event-view',
  templateUrl: 'event-view.html',
  providers : [Events]
})
export class EventView implements OnInit{

  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;
  public params : any;

  public currentProgram : any;
  public event : any;
  public dataElementMapper : any;

  constructor(public NavParams:NavParams,public eventProvider :Events,public Program : Program,
              public toastCtrl: ToastController,public user : User,
              public ProgramStageDataElements : ProgramStageDataElements,public navCtrl: NavController){


  }

  ngOnInit() {
    this.user.getCurrentUser().then(user=>{
      this.currentUser = user;
      this.params = this.NavParams.get("params");
      this.loadProgramMetadata(this.params.programId);
    });
  }

  ionViewDidEnter(){
    if(this.params && this.params.programId){
      this.loadProgramMetadata(this.params.programId);
    }
  }

  /**
   *
   * @param programId
     */
  loadProgramMetadata(programId){
    this.loadingData = true;
    this.loadingMessages = [];
    this.setLoadingMessages("Loading program metadata");
    this.Program.getProgramById(programId,this.currentUser).then((program : any)=>{
      this.currentProgram = program;
      this.loadProgramStageDataElements(this.currentProgram.programStages[0].programStageDataElements);
    },error=>{
      this.loadingData = false;
      this.setToasterMessage("Fail to load program metadata : " + JSON.stringify(error));
    });
  }

  /**
   *
   * @param programStageDataElementsIds
     */
  loadProgramStageDataElements(programStageDataElementsIds){
    this.dataElementMapper = {};
    this.ProgramStageDataElements.getProgramStageDataElements(programStageDataElementsIds,this.currentUser).then((programStageDataElements:any)=>{
      programStageDataElements.forEach((programStageDataElement)=>{
        this.dataElementMapper[programStageDataElement.dataElement.id] = programStageDataElement.dataElement;
      });
      this.loadingEvent(this.params.programId,this.params.orgUnitId,this.params.event);
    },error=>{
      this.loadingData = false;
      this.setToasterMessage("Fail to load entry fields details : " + JSON.stringify(error));
    });
  }

  /**
   *
   * @param programId
   * @param orgUnitId
   * @param eventId
     */
  loadingEvent(programId,orgUnitId,eventId){
    this.setLoadingMessages("Loading event");
    let eventTableId = programId+"-"+orgUnitId+"-"+eventId;
    this.eventProvider.loadingEventByIdFromStorage(eventTableId,this.currentUser).then((event:any)=>{
      this.event = event;
      this.loadingData = false;
    },error=>{
      this.loadingData = false;
      this.setToasterMessage("Fail to load event with id : " + eventId);
    });
  }

  setLoadingMessages(message){
    this.loadingMessages.push(message);
  }

  gotToEditEvent(event){
    let params = {
      orgUnitId : this.params.orgUnitId,
      orgUnitName : this.params.orgUnitName,
      programId : this.params.programId,
      programName : this.params.programName,
      selectedDataDimension : this.params.selectedDataDimension,
      event : event.event
    };
    this.navCtrl.push(EventCaptureForm,{params:params});
  }

  setToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 4000
    });
    toast.present();
  }

}
