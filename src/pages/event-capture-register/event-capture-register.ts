import {Component, OnDestroy, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams,} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";
import {ProgramsProvider} from "../../providers/programs/programs";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {EventCaptureFormProvider} from "../../providers/event-capture-form/event-capture-form";

/**
 * Generated class for the EventCaptureRegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-capture-register',
  templateUrl: 'event-capture-register.html',
})
export class EventCaptureRegisterPage implements OnDestroy,OnInit{

  currentOrgUnit : any;
  currentProgram : any;
  programStage : any;
  currentUser : any;
  dataDimension : any;
  isLoading : boolean;
  loadingMessage : string;

  currentEvent : any;


  constructor(private navCtr : NavController, private userProvider : UserProvider,
              private params : NavParams,private programsProvider : ProgramsProvider,
              private eventCaptureFormProvider : EventCaptureFormProvider,
              private organisationUnitProvider : OrganisationUnitsProvider,
              private appProvider :AppProvider) {
  }

  ngOnInit(){
    this.currentProgram = this.programsProvider.lastSelectedProgram;
    this.currentOrgUnit = this.organisationUnitProvider.lastSelectedOrgUnit;
    this.loadingMessage = "Loading user information";
    this.isLoading = true;
    this.dataDimension = this.params.get('dataDimension');
    this.userProvider.getCurrentUser().then((user: any)=>{
      this.currentUser = user;
      this.loadProgramStages(this.currentProgram.id);
    }).catch(error=>{
      console.log(JSON.stringify(error));
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to load user information");
    })
  }

  loadProgramStages(programId){
    this.loadingMessage = "Loading program stages " + this.currentProgram.name;
    this.eventCaptureFormProvider.getProgramStages(programId,this.currentUser).then((programStages : any)=>{
      if(programStages && programStages.length > 0){
        this.programStage = programStages[0];
      }
      let eventId = this.params.get('eventId');
      if(eventId){
        this.loadingMessage = "Loading data from local storage";
        this.eventCaptureFormProvider.getEventsByAttribute("id",[eventId],this.currentUser).then((events : any)=>{
         if(events && events.length > 0){
            this.currentEvent = events[0];
          }
          this.isLoading = false;
        }).catch(error=>{
          this.isLoading = false;
          console.log("On loading event with id" + eventId);
          console.log(JSON.stringify(error));
        });
      }else{
        this.currentEvent = this.eventCaptureFormProvider.getEmptyEvent(this.currentProgram,this.currentOrgUnit,this.programStage.id,this.dataDimension.attributeCos,this.dataDimension.attributeCc,'evemt-capture');
        this.isLoading = false;
      }
    }).catch(error=>{
      console.log(JSON.stringify(error));
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to load program stages " + this.currentProgram.name);
    });
  }

  onEventDeleted(){
    this.navCtr.pop();
  }

  ngOnDestroy(){
    this.currentProgram = null;
    this.currentProgram = null;
  }

}
