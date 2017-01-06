import { Component } from '@angular/core';
import {NavController,ToastController,NavParams,ActionSheetController } from 'ionic-angular';

import {User} from '../../providers/user/user';
import {HttpClient} from "../../providers/http-client/http-client";
import {SqlLite} from "../../providers/sql-lite/sql-lite";
import {Program} from "../../providers/program";
import {Events} from "../../providers/events";
import {ProgramStageDataElements} from "../../providers/program-stage-data-elements";

/*
  Generated class for the EventView page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-event-view',
  templateUrl: 'event-view.html',
  providers : [User,HttpClient,SqlLite,Program,Events,ProgramStageDataElements]
})
export class EventView {

  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;
  public params : any;

  public currentProgram : any;
  public event : any;
  public dataElementMapper : any;

  constructor(public NavParams:NavParams,public eventProvider :Events,public Program : Program,
              public toastCtrl: ToastController,public user : User,public actionSheetCtrl: ActionSheetController,
              public ProgramStageDataElements : ProgramStageDataElements,public navCtrl: NavController,
              public sqlLite : SqlLite,public httpClient: HttpClient){


    this.user.getCurrentUser().then(user=>{
      this.currentUser = user;
      this.params = this.NavParams.get("params");
      this.loadProgramMetadata(this.params.programId);
    });
  }

  ionViewDidLoad() {
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

  setToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
