import { Component,OnInit } from '@angular/core';
import { ViewController,NavParams } from 'ionic-angular';
import {OrganisationUnitModel} from "../../providers/organisation-unit";
import {OrganisationUnit} from "../../providers/organisation-unit";

/*
  Generated class for the OrganisationUnits page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-organisation-units',
  templateUrl: 'organisation-units.html'
})
export class OrganisationUnits implements OnInit{


  public loadingMessage : string;
  public loadingData :boolean = true;

  public currentUser : any;
  public lastSelectedOrgUnit : OrganisationUnitModel;
  public organisationUnits : OrganisationUnitModel[];
  public hasOrgUnitChildrenLoaded : boolean;
  public hasOrgUnitChildrenOpened:any = {};

  constructor(public viewCtrl: ViewController,public params : NavParams,public OrganisationUnit: OrganisationUnit){
  }

  ngOnInit() {
    this.setModalData();
  }

  setModalData(){
    this.loadingMessage = "Please wait";
    this.lastSelectedOrgUnit = this.params.get("lastSelectedOrgUnit");
    this.currentUser = this.params.get("currentUser");
    this.organisationUnits = this.params.get('organisationUnits');
    let level = parseInt(this.lastSelectedOrgUnit.level);
    if( level > 1){
      let parents = this.lastSelectedOrgUnit.path.substring(1, this.lastSelectedOrgUnit.path.length).split("/");
      let fetchLevel = 0;
      for(let organisationUnit of this.organisationUnits){
        if(parents.indexOf(organisationUnit.id) > -1){
          fetchLevel = parseInt(organisationUnit.level);
        }
      }
      parents.splice(0,fetchLevel);
      this.OrganisationUnit.getOrganisationUnitsByLevels(parents,this.currentUser).then((organisationUnitResponse :any)=>{
        this.organisationUnits.forEach((organisationUnit:any)=>{
          organisationUnit.children.forEach((childOrgUnit)=>{
            if(childOrgUnit.id == organisationUnitResponse.id){
              childOrgUnit = organisationUnitResponse;
              for(let ancestor of this.lastSelectedOrgUnit.ancestors){
                this.hasOrgUnitChildrenOpened[ancestor.id] = true;
              }
              this.hasOrgUnitChildrenLoaded = true;
              this.loadingData = false;
            }
          });
        });
      },error=>{
        this.loadingData = false;
      });
    }else{
      this.hasOrgUnitChildrenLoaded = false;
      this.loadingData = false;
    }
  }

  setSelectedOrganisationUnit(selectedOrganisationUnit){
    let children = [];
    for(let childOrgUnit of selectedOrganisationUnit.children){
      children.push({
        id : childOrgUnit.id,
        name : childOrgUnit.name
      });
    }
    selectedOrganisationUnit.children = children;
    this.OrganisationUnit.setLastSelectedOrganisationUnitUnit(selectedOrganisationUnit);
    this.viewCtrl.dismiss(selectedOrganisationUnit);
  }


  dismiss() {
    var parameter = {};
    this.viewCtrl.dismiss(parameter);
  }


}
