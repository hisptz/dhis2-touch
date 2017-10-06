import {Component, OnInit} from '@angular/core';
import {FabContainer, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {ProgramsProvider} from "../../providers/programs/programs";
import {AppProvider} from "../../providers/app/app";
import {ProgramSelection} from "../program-selection/program-selection";
import {SqlLiteProvider} from "../../providers/sql-lite/sql-lite";
import {EventsProvider} from "../../providers/events/events";
import {DataElementsProvider} from "../../providers/data-elements/data-elements";
import {EventCaptureFormProvider} from "../../providers/event-capture-form/event-capture-form";

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
export class EventCapturePage implements OnInit {


  selectedOrgUnit: any;
  selectedProgram: any;
  currentUser: any;
  programIdsByUserRoles: Array<string>;
  isLoading: boolean;
  loadingMessage: string;
  organisationUnitLabel: string;
  programLabel: string;
  isFormReady: boolean;
  isProgramDimensionApplicable: boolean;
  programDimensionNotApplicableMessage: string;
  programCategoryCombo: any;
  selectedDataDimension: Array<any>;
  programs: Array<any>;
  icons: any = {};
  loadingData:boolean = false;
  tableFormat: any;



  attibCc:any;
  attribCos:any;


  programNamesByUserRoles: any;
  currentEvents: any;
  eventListSections: any;
  isAllParameterSet: boolean;
  showEmptyList: boolean = false;
  selectedOrgUnitId: any;
  selectedProgramStages: any;
  table: any;
  assignedPrograms: any;
  selectedProgramId: any;
  selectedProgramCatCombo: any;
  assignedProgramCategoryOptions: any;
  programInfo: any;
  //dataOnEvents: any;
  CategoryOptionLabel: any;
  programLoading: boolean = false;
  hasOptions: boolean = false;
  eventsData: any;
  rowData: any;
  tableFormatHeader: any;
  tableFormatRow: any;
  usedDataElements: any;
  selectionList: any = {};
  programStageDataElements: any;
  currentAvailableEvents: any;
  currentAvailableOnEvents: any;

  currentPeriodOffset: any;
  selectedOption: any;
  selectedPeriod: any;
  userRoleData: any;
  network: any;

  constructor(private navCtrl: NavController, private userProvider: UserProvider, private modalCtrl: ModalController,
              private organisationUnitsProvider: OrganisationUnitsProvider, private programsProvider: ProgramsProvider, private appProvider: AppProvider,
              private sqlLiteProvider: SqlLiteProvider, private eventProvider: EventsProvider, private dataElementsProvider: DataElementsProvider,
              private eventCaptureFormProvider:EventCaptureFormProvider) {
  }

  ngOnInit() {
    this.icons.orgUnit = "assets/data-entry/orgUnit.png";
    this.icons.program = "assets/event-capture/program.png";

    this.selectedDataDimension = [];
    this.programIdsByUserRoles = [];
    this.programs = [];
    this.currentEvents = [];
    this.loadingMessage = "Loading. user information";
    this.isLoading = true;
    this.isFormReady = false;
    this.isProgramDimensionApplicable = false;
    this.userProvider.getCurrentUser().then((currentUser: any) => {
      this.currentUser = currentUser;
      this.userProvider.getUserData().then((userData: any) => {
        this.programIdsByUserRoles = [];
        userData.userRoles.forEach((userRole: any) => {
          if (userRole.programs) {
            userRole.programs.forEach((program: any) => {
              this.programIdsByUserRoles.push(program.id);
            });
          }
        });
        this.organisationUnitsProvider.getLastSelectedOrganisationUnitUnit(currentUser).then((lastSelectedOrgUnit: any) => {
          if (lastSelectedOrgUnit && lastSelectedOrgUnit.id) {
            this.selectedOrgUnit = lastSelectedOrgUnit;
            this.loadingPrograms();
          }
          this.updateEventCaptureSelections();
        });
      });
    }, error => {
      this.isLoading = false;
      this.loadingMessage = "";
      this.appProvider.setNormalNotification("Fail to load user information");
    });
  }

  loadingPrograms() {
    this.isLoading = true;
    this.loadingMessage = "Loading assigned programs";
    let programType = "WITHOUT_REGISTRATION";
    this.programsProvider.getProgramsAssignedOnOrgUnitAndUserRoles(this.selectedOrgUnit.id, programType, this.programIdsByUserRoles, this.currentUser).then((programs: any) => {
      this.programs = programs;
      this.selectedProgram = this.programsProvider.lastSelectedProgram;
      this.updateEventCaptureSelections();
      if(this.selectedProgram && this.selectedProgram.categoryCombo){
        this.updateDataSetCategoryCombo(this.selectedProgram.categoryCombo);
      }
      this.isLoading = false;
      this.loadingMessage = "";
    }, error => {
      this.isLoading = false;
      this.loadingMessage = "";
      console.log(JSON.stringify(error));
      this.appProvider.setNormalNotification("Fail to load assigned programs");
    });
  }

  updateEventCaptureSelections() {
    if (this.organisationUnitsProvider.lastSelectedOrgUnit) {
      this.selectedOrgUnit = this.organisationUnitsProvider.lastSelectedOrgUnit;
      this.organisationUnitLabel = this.selectedOrgUnit.name;
    } else {
      this.organisationUnitLabel = "Touch to select organisation Unit";
    }
    if (this.selectedProgram && this.selectedProgram.name) {
      this.programLabel = this.selectedProgram.name;
    } else {
      this.programLabel = "Touch to select entry form";
    }
    this.isFormReady = this.isAllParameterSelected();
    this.isLoading = false;
    this.loadingMessage = "";
  }

  openOrganisationUnitTree() {
    let modal = this.modalCtrl.create('OrganisationUnitSelectionPage', {});
    modal.onDidDismiss((selectedOrgUnit: any) => {
      if (selectedOrgUnit && selectedOrgUnit.id) {
        this.selectedOrgUnit = selectedOrgUnit;
        this.updateEventCaptureSelections();
        this.loadingPrograms();
      }
    });
    modal.present();
  }

  openProgramList() {
    if (this.programs && this.programs.length > 0) {
      let modal = this.modalCtrl.create('ProgramSelection', {
        currentProgram: this.selectedProgram, programsList: this.programs
      });
      modal.onDidDismiss((selectedProgram: any) => {
        if (selectedProgram && selectedProgram.id) {
          this.selectedProgram = selectedProgram;

          this.eventCaptureFormProvider.loadingprogramInfo(this.selectedProgram.id,this.currentUser);

          this.programsProvider.setLastSelectedProgram(selectedProgram);
          this.updateEventCaptureSelections();
          this.updateDataSetCategoryCombo(this.selectedProgram.categoryCombo);
        }
      });
      modal.present();
    } else {
      this.appProvider.setNormalNotification("There are no program to select on " + this.selectedOrgUnit.name);
    }
  }

  openDataDimensionSelection(category){
    if(category.categoryOptions && category.categoryOptions && category.categoryOptions.length > 0){
      let currentIndex = this.programCategoryCombo.categories.indexOf(category);
      let modal = this.modalCtrl.create('DataDimensionSelectionPage', {
        categoryOptions : category.categoryOptions,
        title : category.name + "'s selection",
        currentSelection : (this.selectedDataDimension[currentIndex]) ? this.selectedDataDimension[currentIndex]: {}
      });
      modal.onDidDismiss((selectedDataDimension : any)=>{
        if(selectedDataDimension && selectedDataDimension.id ){
          this.selectedDataDimension[currentIndex] = selectedDataDimension;
          this.updateEventCaptureSelections();
        }
      });
      modal.present();
    }else{
      let message = "There is no option for " + category.name + " that associated with " + this.selectedOrgUnit.name;
      this.appProvider.setNormalNotification(message);
    }
  }

  getDataDimensions(){
    if(this.selectedProgram && this.selectedProgram.categoryCombo){
      let attributeCc = this.selectedProgram.categoryCombo.id;
      let attributeCos = "";
      this.selectedDataDimension.forEach((dimension : any,index:any)=>{
        if(index == 0){
          attributeCos +=dimension.id;
        }else{
          attributeCos += ";" + dimension.id;
        }
      });
      this.attibCc = attributeCc;
      this.attribCos = attributeCos;
      return {attributeCc : attributeCc,attributeCos:attributeCos};
    }else{
      return {};
    }
  }

  isAllParameterSelected() {
    let isFormReady = true;
    if (this.selectedProgram && this.selectedProgram.name && this.selectedProgram.categoryCombo.name && this.selectedProgram.categoryCombo.name != 'default') {
      if(this.selectedDataDimension && this.selectedDataDimension.length > 0 && this.programCategoryCombo && this.programCategoryCombo.categories && this.selectedDataDimension.length == this.programCategoryCombo.categories.length){
        let count = 0;
        this.selectedDataDimension.forEach(()=>{
          count ++;
        });
        if(count != this.selectedDataDimension.length){
          isFormReady = false;
        }
      }else{
        isFormReady = false;
      }
    }
    return isFormReady;
  }

  updateDataSetCategoryCombo(categoryCombo){
    if(categoryCombo){
      let programCategoryCombo  = {};
      this.isProgramDimensionApplicable = false;
      if(categoryCombo.name != 'default'){
        programCategoryCombo['id'] = categoryCombo.id;
        programCategoryCombo['name'] = categoryCombo.name;
        let categories = this.programsProvider.getProgramCategoryComboCategories(this.selectedOrgUnit.id,categoryCombo.categories);
        programCategoryCombo['categories'] = categories;
        this.isProgramDimensionApplicable = true;
        this.programDimensionNotApplicableMessage = "All";
        categories.forEach((category: any)=>{
          if(category.categoryOptions && category.categoryOptions.length == 0){
            this.programDimensionNotApplicableMessage = this.programDimensionNotApplicableMessage + " " + category.name.toLowerCase();
            this.isProgramDimensionApplicable = false;
          }
        });
        this.programDimensionNotApplicableMessage += " disaggregation are restricted from entry in " + this.selectedOrgUnit.name + ", choose a different form or contact your support desk";
      }
      this.selectedDataDimension = [];
      this.programCategoryCombo = programCategoryCombo;
      this.updateEventCaptureSelections();
      this.loadEventsToDisplay();
    }

  }


  loadEventsToDisplay() {
    this.loadingData = true;
    //this.dataOnEvents = [];
    this.usedDataElements = [];
    let currentEventsProgramsStage = [];

    //this.eventCaptureFormProvider.loadingprogramInfo(this.selectedProgram.id,this.currentUser);

    this.eventProvider.downloadEventsFromServer(this.selectedOrgUnit, this.selectedProgram, this.currentUser).then((eventsData: any) => {
      // this.eventProvider.loadEventsFromServer(this.selectedOrgUnit, this.selectedProgram, this.selectedProgram.categoryCombo.id, this.attibCc, this.attribCos,this.currentUser).then((eventsData: any) => {
      let eventDataValues: any;

      // alert("EventsData : "+JSON.stringify(eventsData))

      eventsData.events.forEach((event: any) => {
        currentEventsProgramsStage.push(event.programStage)

      })

      if (eventsData.events.length !== 0) {
        this.showEmptyList = false;
        this.eventsData = eventsData.events;

        this.eventsData.forEach((eventInfo: any) => {
          eventDataValues = eventInfo.dataValues;

          eventDataValues.forEach((dataRow: any) => {

            this.usedDataElements.push(dataRow.dataElement);

            // this.dataOnEvents.push({
            //   eventId: eventInfo.event,
            //   dataElementId: dataRow.dataElement,
            //   dataValue: dataRow.value
            // })
          });
        });

      } else {
        this.showEmptyList = true;
        this.tableFormat = false;
        this.appProvider.setNormalNotification("There are no events to display on " + this.selectedProgram.name);
      }

      this.currentEvents = eventsData.events;
      // alert("EventsData ProgStage: "+JSON.stringify(this.currentEvents[0].programStage))
      // Array.from(new Set(currentEventsProgramsStage))
      // alert("EventsData ProgStage: "+JSON.stringify(Array.from(new Set(currentEventsProgramsStage))))
      this.loadEvents();

    })

  }


  loadEvents() {
    this.table = {
      header: [], rows: []
    };
    this.tableFormatHeader = [];
    this.tableFormatRow = [];
    this.rowData = {};
    this.currentAvailableEvents = [];
    this.currentAvailableOnEvents = [];
    let SortedDataElementIds = Array.from(new Set(this.usedDataElements));

    this.selectionList = SortedDataElementIds;



    SortedDataElementIds.forEach((list: any) => {
      this.dataElementsProvider.getDataElementsByName(list, this.currentUser).then((results: any) => {

        this.currentAvailableEvents.push({
          name: results[0].displayName,
          id: results[0].id
        });
        this.currentAvailableOnEvents.push({
          name: results[0].displayName,
          id: list
        });


        if(SortedDataElementIds.length == this.currentAvailableEvents.length){
          this.loadEventListAsTable();
        }

      })
    });
  }


  loadEventListAsTable(){
    this.eventProvider.getEventListInTableFormat(this.currentEvents,this.currentAvailableEvents).then((table:any)=>{
      this.tableFormat = table;
      this.eventListSections = [];
    });
  }


  showFieldSelectionMenu(fab: FabContainer) {
    fab.close();
    if (this.tableFormat) {
      let modal = this.modalCtrl.create('EventFieldSelectionMenu', {
        dataElementToDisplay: this.currentEvents,
        dataElementMapper: this.currentAvailableOnEvents
      });
      modal.onDidDismiss((dataElementToDisplayResponse:any)=>{

        if(dataElementToDisplayResponse){
          this.currentAvailableEvents = dataElementToDisplayResponse;
          this.loadEventListAsTable();
        }
      });
      modal.present();
    } else {
      this.appProvider.setNormalNotification("There are no selection options to display");
    }
  }


  /**
   * navigate to event
   * @param event
   */
  goToEventView(event){
    let params = {
      orgUnitId : this.selectedOrgUnit.id,
      orgUnitName : this.selectedOrgUnit.name,
      programId : this.selectedProgram.id,
      programName : this.selectedProgram.name,
      event : event.event
    };
    this.navCtrl.push('EventView',{params:params});
  }


  goToEventRegister(fab: FabContainer){
    fab.close();
    let params = {
      selectedDataDimension : this.selectedDataDimension,
      event : ""
    };
    this.navCtrl.push('EventCaptureForm',{params:params});
  }



}
