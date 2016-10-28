import { Component } from '@angular/core';
import { ViewController,NavParams } from 'ionic-angular';

/*
  Generated class for the OrganisationUnits page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-organisation-units',
  templateUrl: 'organisation-units.html'
})
export class OrganisationUnits {

  public data : any;
  public loadingMessages : any;
  public loadingData :boolean = false;
  public organisationUnitsList : any;
  public hasOrgUnitChildrenOpened:any = {};

  constructor(public viewCtrl: ViewController,public params : NavParams){
    this.setModalData();
  }

  ionViewDidLoad() {
    //console.log('Hello OrganisationUnits Page');
  }

  setModalData(){
    this.loadingData = false;
    this.loadingMessages = [];
    this.loadingMessages.push('Please wait, while setting organisation unit data');
    let orgUnits = this.params.get('data');
    this.loadingMessages.push('Loading organisation list ');
    this.organisationUnitsList = orgUnits;//this.getOrganisationUnitsList(orgUnits);
    this.loadingData = false;
  }

  getOrganisationUnitsList(orgUnits){
    var orgUnitsOutPut =[];
    orgUnits.forEach(orgUnit=>{
      orgUnitsOutPut.push({
        id:orgUnit.id,
        name: orgUnit.name,
        ancestors: orgUnit.ancestors,
        dataSets: orgUnit.dataSets,
      });
      if(orgUnit.children){
        this.getOrganisationUnitsList(orgUnit.children).forEach(orgUnit=>{
          orgUnitsOutPut.push({
            id:orgUnit.id,
            name: orgUnit.name,
            ancestors: orgUnit.ancestors,
            dataSets: orgUnit.dataSets,
          });
        })
      }
    });

    return orgUnitsOutPut;
  }

  toggleOrgUnit(orgUnit) {
    if (this.hasOrgUnitChildrenOpened[orgUnit.id]) {
      this.hasOrgUnitChildrenOpened[orgUnit.id] = !this.hasOrgUnitChildrenOpened[orgUnit.id];
    } else {
      this.hasOrgUnitChildrenOpened[orgUnit.id] = true;
    }
  }

  setSelectedOrgUnit(selectedOrgUnit){
    this.viewCtrl.dismiss(selectedOrgUnit);
  }

  dismiss() {
    var parameter = {};
    this.viewCtrl.dismiss(parameter);
  }


}
