import { Component,OnInit } from '@angular/core';
import { NavController,ToastController,ModalController } from 'ionic-angular';

import {OrganisationUnits} from "../organisation-units/organisation-units";
import {ProgramSelection} from "../program-selection/program-selection";
import {Program} from "../../providers/program";
import {OrganisationUnit} from "../../providers/organisation-unit";
import {Events} from "../../providers/events";
import {EventCaptureForm} from "../event-capture-form/event-capture-form";
import {ProgramStageDataElements} from "../../providers/program-stage-data-elements";
import {EventView} from "../event-view/event-view";
import {EventFieldSelectionMenu} from "../event-field-selection-menu/event-field-selection-menu";
import {NetworkAvailability} from "../../providers/network-availability";
import {User} from "../../providers/user";

/*
  Generated class for the EventCaptureHome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-event-capture-home',
  templateUrl: 'event-capture-home.html',
  providers : [Events]
})
export class EventCaptureHomePage implements OnInit{

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
  public selectedDataDimension : any;
  public eventListSections : any;
  public isAllParameterSet : boolean;
  public currentSelectionStatus :any = {};

  public dataElementMapper :any = {};
  public dataElementToDisplay : any = {};
  public programStageDataElements : any;
  public tableFormat : any;
  public currentEvents : any;
  public hasEvents : boolean = false;

  //pagination controller
  public currentPage : number ;
  public paginationLabel : string = "";

  //network
  public network : any;

  constructor(public eventProvider :Events,public OrganisationUnit : OrganisationUnit,
              public ProgramStageDataElements : ProgramStageDataElements,
              public NetworkAvailability : NetworkAvailability,
              public Program : Program,public modalCtrl: ModalController,public navCtrl: NavController,
              public toastCtrl: ToastController,public user : User ) {}

  ngOnInit() {
    this.selectedDataDimension = [];
    this.currentEvents = [];
    this.eventListSections = [];
    this.isAllParameterSet = false;
    this.user.getCurrentUser().then(currentUser=>{
      this.currentUser = currentUser;
      this.getUserAssignedPrograms();
      this.setProgramSelectionLabel();
    });
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
      this.loadOrganisationUnits();
    });
  }

  ionViewDidLoad() {
    this.currentSelectionStatus.isProgramLoaded = true;
    this.currentSelectionStatus.orgUnit = true;
    this.currentSelectionStatus.isOrgUnitSelected = false;
    this.currentSelectionStatus.isOrgUnitLoaded = false;
    this.currentSelectionStatus.program = false;
    this.currentSelectionStatus.isProgramSelected = false;
    this.currentSelectionStatus.message = "";
    this.currentSelectionStatus.isEventsLoadedFromServer = false;
    this.currentSelectionStatus.eventsLoadingStatus =  "";
  }

  ionViewDidEnter() {
    if(this.isAllParameterSet){
      this.reLoadingEventList();
    }
  }

  setProgramSelectionLabel(){
    this.setOrganisationSelectLabel();
    this.setSelectedProgramLabel();
  }

  setOrganisationSelectLabel(){
    if(this.selectedOrganisationUnit.id){
      this.selectedOrganisationUnitLabel = this.selectedOrganisationUnit.name;
      this.currentSelectionStatus.program = true;
      this.currentSelectionStatus.isOrgUnitSelected = true;
    }else{
      this.selectedOrganisationUnitLabel = "Touch to select Organisation Unit";
      this.currentSelectionStatus.isOrgUnitSelected = false;
      this.currentSelectionStatus.program = false;
      if (this.currentSelectionStatus.orgUnit && !this.currentSelectionStatus.program) {
        this.currentSelectionStatus.message = "Please select organisation unit";
      }
    }
  }

  setSelectedProgramLabel(){
    if(this.selectedProgram.id){
      this.selectedProgramLabel = this.selectedProgram.name;
      this.currentSelectionStatus.program = true;
      this.currentSelectionStatus.isProgramSelected = true;
      this.currentSelectionStatus.message = "";
    }else{
      this.selectedProgramLabel = "Touch to select a Program";
      this.currentSelectionStatus.isProgramSelected = false;
      if (this.currentSelectionStatus.program && !this.isAllParameterSet) {
        this.currentSelectionStatus.message = "Please select program";
      }
    }
  }

  loadOrganisationUnits(){
    this.currentSelectionStatus.isOrgUnitLoaded = false;
    this.currentSelectionStatus.isProgramLoaded = true;
    this.OrganisationUnit.getOrganisationUnits(this.currentUser).then((organisationUnitsResponse : any)=>{
      this.organisationUnits = organisationUnitsResponse.organisationUnits;
      this.currentSelectionStatus.isOrgUnitLoaded = true;
      this.setProgramSelectionLabel();
      this.selectedOrganisationUnit = organisationUnitsResponse.lastSelectedOrgUnit;
      this.selectedProgram = {};
      this.loadingPrograms();
      this.setProgramSelectionLabel();

    },error=>{
      this.loadingData = false;
      this.setToasterMessage('Fail to load organisation units : ' + JSON.stringify(error));
    });
  }

  openOrganisationUnitModal(){
    if(this.currentSelectionStatus && this.currentSelectionStatus.orgUnit){
      this.loadingMessages = [];
      this.loadingData = true;
      let modal = this.modalCtrl.create(OrganisationUnits,{
        organisationUnits : this.organisationUnits,
        currentUser : this.currentUser,
        lastSelectedOrgUnit:this.selectedOrganisationUnit
      });
      modal.onDidDismiss((selectedOrganisationUnit:any) => {
        if(selectedOrganisationUnit && selectedOrganisationUnit.id){
          if(selectedOrganisationUnit.id != this.selectedOrganisationUnit.id){
            this.selectedOrganisationUnit = selectedOrganisationUnit;
            this.selectedProgram = {};
            this.loadingPrograms();
            this.setProgramSelectionLabel();
            this.isAllParameterSet = false;
          }else{
            this.loadingData = false;
          }
        }else{
          this.loadingData = false;
        }
      });
      modal.present();
    }
  }

  loadingPrograms(){
    this.currentSelectionStatus.isProgramLoaded = false;
    this.assignedPrograms = [];
    let lastSelectedProgram = this.Program.getLastSelectedProgram();
    this.Program.getProgramsAssignedOnOrgUnitAndUserRoles(this.selectedOrganisationUnit,this.programIdsByUserRoles,this.currentUser).then((programs : any)=>{
      programs.forEach((program:any)=>{
        //checking for program type
        if(program.programType ==  "WITHOUT_REGISTRATION"){
          if(lastSelectedProgram && lastSelectedProgram.id){
            this.selectedProgram = lastSelectedProgram;
            this.setSelectedProgram(lastSelectedProgram);
          }
          this.assignedPrograms.push({
            id: program.id,
            name: program.name,
            programStages : program.programStages,
            categoryCombo : program.categoryCombo
          });
        }
      });
      if(!(this.selectedProgram && this.selectedProgram.id) && programs.length > 0){
        this.selectedProgram = programs[0];
        this.Program.setLastSelectedProgram(this.selectedProgram);
        this.setSelectedProgram(this.selectedProgram);
      }
      this.currentSelectionStatus.isProgramLoaded = true;
      this.loadingData = false;
    },error=>{
      this.loadingData = false;
      this.setToasterMessage("Fail to load assigned programs : " + JSON.stringify(error));
    });
  }

  openProgramsModal(){
    if(this.currentSelectionStatus && this.currentSelectionStatus.program){
      if(this.assignedPrograms.length > 0){
        let modal = this.modalCtrl.create(ProgramSelection,{data : this.assignedPrograms,selectedProgram : this.selectedProgram});
        modal.onDidDismiss((selectedProgram:any) => {
          if(selectedProgram && selectedProgram.id){
            if(selectedProgram.id != this.selectedProgram.id){
              this.selectedProgram = selectedProgram;
              this.Program.setLastSelectedProgram(selectedProgram);
              this.setSelectedProgram(selectedProgram);
            }else{
              this.loadingData = false;
            }
          }else{
            this.loadingData = false;
          }
        });
        modal.present();
      }else{
        this.setToasterMessage("No program to select on " + this.selectedOrganisationUnitLabel);
      }
    }else{
      this.setToasterMessage("Please select organisation unit first");
    }
  }

  setSelectedProgram(selectedProgram){
    this.loadingProgramStageDataElements(selectedProgram);
    this.selectedDataDimension = [];
    this.loadingData = false;
    this.setProgramSelectionLabel();
    this.isAllParameterSet = false;
    if(selectedProgram.categoryCombo.categories[0].name =='default'){
      this.loadEvents();
    }else {
      let index = 0;
      for(let category of selectedProgram.categoryCombo.categories){
        this.selectedDataDimension[index] = category.categoryOptions[0].id;
        index = index + 1;
      }
      this.checkingForDataDimension();
    }
  }

  loadingProgramStageDataElements(program){
    this.dataElementToDisplay = {};
    this.ProgramStageDataElements.getProgramStageDataElements(program.programStages[0].programStageDataElements,this.currentUser).then((programStageDataElements:any)=>{
      this.programStageDataElements = programStageDataElements;
      let index = 0;
      for(let programStageDataElement of programStageDataElements){
        if(index < 2){
          this.dataElementToDisplay[programStageDataElement.dataElement.id] = programStageDataElement.dataElement;
        }
        this.dataElementMapper[programStageDataElement.dataElement.id] = programStageDataElement.dataElement;
        index = index + 1;
      }
    })
  }

  /**
   * checking if category combination for program as  been selected or not
   */
  checkingForDataDimension(){
    if(this.selectedDataDimension.length == this.selectedProgram.categoryCombo.categories.length){
      let hasAllDataDimension = true;
      this.selectedDataDimension.forEach((dataDimension : any)=>{
        if(dataDimension.trim() == ""){
          hasAllDataDimension = false;
        }
      });
      if(hasAllDataDimension){
        this.loadEvents();
      }
    }
  }

  /**
   * load events
   */
  loadEvents(){
    this.isAllParameterSet = true;
    this.currentSelectionStatus.isEventsLoadedFromServer = false;
    this.network = this.NetworkAvailability.getNetWorkStatus();
    if(!this.network.isAvailable){
      this.loadEventsFromOfflineStorage();
    }else{
      //this.setNotificationToasterMessage("Checking most recent events from server");
      this.currentSelectionStatus.eventsLoadingStatus = "Checking most recent events from server";
      this.eventProvider.loadEventsFromServer(this.selectedOrganisationUnit,this.selectedProgram,this.selectedDataDimension,this.currentUser).then((eventsFromServer : any)=>{
        if(eventsFromServer.events && eventsFromServer.events.length > 0){
          eventsFromServer.events.forEach((event)=>{
            event["orgUnitName"] = this.selectedOrganisationUnit.name;
            event["programName"] = this.selectedProgram.name;
          });
        }
        this.currentSelectionStatus.eventsLoadingStatus = "Saving most recent events";
        this.eventProvider.savingEventsFromServer(eventsFromServer,this.currentUser).then(()=>{
          this.loadEventsFromOfflineStorage();
        },error=>{
          this.setToasterMessage("Fail to save most recent events ");
          console.log(JSON.stringify(error));
        });
      },error=>{
        this.setToasterMessage("Fail to download most recent events ");
        this.loadEventsFromOfflineStorage();
        console.log(JSON.stringify(error));
      });
    }



  }

  /**
   * loading all events based on selected option from offline storage
   */
  loadEventsFromOfflineStorage(){
    //this.setNotificationToasterMessage("Checking offline events");
    this.currentSelectionStatus.isEventsLoadedFromServer = false;
    this.currentSelectionStatus.eventsLoadingStatus = "Checking available offline events";
    this.eventProvider.loadingEventsFromStorage(this.selectedOrganisationUnit,this.selectedProgram,this.currentUser).then((events:any)=>{
      let currentEvents = [];
      if(this.selectedDataDimension.length > 0){
        let attributeCategoryOptions = this.selectedDataDimension.toString();
        attributeCategoryOptions = attributeCategoryOptions.replace(/,/g, ';');
        events.forEach((event : any)=>{
          if(event.attributeCategoryOptions == attributeCategoryOptions){
            currentEvents.push(event);
          }
        });
      }else{
        currentEvents = events;
      }
      if(currentEvents.length > 0){
        this.hasEvents = true;
      }else{
        this.hasEvents = false;
      }
      this.currentEvents = currentEvents;
      this.loadEventListAsTable();
      //this.loadEventListAsListOfCards();
      this.currentSelectionStatus.isEventsLoadedFromServer = true;
    },error=>{
      this.loadingData = false;
      this.setToasterMessage("Fail to load events from offline storage : " + JSON.stringify(error));
    });
  }

  //@todo includes status and incident date on selection
  showFieldSelectionMenu(){
    let modal = this.modalCtrl.create(EventFieldSelectionMenu,{dataElementToDisplay: this.dataElementToDisplay,dataElementMapper:this.dataElementMapper});
    modal.onDidDismiss((dataElementToDisplayResponse:any)=>{
      if(dataElementToDisplayResponse){
        this.dataElementToDisplay = {};
        this.dataElementToDisplay = dataElementToDisplayResponse;
        this.loadEventListAsTable();
        //this.loadEventListAsListOfCards();
      }
    });
    modal.present();
  }

  loadEventListAsTable(){
    this.eventProvider.getEventListInTableFormat(this.currentEvents,this.dataElementToDisplay).then((table:any)=>{
      this.tableFormat = table;
      this.eventListSections = [];
      this.isAllParameterSet = true;
      this.loadingData = false;
    });
  }

  loadEventListAsListOfCards(){
    let currentEvents = this.currentEvents;
    this.eventProvider.getEventSections(currentEvents).then((eventSections:any)=>{
      this.eventListSections = eventSections;
      this.tableFormat =  null;
      this.changePagination(0);
      this.isAllParameterSet = true;
      this.loadingData = false;
    });
  }

  /**
   * reload event
   */
  reLoadingEventList(){
    this.loadingMessages = [];
    this.loadingData = true;
    this.loadEventsFromOfflineStorage();
  }

  /**
   * navigate to event
   * @param event
   */
  goToEventView(event){
    let params = {
      orgUnitId : this.selectedOrganisationUnit.id,
      orgUnitName : this.selectedOrganisationUnit.name,
      programId : this.selectedProgram.id,
      programName : this.selectedProgram.name,
      event : event.event
    };
    this.navCtrl.push(EventView,{params:params});
  }

  /**
   * edit event
   * @param event
   */
  gotToEditEvent(event){
    let params = {
      orgUnitId : this.selectedOrganisationUnit.id,
      orgUnitName : this.selectedOrganisationUnit.name,
      programId : this.selectedProgram.id,
      programName : this.selectedProgram.name,
      selectedDataDimension : this.selectedDataDimension,
      event : event.event
    };
    this.navCtrl.push(EventCaptureForm,{params:params});
  }

  changePagination(page){
    page = parseInt(page);
    if(page == -1){
      this.currentPage = 0;
    }else if(page == this.eventListSections.length){
      this.currentPage = this.eventListSections.length - 1;
    }else{
      this.currentPage = page;
    }
    this.paginationLabel = (this.currentPage + 1) + "/"+this.eventListSections.length;
  }

  goToEventRegister(){
    let params = {
      orgUnitId : this.selectedOrganisationUnit.id,
      orgUnitName : this.selectedOrganisationUnit.name,
      programId : this.selectedProgram.id,
      programName : this.selectedProgram.name,
      selectedDataDimension : this.selectedDataDimension,
      event : ""
    };
    this.navCtrl.push(EventCaptureForm,{params:params});
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

  setNotificationToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      position : 'top',
      duration: 1500
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
