import { Component,OnInit } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {ProgramsProvider} from "../../providers/programs/programs";
import {AppProvider} from "../../providers/app/app";
import {ProgramSelection} from "../program-selection/program-selection";
import {PeriodSelectionProvider} from "../../providers/period-selection/period-selection";
import {SqlLiteProvider} from "../../providers/sql-lite/sql-lite";
import {EventsProvider} from "../../providers/events/events";
import {NetworkAvailabilityProvider} from "../../providers/network-availability/network-availability";
import {ProgramStageDataElementsProvider} from "../../providers/program-stage-data-elements/program-stage-data-elements";
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
  selectedOrgUnit : any;
  selectedOrgUnitId: any;
  selectedProgram: any;
  selectedProgramStages: any;
  organisationUnitLabel: string;
  programLabel: string;
  periodLabel: string;
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
  currentSelectionStatus :any = {};
  eventsData: any;


  currentPeriodOffset: any;
  selectedOption: any;
  selectedPeriod : any;
  icons: any = {};
  userRoleData: any;
  network : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public user: UserProvider, private modalCtrl : ModalController,
              public organisationUnitsProvider: OrganisationUnitsProvider, public programsProvider: ProgramsProvider, public appProvider: AppProvider,
              public periodSelectionProvider: PeriodSelectionProvider, public sqlLiteProvider: SqlLiteProvider, public eventProvider: EventsProvider,
              public NetworkAvailability : NetworkAvailabilityProvider, public programStageDataElement:ProgramStageDataElementsProvider,
              public dataElementsProvider:DataElementsProvider) {
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


    //alert("UnitId : "+this.selectedOrgUnitId+ " progId :"+this.selectedProgramId)


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

     })


     let attributeVaue = [this.selectedOrgUnit.id];
     this.organisationUnitsProvider.getOrgUnitprogramsFromServer(attributeVaue, this.currentUser).then((response)=>{
       let orgUnitPrograms = response["programs"];

         programTable.forEach((programData:any)=>{

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

       });
       this.programLoading = false;
     }, error=>{});

   }



  openProgramList(){


    if(this.programNamesByUserRoles.length > 0){
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

    })

    this.hasOptionsCategory()

  }

  hasOptionsCategory(){
    if(this.assignedProgramCategoryOptions.length > 0){
      this.hasOptions = true;
    }else {
      this.hasOptions = false;
      //this.loadEventsToDisplay();
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
        //this.loadEventsToDisplay();


      });
      modal.present();

    }else{
      this.appProvider.setNormalNotification("There are no Implementing partner's to select on "+this.selectedProgram );
    }
  }









}
