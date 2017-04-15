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

  public data : any;
  public loadingMessages : any;
  public loadingData :boolean = false;

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
    //@todo reopen tree based on last selected organisation unit
    this.lastSelectedOrgUnit = this.params.get("lastSelectedOrgUnit");
    this.currentUser = this.params.get("currentUser");
    this.organisationUnits = this.params.get('organisationUnits');
    this.hasOrgUnitChildrenLoaded = false;
    console.log(this.lastSelectedOrgUnit.path);
    console.log(this.lastSelectedOrgUnit.ancestors);
  }

  setSelectedOrganisationUnit(selectedOrganisationUnit){
    this.OrganisationUnit.setLastSelectedOrganisationUnitUnit(selectedOrganisationUnit);
    this.viewCtrl.dismiss(selectedOrganisationUnit);
  }


  dismiss() {
    var parameter = {};
    this.viewCtrl.dismiss(parameter);
  }


}
