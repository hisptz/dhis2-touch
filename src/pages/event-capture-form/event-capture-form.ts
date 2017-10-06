import { Component,OnInit } from '@angular/core';
import {ToastController, NavParams, ActionSheetController, NavController, IonicPage} from 'ionic-angular';
import {EventsProvider} from "../../providers/events/events";
import {ProgramsProvider} from "../../providers/programs/programs";
import {UserProvider} from "../../providers/user/user";
import {ProgramStageSectionsProvider} from "../../providers/program-stage-sections/program-stage-sections";
import {EventCaptureFormProvider} from "../../providers/event-capture-form/event-capture-form";
import {DataElementsProvider} from "../../providers/data-elements/data-elements";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";

declare var dhis2: any;

/*
 Generated class for the EventCaptureForm page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-event-capture-form',
  templateUrl: 'event-capture-form.html',
})
export class EventCaptureForm implements OnInit{

  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public loadingMessage : string ="";
  public currentUser : any;
  public currentOrgUnit : any;
  public currentProgram : any;

  public entryFormParameter : any;

  public programStageDataElements : any;
  public programStageSections : any;
  public entryFormSections : any;
  public event : any;
  public dataValues : any;
  public eventComment : string;
  programStages:any;

  loaded:boolean = false;
  reportDateTag:any;
  displayTag:any;

  usedDataElements: any;
  dataElementsInUse:any;
  programTracked: any;
  programOrgUnits:any;
  programRules:any;
  programRulesVariables:any;
  programRulesIndicators:any;
  programStageArrays:any;
  programStage:any;
  programObject: any = { name:"", id:"", enrollmentDateLabel:"", programType:"", onlyEnrollOnce:"", completeEventsExpiryDays:"", ignoreOverdueEvents:"",
    skipOffline:"",     selectIncidentDatesInFuture:"", incidentDateLabel:"",  withoutRegistration:"", captureCoordinates:"", displayFrontPageList:"",
    useFirstStageDuringRegistration:"", categoryCombo: "", programRuleVariables:[], programTrackedEntityAttributes:[], attributeValues:[],
    programIndicators:[], validationCriterias:[], programStages:[ ], translations:[], organisationUnits:[], programRules:[]
  };

  //pagination controller
  public currentPage : number ;
  public paginationLabel : string = "";
  //network
  public network : any;

  constructor(public params:NavParams,public eventProvider :EventsProvider,public programsProvider : ProgramsProvider,
              public toastCtrl: ToastController,public user : UserProvider,public actionSheetCtrl: ActionSheetController,
              public programStageSectionsProvider:ProgramStageSectionsProvider,public navCtrl: NavController,
              public eventCaptureFormProvider : EventCaptureFormProvider, public dataElementProvider:DataElementsProvider,
              public organisationUnitProvider:OrganisationUnitsProvider){

  }

  ngOnInit() {
    this.programStageDataElements  = [];
    this.programStageSections = [];
    this.currentPage = 0;
    this.user.getCurrentUser().then(user=>{
      this.currentUser = user;

      this.event = true;
      // this.eventProvider.getEventsFromStorageByStatus(user,"new event").then((events :any)=>{
      //   this.eventProvider.uploadEventsToServer(events,this.currentUser).then((response)=>{
      //     console.log("Uploading event : " + JSON.stringify(response));
      //   },error=>{
      //     console.log("Error on uploading event : " + JSON.stringify(error));
      //   });
      //   this.eventProvider.getEventsFromStorageByStatus(user,"not synced").then((events :any)=>{
      //     this.eventProvider.uploadEventsToServer(events,this.currentUser).then((response)=>{
      //       console.log("Uploading event : " + JSON.stringify(response));
      //     },error=>{
      //       console.log("Error on uploading event : " + JSON.stringify(error));
      //     });
      //   });
      // });


      this.entryFormParameter = this.params.get("params");
      if(this.entryFormParameter.programId){
         // this.eventCaptureFormProvider.loadingprogramInfo(this.entryFormParameter.programId,this.currentUser);
        //alert("ProgramId: "+this.entryFormParameter.selectedDataDimension)
        //this.loadProgramMetadata(this.entryFormParameter.programId);
        //this.loadingprogramInfo(this.entryFormParameter.programId ,this.currentUser);
      }

      this.currentProgram = this.programsProvider.lastSelectedProgram;
      this.currentOrgUnit = this.organisationUnitProvider.lastSelectedOrgUnit;
      this.loadProgramMetadata();
      //this.loadingprogramInfo(this.currentProgram ,this.currentUser);


    });

  }

  ionViewDidLoad() {
  }

  loadProgramMetadata(){
    this.loadingData = false;
    this.loadingMessages = [];
    let programStageSections:any;
    this.setLoadingMessages("Loading program metadata");

     //this.programStages = this.eventCaptureFormProvider.getProgramObject()
    this.loaded = false;

    this.initiateNewEvent(this.entryFormParameter,this.currentProgram);


    this.eventCaptureFormProvider.getProgamStagesData(this.currentProgram.id, this.currentUser).then((programStage:any)=>{

      alert("From service: "+JSON.stringify(programStage))

    })

    // this.programsProvider.getProgramById(programId,this.currentUser).then((program : any)=>{
    //
    //
    //   this.programsProvider.getProgramsStagesDataElements(programId,this.currentUser).then((programData:any)=>{
    //     //alert("ProgramStages : "+JSON.stringify(programData.programStageDataElements))
    //
    //     programStageSections = programData.programStageSections;
    //
    //   });
    //   //alert("selectedProg : "+JSON.stringify(program))
    //
    //   this.currentProgram = program;
    //   if(this.entryFormParameter.event ==""){
    //     //initiate new event
    //     //  alert("progData : "+JSON.stringify(this.currentProgram))
    //     // alert("progData : "+JSON.stringify(programStageSections))
    //     //alert("new event: ")
    //     this.initiateNewEvent(this.entryFormParameter,program);
    //   }else{
    //     //alert("load event: ")
    //     this.loadingEvent(this.entryFormParameter.programId,this.entryFormParameter.orgUnitId,this.entryFormParameter.event);
    //   }
    //
    //   // if(program.programStageSections !=null || program.programStageSections){
    //   // if(programData.programStageSections !=null || programData.programStageSections){
    //   if(programStageSections !=null || programStageSections){
    //     // this.loadProgramStageSections(programData.programStageDataElements);
    //     this.loadProgramStageSections(programStageSections);
    //   }else{
    //     // this.loadProgramStageDataElements(this.currentProgram.programStages[0].programStageDataElements);
    //     this.loadProgramStageDataElements(this.entryFormParameter.programDataElements);
    //   }
    //
    //
    //  // });
    //
    // },error=>{
    //   this.loadingData = false;
    //   this.setToasterMessage("Fail to load program metadata : " + JSON.stringify(error));
    // });
  }

  initiateNewEvent(entryFormParameter,program){
    //alert("Full Program info :"+JSON.stringify(this.programStages));

    this.dataValues = {};
    this.event = {
      program : this.currentProgram.id,
      programStage:'',
      orgUnit : this.currentOrgUnit.id,
      status : "ACTIVE",
      eventDate : "",
      dataValues : []
    };
    //add category combination
    if(entryFormParameter.selectedDataDimension.length > 0){
      let attributeCategoryOptions = entryFormParameter.selectedDataDimension.toString();
      attributeCategoryOptions = attributeCategoryOptions.replace(/,/g, ';');
      this.event["attributeCategoryOptions"] = attributeCategoryOptions;
    }
  }


  // loadProgramStageSections(programStageSectionsIds){
  //   this.setLoadingMessages("Loading program's sections");
  //
  //   this.programStageSectionsProvider.getProgramsStageSections(programStageSectionsIds,this.currentUser).then((programStageSections:any)=>{
  //     //alert("ProgSections  :"+JSON.stringify(programStageSections));
  //     this.programStageSections = programStageSections;
  //     this.loadProgramStageDataElements(this.currentProgram.programStages[0].programStageDataElements);
  //   },error=>{
  //     this.loadingData = false;
  //     this.setToasterMessage("Fail to load program's sections : " + JSON.stringify(error));
  //   });
  // }

  // loadProgramStageDataElements(programStageDataElementsIds){
  //   this.setLoadingMessages("Loading Entry fields details");
  //   this.programStageDataElements = [];
  //
  //   // programStageDataElementsIds.forEach((dataElementId:any)=>{
  //   //   alert("id: "+dataElementId)
  //   //
  //   // })
  //   this.programsProvider.getProgramsStagesDataElements(this.entryFormParameter.programId,this.currentUser).then((programStageDataElements:any)=>{
  //     // alert("ProgStageDataElemenyt  :"+JSON.stringify(programStageDataElements));
  //
  //     programStageDataElements.programStageDataElements.forEach((programStageDataElement)=>{
  //       //alert("id: "+JSON.stringify(programStageDataElement['dataElements']));
  //
  //       this.programStageDataElements.push(programStageDataElement);
  //     });
  //
  //
  //     this.eventCaptureFormProvider.getEventCaptureEntryFormMetaData(this.programStageSections,this.programStageDataElements).then((entryFormSections:any)=>{
  //      // alert("entry form  :"+JSON.stringify(entryFormSections));
  //       this.entryFormSections = entryFormSections;
  //
  //       this.paginationLabel = (this.currentPage + 1) + "/"+this.entryFormSections.length;
  //       this.loadingData = false;
  //     },error=>{
  //       this.loadingData = false;
  //     });
  //
  //   },error=>{
  //     this.loadingData = false;
  //     this.setToasterMessage("Fail to load entry fields details : " + JSON.stringify(error));
  //   });
  // }

  // loadingEvent(programId,orgUnitId,eventId){
  //   this.setLoadingMessages("Loading event");
  //   let eventTableId = programId+"-"+orgUnitId+"-"+eventId;
  //   this.dataValues = {};
  //   this.eventProvider.loadingEventByIdFromStorage(eventTableId,this.currentUser).then((event:any)=>{
  //     this.event = event;
  //     if(event.notes !="0"){
  //       this.eventComment = event.notes;
  //     }
  //     event.dataValues.forEach((dataValue : any)=>{
  //       this.dataValues[dataValue.dataElement] = dataValue.value;
  //     });
  //   },error=>{
  //     //fail to load event from local storage
  //   });
  // }

  // saveEvent(){
  //   this.loadingMessages = [];
  //   this.loadingData = true;
  //   this.setLoadingMessages("Preparing data for saving");
  //   this.programsProvider.getProgramStageDataElements(this.currentProgram.programStages[0].programStageDataElements,this.currentUser).then((programStageDataElements:any)=>{
  //     let isFormValid = this.hasFormValidForSubmission(programStageDataElements);
  //     if(isFormValid){
  //       //checking for event status completion
  //       this.event.status == "COMPLETED"? this.event["completedDate"] = this.eventProvider.getFormattedDate(new Date()) : delete this.event.completedDate;
  //       //checking for event comments
  //       this.eventComment !=""?this.event.notes = this.eventComment : delete this.event.notes;
  //       //empty event dataValues
  //       this.event.dataValues = [];
  //       //update event sync status
  //       // if has been updated change status to 'not synced'
  //       if(this.entryFormParameter.event ==""){
  //         this.event["syncStatus"] = "new event";
  //         this.event["event"]= dhis2.util.uid();
  //       }else{
  //         this.event["syncStatus"] = "not synced";
  //       }
  //       this.eventProvider.getEventDataValues(this.dataValues,programStageDataElements).then((dataValues:any)=>{
  //         dataValues.forEach(dataValue=>{
  //           this.event.dataValues.push(dataValue);
  //         });
  //         //saving event to local storage
  //         this.setLoadingMessages("Saving new event to local storage");
  //         this.event["orgUnitName"] = this.entryFormParameter.orgUnitName;
  //         this.event["programName"] = this.entryFormParameter.programName;
  //         this.eventProvider.saveEvent(this.event,this.currentUser).then(()=>{
  //           this.loadingData = false;
  //           this.navCtrl.pop();
  //         },error=>{
  //           this.loadingData = false;
  //           this.setToasterMessage("Fail to save new event to local storage : " + JSON.stringify(error));
  //         });
  //       })
  //     }else{
  //       this.loadingData = false;
  //       this.setToasterMessage("Please make sure your enter all required fields, before saving");
  //     }
  //   });
  // }

  cancel(){
    this.navCtrl.pop();
  }

  /**
   * checking if all required fields has been field
   * @param programStageDataElements
   * @returns {boolean}
   */
  hasFormValidForSubmission(programStageDataElements){
    let isValid = true;
    programStageDataElements.forEach((programStageDataElement:any)=>{
      if(programStageDataElement.compulsory !="0" && !this.dataValues[programStageDataElement.dataElement.id]){
        isValid = false;
      }
    });
    return isValid;
  }

  //@todo add more information
  showTooltips(dataElement,categoryComboName,isMandatory){
    let title = dataElement.name + (categoryComboName != 'default' ? " " +categoryComboName:"");
    let subTitle = "";
    if(isMandatory == "true"){
      title += ". This field is mandatory";
    }else{
      title += ". This field is optional";
    }
    if(dataElement.description){
      title += ". Description : " + dataElement.description ;
    }
    subTitle += "Value Type : " +dataElement.valueType.toLocaleLowerCase().replace(/_/g," ");
    if(dataElement.optionSet){
      title += ". It has " +dataElement.optionSet.options.length + " options to select.";
    }
    let actionSheet = this.actionSheetCtrl.create({
      title: title,subTitle:subTitle
    });
    actionSheet.present();
  }

  //todo get input label attribute form setting
  getDisplayName(dataElement){
    // this.dataElementProvider.getDataElementsByName(dataElement, this.currentUser).then((dataName:any)=>{
    //   alert("Dataname: "+JSON.stringify(dataName))
    // })

    return dataElement;
  }

  changePagination(page){
    page = parseInt(page);
    if(page == -1){
      this.currentPage = 0;
    }else if(page == this.entryFormSections.length){
      this.currentPage = this.entryFormSections.length - 1;
    }else{
      this.currentPage = page;
    }
    this.paginationLabel = (this.currentPage + 1) + "/"+this.entryFormSections.length;
  }

  setLoadingMessages(message){
    this.loadingMessage = message;
    this.loadingMessages.push(message);
  }

  setToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 4000
    });
    toast.present();
  }

  setStickToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton : true
    });
    toast.present();
  }

  //-------------------------------------------------------------------------------------------------------------------------

  // loadingprogramInfo(programId){
  //   this.programsProvider.getProgramById(programId,this.currentUser).then((program : any)=>{
  //     alert("ProgramStages : "+JSON.stringify(program))
  //   });
  // }



  //-------------------------------------------------------------------------------------------------------------------------

}
