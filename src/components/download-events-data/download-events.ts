import {Component, OnInit} from '@angular/core';
import {AppProvider} from "../../providers/app/app";
import {ProgramsProvider} from "../../providers/programs/programs";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {ModalController, NavController, NavParams} from "ionic-angular";
import {UserProvider} from "../../providers/user/user";
import {EventsProvider} from "../../providers/events/events";
// import indexOf = L.Util.indexOf;

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


  icons: any= {};
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
              public organisationUnitsProvider: OrganisationUnitsProvider, public programsProvider: ProgramsProvider, public appProvider: AppProvider,
              public eventsProvider: EventsProvider) {

  }


  ngOnInit(){

    this.icons.orgUnit = "assets/download-data/orgUnit.png";
    this.icons.program = "assets/download-data/programs.png";

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

        this.eventsProvider.setLastChoosedOrgUnit(selectedOrgUnit.id);

      }
    });
    modal.present();


  }

  loadingPrograms() {
    this.assignedPrograms = [];
    let lastSelectedProgram = this.programsProvider.getLastSelectedProgram();

     this.programsProvider.getProgramsSource(this.selectedOrgUnit, this.currentUser.currentDatabase).then((programs: any) => {

    } ,error=>{
      this.appProvider.setNormalNotification("Fail to reload Assigned Programs");
    });
  }



  openProgramList(){

    if(this.programNamesByUserRoles.length > 0){

      let modal = this.modalCtrl.create('ProgramSelection',{data : this.programNamesByUserRoles, currentProgram :this.selectedProgram  });
      modal.onDidDismiss((selectedProgram : any)=>{
        if(selectedProgram.length > 0){
          this.selectedProgram = selectedProgram;

          this.updateEventSelections();

          this.programsProvider.getProgramByName(selectedProgram, this.currentUser).then((programID: any)=> {

          });

        }
      });
      modal.present();
    }else{
      this.appProvider.setNormalNotification("There.. are no entry form to select on " + this.selectedOrgUnit.name );
    }
  }

  donwloadEvents(){
    let choosedOrgUnit = this.eventsProvider.getLastChoosedOrgUnit();

    this.eventsProvider.downloadEventsFromServer(choosedOrgUnit,null, this.currentUser).then((events: any)=> {
      let eventsData = events.events;
      if(eventsData && eventsData.length > 0){
        eventsData.forEach((event)=>{
          event["orgUnitName"] = this.selectedOrgUnit.name;
          event["programName"] = this.selectedProgram.name;
        });
        alert("Events Data: "+JSON.stringify(eventsData))
      }
    })

  }


}
