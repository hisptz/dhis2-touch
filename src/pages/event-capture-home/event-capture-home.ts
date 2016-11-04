import { Component } from '@angular/core';
import { NavController,ToastController,ModalController } from 'ionic-angular';

import {User} from '../../providers/user/user';
import {AppProvider} from '../../providers/app-provider/app-provider';
import {HttpClient} from "../../providers/http-client/http-client";
import {SqlLite} from "../../providers/sql-lite/sql-lite";
import {OrganisationUnits} from "../organisation-units/organisation-units";
import {ProgramSelection} from "../program-selection/program-selection";

declare var dhis2: any;

/*
  Generated class for the EventCaptureHome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-event-capture-home',
  templateUrl: 'event-capture-home.html',
  providers : [User,AppProvider,HttpClient,SqlLite]
})
export class EventCaptureHome {

  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;
  public organisationUnits : any;
  public selectedOrganisationUnit :any = {};
  public selectedOrganisationUnitLabel :string;
  public assignedPrograms : any;
  public selectedProgram : any = {};
  public selectedProgramLabel : string;
  public programIdsByUserRoles : any;

  constructor(public modalCtrl: ModalController,public navCtrl: NavController,public toastCtrl: ToastController,public user : User,public appProvider : AppProvider,public sqlLite : SqlLite,public httpClient: HttpClient) {
    this.user.getCurrentUser().then(currentUser=>{
      this.currentUser = currentUser;
      this.getUserAssignedPrograms();
      this.loadOrganisationUnits();
      this.setProgramSelectionLabel();
    })
  }

  getUserAssignedPrograms(){
    this.programIdsByUserRoles = [];
    this.user.getUserData().then((userData : any)=>{
      userData.userRoles.forEach((userRole:any)=>{
        if (userRole.programs) {
          userRole.programs.forEach((program:any)=>{
            this.programIdsByUserRoles.push(program.id);
          });
        }
      });
    })
  }

  ionViewDidLoad() {

  }

  setProgramSelectionLabel(){
    this.setOrganisationSelectLabel();
    this.setSelectedProgramLabel();
  }

  setOrganisationSelectLabel(){
    if(this.selectedOrganisationUnit.id){
      this.selectedOrganisationUnitLabel = this.selectedOrganisationUnit.name;
    }else{
      this.selectedOrganisationUnitLabel = "Touch to select Organisation Unit"
    }
  }

  setSelectedProgramLabel(){
    if(this.selectedProgram.id){
      this.selectedProgramLabel = this.selectedProgram.name;
    }else{
      this.selectedProgramLabel = "Touch to select a Program";
    }
  }

  loadOrganisationUnits():void{
    this.loadingData = true;
    this.loadingMessages=[];
    this.setLoadingMessages('Loading organisation units');
    let resource  = "organisationUnits";
    this.sqlLite.getAllDataFromTable(resource,this.currentUser.currentDatabase).then((organisationUnits : any)=>{
      this.organisationUnits = organisationUnits;
      this.loadingData = false;
    },error=>{
      this.loadingData = false;
      this.setToasterMessage('Fail to load organisation units');
    })
  }

  openOrganisationUnitModal(){
    this.loadingMessages = [];
    this.loadingData = true;
    let modal = this.modalCtrl.create(OrganisationUnits,{data : this.organisationUnits});
    modal.onDidDismiss((selectedOrganisationUnit:any) => {
      if(selectedOrganisationUnit.id){
        if(selectedOrganisationUnit.id != this.selectedOrganisationUnit.id){
          this.selectedOrganisationUnit = selectedOrganisationUnit;
          this.selectedProgram = {};
          this.loadingPrograms();
          this.setProgramSelectionLabel();
        }else{
          this.loadingData = false;
        }
      }else{
        this.loadingData = false;
      }
    });
    modal.present();
  }

  loadingPrograms(){
    //todo empty programs
    this.setLoadingMessages('Loading assigned programs');
    let resource = 'programs';
    let attribute = 'id';
    let attributeValue =[];
    this.assignedPrograms = [];
    this.selectedOrganisationUnit.programs.forEach((program:any)=>{
      if(this.programIdsByUserRoles.indexOf(program.id) != -1){
        attributeValue.push(program.id);
      }
    });
    this.sqlLite.getDataFromTableByAttributes(resource,attribute,attributeValue,this.currentUser.currentDatabase).then((programs : any)=>{
      programs.forEach((program:any)=>{
        this.assignedPrograms.push({
          id: program.id,
          name: program.name,
          categoryCombo : program.categoryCombo
        });
      });
      this.loadingData = false;
    },error=>{
      this.loadingData = false;
      this.setToasterMessage('Fail to load assigned programs');
    });
  }

  openProgramsModal(){
    this.loadingMessages = [];
    this.loadingData = true;
    this.setLoadingMessages('Please wait ...');
    let modal = this.modalCtrl.create(ProgramSelection,{data : this.assignedPrograms});
    modal.onDidDismiss((selectedProgram:any) => {
      if(selectedProgram.id){
        if(selectedProgram.id != this.selectedProgram.id){
          this.selectedProgram = selectedProgram;
          this.loadingData = false;
          this.setProgramSelectionLabel();
        }else{
          this.loadingData = false;
        }
      }else{
        this.loadingData = false;
      }
    });
    modal.present();
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
