import { Component,Input,Output, EventEmitter,OnInit } from '@angular/core';
import { ToastController } from 'ionic-angular';
import {OrganisationUnit} from "../../providers/organisation-unit";

/*
 Generated class for the OrganisationUnitsTree page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-organisation-units-tree',
  templateUrl: 'organisation-units-tree.html'
})
export class OrganisationUnitsTreePage implements OnInit {

  @Input() currentUser;
  @Input() organisationUnit;
  @Input() hasOrgUnitChildrenOpened;
  @Input() hasOrgUnitChildrenLoaded;
  @Output() selectedOrganisationUnit = new EventEmitter();

  public currentSelectedOrgUnitName : string;
  public isOrganisationUnitsFetched : boolean = true;
  public hasErrorOccurred : boolean = false;

  constructor(public toastCtrl:ToastController,public OrganisationUnit : OrganisationUnit) {
  }

  ngOnInit() {
    this.currentSelectedOrgUnitName = "";
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
    this.selectedOrganisationUnit.emit(selectedOrganisationUnit)
  }

  toggleOrganisationUnit(organisationUnit){
    if (this.hasOrgUnitChildrenOpened[organisationUnit.id]) {
      this.hasOrgUnitChildrenOpened[organisationUnit.id] = !this.hasOrgUnitChildrenOpened[organisationUnit.id];
    } else {
      this.isOrganisationUnitsFetched = false;
      this.hasOrgUnitChildrenLoaded = false;
      this.hasOrgUnitChildrenOpened[organisationUnit.id] = true;
      let childrenOrganisationUnitIds = this.getOrganisationUnitsChildrenIds(organisationUnit);
      this.OrganisationUnit.getChildrenOrganisationUnits(childrenOrganisationUnitIds,this.currentUser).then((childrenOrganisationUnits:any)=>{
        this.organisationUnit.children = childrenOrganisationUnits;
        this.isOrganisationUnitsFetched = true;
        this.hasOrgUnitChildrenLoaded = true;
        this.hasErrorOccurred = false;
      },error=>{
        this.isOrganisationUnitsFetched = true;
        this.hasOrgUnitChildrenLoaded = true;
        this.hasErrorOccurred = true;
      });
    }
  }

  getOrganisationUnitsChildrenIds(organisationUnit){
    let childrenIds = [];
    for(let children of organisationUnit.children){
      childrenIds.push(children.id);
    }
    return childrenIds;
  }

  setToasterMessage(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
