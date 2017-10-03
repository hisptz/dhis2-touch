import { Component,OnInit } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {ProgramsProvider} from "../../providers/programs/programs";
import {AppProvider} from "../../providers/app/app";
import {ProgramSelection} from "../program-selection/program-selection";
import {SqlLiteProvider} from "../../providers/sql-lite/sql-lite";
import {EventsProvider} from "../../providers/events/events";
import {DataElementsProvider} from "../../providers/data-elements/data-elements";

/**
 * Generated class for the EventCapturePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-capture',
  templateUrl: 'event-capture.html',
})
export class EventCapturePage implements OnInit{

  currentUser: any;
  programIdsByUserRoles: any;
  programNamesByUserRoles: any;
  selectedDataDimension = [];
  currentEvents: any;
  eventListSections: any;
  isAllParameterSet: boolean;
  showEmptyList:boolean = false;
  selectedOrgUnit : any;
  selectedOrgUnitId: any;
  selectedProgram: any;
  selectedProgramStages: any;
  organisationUnitLabel: string;
  programLabel: string;
  table:any;
  programs: any;
  assignedPrograms : any;
  selectedProgramId:any;
  selectedProgramCatCombo:any;
  assignedProgramCategoryOptions : any;
  programInfo : any;
  dataOnEvents:any;
  CategoryOptionLabel:any;
  programLoading: boolean = false;
  hasOptions: boolean = false;
  eventsData: any;
  rowData: any;
  tableFormatHeader: any;
  tableFormatRow:any;
  usedDataElements:any;
  selectionList:any = {};
  programStageDataElements:any;
  currentAvailableEvents:any;

  currentPeriodOffset: any;
  selectedOption: any;
  selectedPeriod : any;
  icons: any = {};
  userRoleData: any;
  network : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public user: UserProvider, private modalCtrl : ModalController,
              public organisationUnitsProvider: OrganisationUnitsProvider, public programsProvider: ProgramsProvider, public appProvider: AppProvider,
               public sqlLiteProvider: SqlLiteProvider, public eventProvider: EventsProvider, public dataElementsProvider:DataElementsProvider) {
  }

  ngOnInit(){

    this.icons.orgUnit = "assets/event-capture/orgUnit.png";
    this.icons.program = "assets/event-capture/program.png";
    this.icons.period = "assets/event-capture/period.png";
    this.icons.categoryOptions = 'assets/event-capture/programs.png';

    this.selectedDataDimension = [];
      this.currentEvents = [];
      this.eventListSections = [];
      this.isAllParameterSet = false;
      this.user.getCurrentUser().then(currentUser=>{
        this.currentUser = currentUser;
        this.getUserAssignedPrograms();
      });
    this.updateEventSelections();

    }

  updateEventSelections(){
    if(this.organisationUnitsProvider.lastSelectedOrgUnit){
      this.selectedOrgUnit = this.organisationUnitsProvider.lastSelectedOrgUnit;
      this.organisationUnitLabel = this.selectedOrgUnit.name;
      this.selectedOrgUnitId = this.selectedOrgUnit.id;
    }else{
      this.organisationUnitLabel = "Touch to select organisation Unit";
    }
    if(this.programsProvider.lastSelectedProgram){
      this.programLabel = this.programsProvider.lastSelectedProgram;
    }else {
      this.programLabel = "Touch to select Programs";
    }
    if(this.programsProvider.lastSelectedProgramCategoryOption){
      this.CategoryOptionLabel = this.programsProvider.lastSelectedProgramCategoryOption;
    }else {
      this.CategoryOptionLabel = "Touch to select options";
    }


  }

  getUserAssignedPrograms(){
    this.programIdsByUserRoles = [];
    this.programNamesByUserRoles = [];
    this.user.getUserData().then((userData : any)=>{

       this.userRoleData = userData.userRoles;
      userData.userRoles.forEach((userRole:any)=>{
        if (userRole.programs) {
          userRole.programs.forEach((program:any)=>{
            this.programIdsByUserRoles.push(program.id);
            this.programNamesByUserRoles.push(program.name);

          });
        }
      });
    });
  }

  openOrganisationUnitTree(){
    let modal = this.modalCtrl.create('OrganisationUnitSelectionPage',{});
    modal.onDidDismiss((selectedOrgUnit : any)=>{
      if(selectedOrgUnit && selectedOrgUnit.id){
        this.selectedOrgUnit = selectedOrgUnit;
        this.updateEventSelections();
        this.loadingPrograms();
      }
    });
    modal.present();
  }

   loadingPrograms() {
    this.programLoading = true;
    this.assignedPrograms = [];
    this.programInfo = [];

     let programTable:any;
     this.sqlLiteProvider.getAllDataFromTable("programs", this.currentUser.currentDatabase).then((responseAllData)=>{
       programTable = responseAllData;
       // alert("program Data are: "+JSON.stringify(programTable));
     });

     let attributeVaue = [this.selectedOrgUnit.id];
     this.organisationUnitsProvider.getOrgUnitprogramsFromServer(attributeVaue, this.currentUser).then((response)=>{
       let orgUnitPrograms = response["programs"];

         programTable.forEach((programData:any)=>{
           if(programData.programType === 'WITHOUT_REGISTRATION'){

             orgUnitPrograms.forEach((program:any)=>{

               if(programData.id === program.id){
                 let temCatg = programData.categoryCombo.categories;

                 this.assignedPrograms.push(programData.name)
                 this.programInfo.push({
                   id: programData.id,
                   name: programData.name,
                   programStages: programData.programStages,
                   categoryCombo: programData.categoryCombo,
                   categoryOptions: temCatg[0].categoryOptions
                 })
               }
             })

           }


       });
       this.programLoading = false;
     }, error=>{});

   }



  openProgramList(){
    if(this.assignedPrograms.length > 0){
      let modal = this.modalCtrl.create('ProgramSelection',{data : this.assignedPrograms, currentProgram :this.selectedProgram  });
      modal.onDidDismiss((selectedProgram : any)=>{
        if(selectedProgram.length > 0){

          this.selectedProgram = selectedProgram;
          this.programInfo.forEach((programs:any)=>{
            if(programs.name === this.selectedProgram){
              this.selectedProgramId = programs.id;
              this.selectedProgramStages = programs.programStages;
              this.selectedProgramCatCombo = programs.categoryCombo;
            }
          });

          this.updateEventSelections();
          this.loadProgramCategoryOptions();
        }
      });
      modal.present();
    }else{
      this.appProvider.setNormalNotification("There are no entry form to select on " + this.selectedOrgUnit.name );
    }
  }


  loadProgramCategoryOptions(){
    this.assignedProgramCategoryOptions = [];
    this.programInfo.forEach((programs:any)=>{
      if(programs.name === this.selectedProgram){

        programs.categoryOptions.forEach((option:any)=>{
          if(option.name === 'default'){
          }else {
            this.assignedProgramCategoryOptions.push(option.name);
          }
        })
      }
    });
    this.hasOptionsCategory()

  }

  hasOptionsCategory(){
    if(this.assignedProgramCategoryOptions.length > 0){
      this.hasOptions = true;
    }else {
      this.hasOptions = false;
      this.loadEventsToDisplay();
    }
  }


  openProgramCategoryOptions(){
    if(this.assignedProgramCategoryOptions.length > 0){

      let modal = this.modalCtrl.create('ProgramOptionsSelectionPage', {
        categoryOptions : this.assignedProgramCategoryOptions,
        title : "Implementing Partner's selection",
        currentSelection : this.selectedOption
      });
      modal.onDidDismiss((selectedOption : any)=>{

          this.selectedOption = selectedOption;
        this.updateEventSelections();
        this.loadEventsToDisplay();

      });
      modal.present();

    }else{
      this.appProvider.setNormalNotification("There are no Implementing partner's to select on "+this.selectedProgram );
    }
  }


  loadEventsToDisplay(){
    this.dataOnEvents =[];
    this.usedDataElements = [];
    let currentEvents = [];

    this.eventProvider.downloadEventsFromServer(this.selectedOrgUnitId,this.selectedProgramId, this.currentUser).then((eventsData:any)=>{
      let eventDataValues:any;


      eventsData.events.forEach((event:any)=>{
        currentEvents.push(event)
      })

       if(eventsData.events.length !== 0){
         this.showEmptyList = false;
         this.eventsData = eventsData.events;

         this.eventsData.forEach((eventInfo:any)=>{
           eventDataValues = eventInfo.dataValues;

           eventDataValues.forEach((dataRow:any)=>{

             this.usedDataElements.push(dataRow.dataElement);

             this.dataOnEvents.push({
               eventId: eventInfo.event,
               dataElementId: dataRow.dataElement ,
               dataValue: dataRow.value
             })
           });
         });

       }else {
         this.showEmptyList = true;
         this.appProvider.setNormalNotification("There are no events to display on "+this.selectedProgram );
       }


       this.currentEvents =  eventsData.events;
      this.loadEvents();

    })

  }


  loadEvents(){
    this.table = {
      header: [], rows: []
    };
    this.tableFormatHeader = [];
    this.tableFormatRow = [];
    this.rowData = {};
    this.currentAvailableEvents = [];
    let SortedDataElementIds = Array.from( new Set(this.usedDataElements) );

    this.selectionList = SortedDataElementIds;


    SortedDataElementIds.forEach((list:any)=> {
      this.dataElementsProvider.getDataElementsByName(list, this.currentUser).then((results: any) => {

        this.currentAvailableEvents.push({
          name:results[0].displayName,
          id:results[0].id
        })

        this.table.header.push({
          id: results[0].id,
          name: results[0].displayName
        })

        this.tableFormatHeader.push({
          name: results[0].displayName,
          id: results[0].id,
          // data: data.dataValue
           //data: this.tableFormatRow
        })
      });
    });


    this.dataOnEvents.forEach((data:any)=>{
      this.tableFormatRow.push({
        event: data.eventId,
        value: data.dataValue,
        dataElmId: data.dataElementId
      });


    });

    //this.loadEventListAsTable();
  }



  showFieldSelectionMenu(){
    if(this.selectionList){
    let modal = this.modalCtrl.create('EventFieldSelectionMenu',{dataElementToDisplay: this.currentEvents, dataElementMapper:this.currentAvailableEvents});
    modal.onDidDismiss((dataElementToDisplayResponse:any)=>{
      // if(dataElementToDisplayResponse){
      //
      // }
    });
    modal.present();
    }else{
      this.appProvider.setNormalNotification("There are no selection options to display");
    }
  }







}
