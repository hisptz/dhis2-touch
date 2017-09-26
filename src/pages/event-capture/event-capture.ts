import { Component,OnInit } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {ProgramsProvider} from "../../providers/programs/programs";
import {AppProvider} from "../../providers/app/app";
import {ProgramSelection} from "../program-selection/program-selection";
import {PeriodSelectionProvider} from "../../providers/period-selection/period-selection";
import {SqlLiteProvider} from "../../providers/sql-lite/sql-lite";

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
  selectedProgram: any;
  organisationUnitLabel: string;
  programLabel: string;
  periodLabel: string;
  programs: any;
  assignedPrograms : any;

  currentPeriodOffset: any;
  selectedDataSet: any;
  selectedPeriod : any;
  icons: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public user: UserProvider, private modalCtrl : ModalController,
              public organisationUnitsProvider: OrganisationUnitsProvider, public programsProvider: ProgramsProvider, public appProvider: AppProvider,
              public periodSelectionProvider: PeriodSelectionProvider, public sqlLiteProvider: SqlLiteProvider) {
  }

  ngOnInit(){

    this.icons.orgUnit = "assets/event-capture/orgUnit.png";
    this.icons.program = "assets/event-capture/programs.png";
    this.icons.period = "assets/event-capture/period.png";

    this.selectedDataDimension = [];
      this.currentEvents = [];
      this.eventListSections = [];
      this.isAllParameterSet = false;
      this.user.getCurrentUser().then(currentUser=>{
        this.currentUser = currentUser;
        this.getUserAssignedPrograms();
       // this.setProgramSelectionLabel();
      });
    this.updateEventSelections();

    }

  updateEventSelections(){
    if(this.organisationUnitsProvider.lastSelectedOrgUnit){
      this.selectedOrgUnit = this.organisationUnitsProvider.lastSelectedOrgUnit;
      this.organisationUnitLabel = this.selectedOrgUnit.name;
    }else{
      this.organisationUnitLabel = "Touch to select organisation Unit";
    }
    if(this.programsProvider.lastSelectedProgram){
      this.programLabel = this.programsProvider.lastSelectedProgram;
    }else {
      this.programLabel = "Touch to select Programs";
    }


  }

  getUserAssignedPrograms(){
    this.programIdsByUserRoles = [];
    this.programNamesByUserRoles = [];
    this.user.getUserData().then((userData : any)=>{
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
    this.assignedPrograms = [];
    let lastSelectedProgram = this.programsProvider.getLastSelectedProgram();



     this.programsProvider.getProgramsAssignedOnOrgUnitAndUserRoles(this.selectedOrgUnit, this.programIdsByUserRoles, this.currentUser).then((programs: any) => {

       // its empty alert
      //alert("Assign Progs--- for modal: "+JSON.stringify(programs))

      this.selectedProgram = lastSelectedProgram;

      programs.forEach((program:any)=>{

          this.assignedPrograms.push({
            id: program.id,
            name: program.name,
            programStages : program.programStages,
            categoryCombo : program.categoryCombo
          });

      });

    } ,error=>{
      //this.appProvider.setNormalNotification("Fail to  Assigned Programs");
    });

    }


  openProgramList(){

    if(this.programNamesByUserRoles.length > 0){
      let modal = this.modalCtrl.create('ProgramSelection',{data : this.programNamesByUserRoles, currentProgram :this.selectedProgram  });
      modal.onDidDismiss((selectedProgram : any)=>{
        if(selectedProgram.length > 0){

          this.selectedProgram = selectedProgram;

          this.updateEventSelections();

        }
      });
      modal.present();
    }else{
      this.appProvider.setNormalNotification("There.. are no entry form to select on " + this.selectedOrgUnit.name );
    }
  }




}
