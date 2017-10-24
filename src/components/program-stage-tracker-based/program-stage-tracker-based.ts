import {Component,Input, OnDestroy, OnInit} from '@angular/core';
import {ProgramsProvider} from "../../providers/programs/programs";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";

/**
 * Generated class for the ProgramStageTrackerBasedComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'program-stage-tracker-based',
  templateUrl: 'program-stage-tracker-based.html'
})
export class ProgramStageTrackerBasedComponent implements OnInit, OnDestroy{

  @Input() programStage;

  currentOrgUnit : any;
  currentProgram : any;
  currentUser : any;
  isLoading : boolean;
  loadingMessage : string;

  selectedDataDimension : any;
  dataObjectModel : any;

  constructor(private programsProvider : ProgramsProvider,
              private userProvider : UserProvider,private appProvider : AppProvider,
              private organisationUnitProvider : OrganisationUnitsProvider) {
  }

  ngOnInit(){
    //@todo loading events based to render forms
    this.dataObjectModel = {};

    this.selectedDataDimension = [];
    this.currentOrgUnit = this.organisationUnitProvider.lastSelectedOrgUnit;
    this.currentProgram = this.programsProvider.lastSelectedProgram;
    this.loadingMessage = "Loading user information";
    this.isLoading = true;
    this.userProvider.getCurrentUser().then((user)=>{
      this.currentUser = user;
      this.isLoading = false;
    }).catch(error=>{
      this.appProvider.setNormalNotification("Fail to load user information");
    })
  }

  ngOnDestroy(){
    this.currentProgram = null;
    this.currentOrgUnit = null;
  }

  updateData(data){
    console.log(JSON.stringify(data));
  }

  getDataDimensions(){
    if(this.currentProgram && this.currentProgram.categoryCombo){
      let attributeCc = this.currentProgram.categoryCombo.id;
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


}
