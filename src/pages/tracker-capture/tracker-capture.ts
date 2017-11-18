import {Component, OnInit} from '@angular/core';
import {IonicPage, ModalController, NavController} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {ProgramsProvider} from "../../providers/programs/programs";
import {TrackerCaptureProvider} from "../../providers/tracker-capture/tracker-capture";
import {EventCaptureFormProvider} from "../../providers/event-capture-form/event-capture-form";
import {EnrollmentsProvider} from "../../providers/enrollments/enrollments";

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
              private eventCaptureFormProvider : EventCaptureFormProvider,
              private enrollmentsProvider : EnrollmentsProvider,
              private organisationUnitsProvider : OrganisationUnitsProvider) {
  }

  ionViewDidEnter() {
    if(this.isFormReady){
      this.loadingSavedTrackedEntityInstances(this.selectedProgram.id,this.selectedOrgUnit.id);
    }
    //this.testTracker();
  }

  testTracker(){
    this.trackerCaptureProvider.getTrackedEntityInstanceByStatus('not-synced',this.currentUser).then((trackedEntityInstances: any)=>{
      if(trackedEntityInstances.length > 0){
        this.trackerCaptureProvider.uploadTrackedEntityInstancesToServer(trackedEntityInstances,trackedEntityInstances,this.currentUser).then((trackedEntityInstanceIds : any)=>{
          this.enrollmentsProvider.getSavedEnrollmentsByAttribute('trackedEntityInstance',trackedEntityInstanceIds,this.currentUser).then((enrollments: any)=>{
            if(enrollments.length > 0){
              this.trackerCaptureProvider.uploadEnrollments(enrollments,this.currentUser).then(()=>{
                this.eventCaptureFormProvider.getEventsByAttribute('trackedEntityInstance',trackedEntityInstanceIds,this.currentUser).then((events : any)=>{
                  if(events && events.length > 0){
                    this.eventCaptureFormProvider.uploadEventsToSever(events,this.currentUser).then(()=>{}).catch(()=>{});
                  }
                }).catch(()=>{});

              }).catch(error=>{});
            }
          }).catch(()=>{});

        }).catch(error=>{});
      }else{
        this.eventCaptureFormProvider.getEventsByStatusAndType('not-synced','tracker-capture',this.currentUser).then((events : any)=>{
          if(events && events.length > 0){
            this.eventCaptureFormProvider.uploadEventsToSever(events,this.currentUser).then(()=>{
            }).catch(()=>{});
          }
        }).catch(()=>{});
      }
    }).catch(()=>{});

    this.trackerCaptureProvider.getTrackedEntityInstanceByStatus('synced',this.currentUser).then((trackedEntityInstances: any)=>{
      console.log("Synced tracked entity : " + trackedEntityInstances.length);
    }).catch(()=>{});

    this.enrollmentsProvider.getSavedEnrollmentsByAttribute('syncStatus',['synced'],this.currentUser).then((enrollments: any)=>{
      console.log("Synced enrollments : " + enrollments.length);
    }).catch(()=>{});
  }

  ngOnInit(){
    this.icons.orgUnit = "assets/data-entry/orgUnit.png";
    this.icons.program = "assets/event-capture/program.png";
    this.trackedEntityInstances = [];
    this.attributeToDisplay = {};
    this.loadingMessage = "Loading. user information";
    this.isLoading = true;
    this.isFormReady = false;
    this.userProvider.getCurrentUser().then((currentUser: any)=>{
      this.currentUser = currentUser;
      this.userProvider.getUserData().then((userData : any)=>{
        this.programIdsByUserRoles = [];
        userData.userRoles.forEach((userRole:any)=>{
          if (userRole.programs) {
            userRole.programs.forEach((program:any)=>{
              this.programIdsByUserRoles.push(program.id);
            });
          }
        });
        this.organisationUnitsProvider.getLastSelectedOrganisationUnitUnit(currentUser).then((lastSelectedOrgUnit : any)=>{
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
    this.loadingMessage = "Loading assigned programs";
    let programType = "WITH_REGISTRATION";
    this.programsProvider.getProgramsAssignedOnOrgUnitAndUserRoles(this.selectedOrgUnit.id,programType,this.programIdsByUserRoles,this.currentUser).then((programs : any)=>{
      this.programs = programs;
      this.selectedProgram = this.programsProvider.lastSelectedProgram;
      if(this.selectedProgram && this.selectedProgram.id){
        this.trackerCaptureProvider.getTrackedEntityRegistration(this.selectedProgram.id,this.currentUser).then((programTrackedEntityAttributes : any)=>{
          this.programTrackedEntityAttributes = programTrackedEntityAttributes;
          this.updateTrackerCaptureSelections();
          this.isLoading = false;
          this.loadingMessage = "";
        }).catch(error=>{
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
      this.organisationUnitLabel = "Touch to select organisation Unit";
    }
    if(this.selectedProgram && this.selectedProgram.name){
      this.programLabel = this.selectedProgram.name;
    }else {
      this.programLabel = "Touch to select entry form";
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
          this.trackerCaptureProvider.getTrackedEntityRegistration(selectedProgram.id,this.currentUser).then((programTrackedEntityAttributes : any)=>{
            this.programTrackedEntityAttributes = programTrackedEntityAttributes;
            this.updateTrackerCaptureSelections();
          }).catch(error=>{
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
    this.trackerCaptureProvider.loadTrackedEntityInstancesList(programId,orgUnitId,this.currentUser).then((trackedEntityInstances : any)=>{
      this.trackedEntityInstances = trackedEntityInstances;
      this.renderDataAsTable();
    }).catch(error=>{
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
    this.loadingMessage = "Prepare table";
    this.trackerCaptureProvider.getTableFormatResult(this.attributeToDisplay,this.trackedEntityInstances).then((response : any)=>{
      this.tableLayout = response.table;
      this.trackedEntityInstancesIds = response.trackedEntityInstancesIds;
      this.isLoading = false;
    }).catch(error=>{
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
    modal.present().then((attributeToDisplay)=>{
    }).catch(error=>{
      console.log(JSON.stringify(error));
    });
  }

  registerNewTrackedEntity(){
    this.navCtrl.push("TrackerEntityRegisterPage",{});
  }

  openTrackedEntityDashboard(currentIndex){
    let trackedEntityInstancesId = this.trackedEntityInstancesIds[currentIndex];
    this.navCtrl.push("TrackedEntityDashboardPage",{trackedEntityInstancesId : trackedEntityInstancesId});
  }

}
