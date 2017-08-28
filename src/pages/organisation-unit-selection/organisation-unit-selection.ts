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
  hasOrgUnitChildrenLoaded : boolean;
  hasOrgUnitChildrenOpened:any = {};

  constructor(private viewCtrl : ViewController, private organisationUnitProvider : OrganisationUnitsProvider,
              private userProvider : UserProvider,private appProvider : AppProvider) {
  }

  ngOnInit(){
    this.loadingMessage = "Loading user information";
    this.emptyMessage = "";
    this.isLoading = true;
    this.userProvider.getCurrentUser().then(user=>{
      this.currentUser = user;
      this.loadingOrganisationUnits();
    },error=>{
      console.log(JSON.stringify(error));
    })
  }

  loadingOrganisationUnits(){
    this.loadingMessage = "Loading organisation units";
    this.organisationUnitProvider.getOrganisationUnits(this.currentUser).then((organisationUnits : any)=>{
      if(organisationUnits && organisationUnits.length > 0){
        this.organisationUnits = organisationUnits;
        if(this.organisationUnitProvider.lastSelectedOrgUnit){
          this.lastSelectedOrgUnit = this.organisationUnitProvider.lastSelectedOrgUnit;
        }else{
          this.lastSelectedOrgUnit = organisationUnits[0];
          this.organisationUnitProvider.setLastSelectedOrganisationUnitUnit(organisationUnits[0]);
        }
        let level = parseInt(this.lastSelectedOrgUnit.level);
        let parents = this.lastSelectedOrgUnit.path.substring(1, this.lastSelectedOrgUnit.path.length).split("/");
        let fetchLevel = 0;
        for(let organisationUnit of this.organisationUnits){
          if(parents.indexOf(organisationUnit.id) > -1){
            fetchLevel = parseInt(organisationUnit.level);
          }
        }
        parents.splice(0,fetchLevel);
        if( level > 1 && parents.length > 0){
          this.organisationUnitProvider.getOrganisationUnitsByLevels(parents,this.currentUser).then((organisationUnitResponse :any)=>{
            if(organisationUnitResponse && organisationUnitResponse.id){
              console.log(organisationUnitResponse.name);
              // this.organisationUnits.forEach((organisationUnit:any)=>{
              //   organisationUnit.children.forEach((childOrgUnit)=>{
              //     if(childOrgUnit.id == organisationUnitResponse.id){
              //       childOrgUnit = organisationUnitResponse;
              //       for(let ancestor of this.lastSelectedOrgUnit.ancestors){
              //         this.hasOrgUnitChildrenOpened[ancestor.id] = true;
              //       }
              //       this.hasOrgUnitChildrenLoaded = true;
              //       this.isLoading = false;
              //     }
              //   });
              // });
            }
          },error=>{
            console.log(JSON.stringify(error));
            this.isLoading = false;
            this.emptyMessage= "Fail to load organisation unit";
            this.appProvider.setNormalNotification(this.emptyMessage)
          });
        }else{
          this.hasOrgUnitChildrenLoaded = false;
          this.isLoading = false;
        }
      }else{
        this.isLoading = false;
        this.emptyMessage = "Current you have yet assigned to any organisation unit";
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
