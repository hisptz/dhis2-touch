import {Component, OnInit} from '@angular/core';
import { IonicPage, ModalController, NavController} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {ProgramsProvider} from "../../providers/programs/programs";
import {AppProvider} from "../../providers/app/app";
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
  programStage : any;
  columnsToDisplay : any = {};
  icons: any = {};

  constructor(private navCtrl: NavController, private userProvider: UserProvider, private modalCtrl: ModalController,
              private organisationUnitsProvider: OrganisationUnitsProvider, private programsProvider: ProgramsProvider, private appProvider: AppProvider,
              private eventCaptureFormProvider:EventCaptureFormProvider) {
  }

  ngOnInit() {
    this.icons.orgUnit = "assets/data-entry/orgUnit.png";
    this.icons.program = "assets/event-capture/program.png";

    this.selectedDataDimension = [];
    this.programIdsByUserRoles = [];
    this.programs = [];
    this.loadingMessage = "Loading user information";
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
        this.loadProgramStages(this.selectedProgram.id);
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
          this.programsProvider.setLastSelectedProgram(selectedProgram);
          this.updateEventCaptureSelections();
          this.updateDataSetCategoryCombo(this.selectedProgram.categoryCombo);
          this.loadProgramStages(selectedProgram.id);
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
    }
  }

  loadProgramStages(programId){
    this.loadingMessage = "Loading program stages " + this.selectedProgram.name;
    this.columnsToDisplay = {};
    this.eventCaptureFormProvider.getProgramStages(programId,this.currentUser).then((programStages : any)=>{
      if(programStages && programStages.length > 0){
        this.programStage = programStages[0];
        if(this.programStage.programStageDataElements){
          //@todo form label to be incorporate here
          this.programStage.programStageDataElements.forEach((programStageDataElement : any)=>{
            if(programStageDataElement.dataElement && programStageDataElement.dataElement.id){
              //formName
              this.columnsToDisplay[programStageDataElement.dataElement.id] =programStageDataElement.dataElement.displayName;
            }
          });
        }
      }
    }).catch(error=>{
      console.log(JSON.stringify(error));
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to load program stages " + this.selectedProgram.name);
    });
  }

  hideAndShowColumns() {
    let modal = this.modalCtrl.create('EventHideShowColumnPage',{columnsToDisplay : this.columnsToDisplay,programStage : this.programStage});
    modal.onDidDismiss((columnsToDisplay : any)=>{
      if(columnsToDisplay){
        console.log(columnsToDisplay);
      }
    });
    modal.present().then(()=>{});
  }

  goToEventView(event){
    let params = {dataDimension : this.getDataDimensions()};
    this.navCtrl.push('EventCaptureRegisterPage',params);
  }

  goToEventRegister(){
    let params = {dataDimension : this.getDataDimensions()};
    this.navCtrl.push('EventCaptureRegisterPage',params);
  }



}
