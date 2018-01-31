import { Component,OnInit } from '@angular/core';
import {IonicPage, ViewController} from 'ionic-angular';
import {OrganisationUnitModel, OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";

/**
 * Generated class for the OrganisationUnitSelectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-organisation-unit-selection',
  templateUrl: 'organisation-unit-selection.html',
})
export class OrganisationUnitSelectionPage implements OnInit{

  loadingMessage : string;
  isLoading :boolean = false;
  emptyMessage : string;

  currentUser : any;
  lastSelectedOrgUnit : OrganisationUnitModel;
  organisationUnits : OrganisationUnitModel[];
  hasOrgUnitChildrenOpened:any = {};

  constructor(private viewCtrl : ViewController, private organisationUnitProvider : OrganisationUnitsProvider,
              private userProvider : UserProvider,private appProvider : AppProvider) {
  }

  ngOnInit(){
    this.loadingMessage = "loading_current_user_information";
    this.emptyMessage = "";
    this.isLoading = true;
    this.userProvider.getCurrentUser().subscribe(user=>{
      this.currentUser = user;
      this.loadingOrganisationUnits();
    },error=>{
      console.log(JSON.stringify(error));
    })
  }

  loadingOrganisationUnits(){
    this.loadingMessage = "loading_assigned_organisation_units";
    this.hasOrgUnitChildrenOpened = {};
    this.organisationUnitProvider.getOrganisationUnits(this.currentUser).subscribe((organisationUnits : any)=>{
      if(organisationUnits && organisationUnits.length > 0){
        this.organisationUnits = organisationUnits;
        if(this.organisationUnitProvider.lastSelectedOrgUnit){
          this.lastSelectedOrgUnit = this.organisationUnitProvider.lastSelectedOrgUnit;
        }else{
          this.lastSelectedOrgUnit = organisationUnits[0];
          this.organisationUnitProvider.setLastSelectedOrganisationUnitUnit(organisationUnits[0]);
        }
        this.isLoading = false;
      }else{
        this.isLoading = false;
        this.emptyMessage = "Currently there is on assigned organisation unit on local storage, Please metadata on sync app";
        this.appProvider.setNormalNotification(this.emptyMessage);
      }
    },error=>{
      console.log(JSON.stringify(error));
      this.isLoading = false;
      this.emptyMessage= "Fail to load organisation unit";
      this.appProvider.setNormalNotification(this.emptyMessage);
    });
  }

  setSelectedOrganisationUnit(selectedOrganisationUnit){
    this.organisationUnitProvider.setLastSelectedOrganisationUnitUnit(selectedOrganisationUnit);
    this.viewCtrl.dismiss(selectedOrganisationUnit);
  }

  dismiss(){
    this.viewCtrl.dismiss({});
  }

}
