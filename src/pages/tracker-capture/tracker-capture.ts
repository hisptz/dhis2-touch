import {Component, OnInit} from '@angular/core';
import {IonicPage, ModalController, NavController} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {ProgramsProvider} from "../../providers/programs/programs";
import {TrackerCaptureProvider} from "../../providers/tracker-capture/tracker-capture";

/**
 * Generated class for the TrackerCapturePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tracker-capture',
  templateUrl: 'tracker-capture.html',
})
export class TrackerCapturePage implements OnInit{

  selectedOrgUnit : any;
  selectedProgram : any;
  currentUser: any;
  programIdsByUserRoles: Array<string>;
  isLoading : boolean;
  loadingMessage : string;
  organisationUnitLabel: string;
  programLabel: string;
  isFormReady : boolean;
  selectedDataDimension : Array<any>;
  programs : Array<any>;
  trackedEntityInstances : Array<any>;
  programTrackedEntityAttributes : Array<any>;
  trackedEntityInstancesIds : Array<string>;
  attributeToDisplay : any;
  icons : any = {};
  tableLayout : any;

  constructor(public navCtrl: NavController,private modalCtrl : ModalController,
              private userProvider : UserProvider,private appProvider : AppProvider,
              private programsProvider : ProgramsProvider,
              private trackerCaptureProvider : TrackerCaptureProvider,
              private organisationUnitsProvider : OrganisationUnitsProvider) {
  }

  ionViewDidEnter() {
    if(this.isFormReady){
      this.loadingSavedTrackedEntityInstances(this.selectedProgram.id,this.selectedOrgUnit.id);
    }
  }

  ngOnInit(){
    this.icons.orgUnit = "assets/icon/orgUnit.png";
    this.icons.program = "assets/icon/program.png";
    this.trackedEntityInstances = [];
    this.attributeToDisplay = {};
    this.loadingMessage = "loading_user_information";
    this.isLoading = true;
    this.isFormReady = false;
    this.userProvider.getCurrentUser().subscribe((currentUser: any)=>{
      this.currentUser = currentUser;
      this.userProvider.getUserData().subscribe((userData : any)=>{
        this.programIdsByUserRoles = [];
        userData.userRoles.forEach((userRole:any)=>{
          if (userRole.programs) {
            userRole.programs.forEach((program:any)=>{
              this.programIdsByUserRoles.push(program.id);
            });
          }
        });
        this.organisationUnitsProvider.getLastSelectedOrganisationUnitUnit(currentUser).subscribe((lastSelectedOrgUnit : any)=>{
          if(lastSelectedOrgUnit && lastSelectedOrgUnit.id){
            this.selectedOrgUnit = lastSelectedOrgUnit;
            this.loadingPrograms();
          }
          this.updateTrackerCaptureSelections();
        });
      });
    },error=>{
      this.isLoading = false;
      this.loadingMessage = "";
      this.appProvider.setNormalNotification("Fail to load user information");
    });
  }

  loadingPrograms(){
    this.isLoading = true;
    this.loadingMessage = "loading_assigned_programs";
    let programType = "WITH_REGISTRATION";
    this.programsProvider.getProgramsAssignedOnOrgUnitAndUserRoles(this.selectedOrgUnit.id,programType,this.programIdsByUserRoles,this.currentUser).subscribe((programs : any)=>{
      this.programs = programs;
      this.selectedProgram = this.programsProvider.lastSelectedProgram;
      if(this.selectedProgram && this.selectedProgram.id){
        this.trackerCaptureProvider.getTrackedEntityRegistration(this.selectedProgram.id,this.currentUser).subscribe((programTrackedEntityAttributes : any)=>{
          this.programTrackedEntityAttributes = programTrackedEntityAttributes;
          this.updateTrackerCaptureSelections();
          this.isLoading = false;
          this.loadingMessage = "";
        },error=>{
          this.isLoading = false;
          console.log(JSON.stringify(error));
          this.appProvider.setNormalNotification("Fail to load registration form for " + this.selectedProgram.name);
        });
      }else{
        this.updateTrackerCaptureSelections();
      }
    },error=>{
      this.isLoading = false;
      this.loadingMessage = "";
      console.log(JSON.stringify(error));
      this.appProvider.setNormalNotification("Fail to load assigned programs");
    });
  }

  updateTrackerCaptureSelections(){
    if(this.organisationUnitsProvider.lastSelectedOrgUnit){
      this.selectedOrgUnit = this.organisationUnitsProvider.lastSelectedOrgUnit;
      this.organisationUnitLabel = this.selectedOrgUnit.name;
    }else{
      this.organisationUnitLabel = "touch_to_select_organisation_unit";
    }
    if(this.selectedProgram && this.selectedProgram.name){
      this.programLabel = this.selectedProgram.name;
    }else {
      this.programLabel = "touch_to_select_program";
    }
    this.isFormReady = this.isAllParameterSelected();
    this.isLoading = false;
    this.loadingMessage = "";
    if(this.isFormReady){
      this.attributeToDisplay = {};
      if(this.programTrackedEntityAttributes && this.programTrackedEntityAttributes.length > 0){
        this.programTrackedEntityAttributes.forEach((programTrackedEntityAttribute : any)=>{
          if(programTrackedEntityAttribute.displayInList){
            let attribute = programTrackedEntityAttribute.trackedEntityAttribute;
            this.attributeToDisplay[attribute.id] = attribute.name;
          }
        });
      }
      this.loadingSavedTrackedEntityInstances(this.selectedProgram.id,this.selectedOrgUnit.id);
    }else{
      this.trackedEntityInstances = [];
    }
  }

  openOrganisationUnitTree(){
    let modal = this.modalCtrl.create('OrganisationUnitSelectionPage',{});
    modal.onDidDismiss((selectedOrgUnit : any)=>{
      if(selectedOrgUnit && selectedOrgUnit.id){
        this.selectedOrgUnit = selectedOrgUnit;
        this.updateTrackerCaptureSelections();
        this.loadingPrograms();
      }
    });
    modal.present();
  }

  openProgramList(){
    if(this.programs && this.programs.length > 0){
      let modal = this.modalCtrl.create('ProgramSelection',{
        currentProgram : this.selectedProgram, programsList : this.programs
      });
      modal.onDidDismiss((selectedProgram : any)=>{
        if(selectedProgram && selectedProgram.id){
          this.selectedProgram = selectedProgram;
          this.programsProvider.setLastSelectedProgram(selectedProgram);
          this.trackerCaptureProvider.getTrackedEntityRegistration(selectedProgram.id,this.currentUser).subscribe((programTrackedEntityAttributes : any)=>{
            this.programTrackedEntityAttributes = programTrackedEntityAttributes;
            this.updateTrackerCaptureSelections();
          },error=>{
            this.isLoading = false;
            console.log(JSON.stringify(error));
            this.appProvider.setNormalNotification("Fail to load registration form for " + this.selectedProgram.name);
          });
        }
      });
      modal.present();
    }else{
      this.appProvider.setNormalNotification("There are no program to select on " + this.selectedOrgUnit.name);
    }
  }

  loadingSavedTrackedEntityInstances(programId,orgUnitId){
    this.isLoading = true;
    this.loadingMessage = "Loading tracked entity list";
    this.trackerCaptureProvider.loadTrackedEntityInstancesList(programId,orgUnitId,this.currentUser).subscribe((trackedEntityInstances : any)=>{
      this.trackedEntityInstances = trackedEntityInstances;
      this.renderDataAsTable();
    },error=>{
      console.log(JSON.stringify(error));
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to load tracked entity list");
    });
  }

  isAllParameterSelected(){
    let result = false;
    if(this.selectedProgram && this.selectedProgram.name){
      result = true;
    }
    return result;
  }

  renderDataAsTable(){
    this.loadingMessage = "preparing_table";
    this.trackerCaptureProvider.getTableFormatResult(this.attributeToDisplay,this.trackedEntityInstances).subscribe((response : any)=>{
      this.tableLayout = response.table;
      this.trackedEntityInstancesIds = response.trackedEntityInstancesIds;
      this.isLoading = false;
    },error=>{
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to prepare table for display");
    });
  }

  hideAndShowColumns(){
    let modal = this.modalCtrl.create('TrackerHideShowColumnPage',{attributeToDisplay :this.attributeToDisplay,programTrackedEntityAttributes : this.programTrackedEntityAttributes});
    modal.onDidDismiss((attributeToDisplay : any)=>{
      if(attributeToDisplay){
        this.attributeToDisplay = attributeToDisplay;
        this.renderDataAsTable();
      }
    });
    modal.present();
  }

  registerNewTrackedEntity(){
    this.navCtrl.push("TrackerEntityRegisterPage",{});
  }

  openTrackedEntityDashboard(currentIndex){
    let trackedEntityInstancesId = this.trackedEntityInstancesIds[currentIndex];
    this.navCtrl.push("TrackedEntityDashboardPage",{trackedEntityInstancesId : trackedEntityInstancesId});
  }

}
