import {Component,Input, OnDestroy, OnInit} from '@angular/core';
import {ProgramsProvider} from "../../providers/programs/programs";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";

/**
 * Generated class for the ProgramStageEventBasedComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'program-stage-event-based',
  templateUrl: 'program-stage-event-based.html'
})
export class ProgramStageEventBasedComponent implements OnInit, OnDestroy{

  @Input() programStage;
  @Input() dataDimension;
  @Input() currentEvent;

  currentOrgUnit : any;
  currentProgram : any;
  currentUser : any;
  isLoading : boolean;
  loadingMessage : string;
  dataObject : any;

  constructor(private programsProvider : ProgramsProvider,
              private userProvider : UserProvider,private appProvider : AppProvider,
              private organisationUnitProvider : OrganisationUnitsProvider) {
  }

  ngOnInit(){
    this.dataObject = {};
    this.currentOrgUnit = this.organisationUnitProvider.lastSelectedOrgUnit;
    this.currentProgram = this.programsProvider.lastSelectedProgram;
    this.loadingMessage = "Loading user information";
    this.isLoading = true;
    this.userProvider.getCurrentUser().then((user : any)=>{
      this.currentUser = user;
      this.isLoading = false;
    }).catch(error=>{
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to load user information");
    })
  }

  ngOnDestroy(){
    this.currentProgram = null;
    this.currentOrgUnit = null;
  }


}
