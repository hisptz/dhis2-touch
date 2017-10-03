import {Component, OnInit} from '@angular/core';
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
  dataOnEvents: any;
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

  currentPeriodOffset: any;
  selectedOption: any;
  selectedPeriod: any;
  userRoleData: any;
  network: any;

  constructor(private navCtrl: NavController, private userProvider: UserProvider, private modalCtrl: ModalController,
              private organisationUnitsProvider: OrganisationUnitsProvider, private programsProvider: ProgramsProvider, private appProvider: AppProvider,
              private sqlLiteProvider: SqlLiteProvider, private eventProvider: EventsProvider, private dataElementsProvider: DataElementsProvider) {
  }

  ngOnInit() {
    this.icons.orgUnit = "assets/data-entry/orgUnit.png";
    this.icons.program = "assets/event-capture/program.png";

    this.selectedDataDimension = [];
    this.programIdsByUserRoles = [];
    this.programs = [];
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
          this.updateTrackerCaptureSelections();
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
      this.updateTrackerCaptureSelections();
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

  updateTrackerCaptureSelections() {
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
        this.updateTrackerCaptureSelections();
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
          this.programsProvider.setLastSelectedProgram(selectedProgram);
          this.updateTrackerCaptureSelections();
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
          this.updateTrackerCaptureSelections();
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
      this.updateTrackerCaptureSelections();
    }

  }


  loadEventsToDisplay() {
    this.dataOnEvents = [];
    this.usedDataElements = [];
    let currentEvents = [];

    this.eventProvider.downloadEventsFromServer(this.selectedOrgUnitId, this.selectedProgramId, this.currentUser).then((eventsData: any) => {
      let eventDataValues: any;


      eventsData.events.forEach((event: any) => {
        currentEvents.push(event)
      })

      if (eventsData.events.length !== 0) {
        this.showEmptyList = false;
        this.eventsData = eventsData.events;

        this.eventsData.forEach((eventInfo: any) => {
          eventDataValues = eventInfo.dataValues;

          eventDataValues.forEach((dataRow: any) => {

            this.usedDataElements.push(dataRow.dataElement);

            this.dataOnEvents.push({
              eventId: eventInfo.event,
              dataElementId: dataRow.dataElement,
              dataValue: dataRow.value
            })
          });
        });

      } else {
        this.showEmptyList = true;
        this.appProvider.setNormalNotification("There are no events to display on " + this.selectedProgram);
      }


      this.currentEvents = eventsData.events;
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
    let SortedDataElementIds = Array.from(new Set(this.usedDataElements));

    this.selectionList = SortedDataElementIds;


    SortedDataElementIds.forEach((list: any) => {
      this.dataElementsProvider.getDataElementsByName(list, this.currentUser).then((results: any) => {

        this.currentAvailableEvents.push({
          name: results[0].displayName,
          id: results[0].id
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


    this.dataOnEvents.forEach((data: any) => {
      this.tableFormatRow.push({
        event: data.eventId,
        value: data.dataValue,
        dataElmId: data.dataElementId
      });


    });

    //this.loadEventListAsTable();
  }


  showFieldSelectionMenu() {
    if (this.selectionList) {
      let modal = this.modalCtrl.create('EventFieldSelectionMenu', {
        dataElementToDisplay: this.currentEvents,
        dataElementMapper: this.currentAvailableEvents
      });
      modal.onDidDismiss((dataElementToDisplayResponse: any) => {
        // if(dataElementToDisplayResponse){
        //
        // }
      });
      modal.present();
    } else {
      this.appProvider.setNormalNotification("There are no selection options to display");
    }
  }


}
