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
  @Input() currentSelectedOrgUnitName;
  @Output() selectedOrganisationUnit = new EventEmitter();

  public isOrganisationUnitsFetched : boolean = true;
  public hasErrorOccurred : boolean = false;

  constructor(public toastCtrl:ToastController,public OrganisationUnit : OrganisationUnit) {
  }

  ngOnInit() {}

  setSelectedOrganisationUnit(selectedOrganisationUnit){
    this.selectedOrganisationUnit.emit(selectedOrganisationUnit)
  }

  toggleOrganisationUnit(organisationUnit){
    if (this.hasOrgUnitChildrenOpened[organisationUnit.id]) {
      this.hasOrgUnitChildrenOpened[organisationUnit.id] = !this.hasOrgUnitChildrenOpened[organisationUnit.id];
    }else if(Object.keys(this.hasOrgUnitChildrenOpened).indexOf(organisationUnit.id) > -1){
      this.hasOrgUnitChildrenOpened[organisationUnit.id] = !this.hasOrgUnitChildrenOpened[organisationUnit.id];
      this.isOrganisationUnitsFetched = true;
      this.hasOrgUnitChildrenLoaded = true;
      this.hasErrorOccurred = false;
    }else{
      this.isOrganisationUnitsFetched = false;
      this.hasOrgUnitChildrenLoaded = false;
      this.hasOrgUnitChildrenOpened[organisationUnit.id] = true;
      let childrenOrganisationUnitIds = this.getOrganisationUnitsChildrenIds(organisationUnit);
      this.OrganisationUnit.getOrganisationUnitsByIds(childrenOrganisationUnitIds,this.currentUser).then((childrenOrganisationUnits:any)=>{
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
      duration: 4000
    });
    toast.present();
  }

}
