import {Component, OnInit} from '@angular/core';
import {AppProvider} from "../../providers/app/app";
import {ProgramsProvider} from "../../providers/programs/programs";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {ModalController, NavController, NavParams} from "ionic-angular";
import {UserProvider} from "../../providers/user/user";

/**
 * Generated class for the DownloadEventsDataComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */

@Component({
  selector: 'download-events-data',
  templateUrl: 'download-events.html'
})
export class DownloadEventsDataComponent implements OnInit{

  text: string;

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
  programs: any;
  assignedPrograms : any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public user: UserProvider, private modalCtrl : ModalController,
              public organisationUnitsProvider: OrganisationUnitsProvider, public programsProvider: ProgramsProvider, public appProvider: AppProvider) {
    console.log('Hello DownloadEventsDataComponent Component');
    this.text = 'Hello World';
  }


  ngOnInit(){

    this.selectedDataDimension = [];
    this.currentEvents = [];
    this.eventListSections = [];
    this.isAllParameterSet = false;
    this.user.getCurrentUser().then(currentUser=>{
      this.currentUser = currentUser;
      this.getUserAssignedPrograms();
      // this.setProgramSelectionLabel();
    });
    this.updateDataEntryFormSelections();

  }

  updateDataEntryFormSelections(){
    if(this.organisationUnitsProvider.lastSelectedOrgUnit){
      this.selectedOrgUnit = this.organisationUnitsProvider.lastSelectedOrgUnit;
      this.organisationUnitLabel = this.selectedOrgUnit.name;
    }else{
      this.organisationUnitLabel = "Touch to select organisation Unit";
    }
    if(this.selectedProgram && this.selectedProgram.name){
      this.programLabel = this.selectedProgram.name;
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
          //alert("Assigned Progs UserRoles: "+JSON.stringify(this.programNamesByUserRoles))
        }
      });
      // this.loadOrganisationUnits();
    });
  }

  openOrganisationUnitTree(){
    let modal = this.modalCtrl.create('OrganisationUnitSelectionPage',{});
    modal.onDidDismiss((selectedOrgUnit : any)=>{
      if(selectedOrgUnit && selectedOrgUnit.id){
        this.selectedOrgUnit = selectedOrgUnit;
        this.updateDataEntryFormSelections();
        this.loadingEntryForm();
      }
    });
    modal.present();
  }

  loadingEntryForm() {
    this.assignedPrograms = [];
    let lastSelectedProgram = this.programsProvider.getLastSelectedProgram();
    this.programsProvider.getProgramsAssignedOnOrgUnitAndUserRoles(this.selectedOrgUnit, this.programIdsByUserRoles, this.currentUser).then((programs: any) => {


      alert("Assign Prog from OgUnit: "+JSON.stringify(programs));
      //this.programs = programs;
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
      this.appProvider.setNormalNotification("Fail to reload Assigned Programs");
    });

  }



  openEntryFormList(){
    alert("Assigned Progs UserRoles: "+JSON.stringify(this.programNamesByUserRoles));

    if(this.programNamesByUserRoles.length > 0){
      // if(this.assignedPrograms.length > 0){
      // if(this.programs && this.programs.length > 0){
      let modal = this.modalCtrl.create('ProgramSelection',{data : this.programNamesByUserRoles, currentProgram :this.selectedProgram  });
      modal.onDidDismiss((selectedProgram : any)=>{
        if(selectedProgram && selectedProgram.id && selectedProgram.id != this.selectedProgram.id){
          this.selectedProgram = selectedProgram;

          this.updateDataEntryFormSelections();
        }
      });
      modal.present();
    }else{
      this.appProvider.setNormalNotification("There.. are no entry form to select on " + this.selectedOrgUnit.name );
    }
  }


}
