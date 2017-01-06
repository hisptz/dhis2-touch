import { Component } from '@angular/core';
import { ViewController,NavParams } from 'ionic-angular';

/*
  Generated class for the EventFieldSelectionMenu page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-event-field-selection-menu',
  templateUrl: 'event-field-selection-menu.html'
})
export class EventFieldSelectionMenu {

  public selectedDataElementIdsModel : any;
  public dataElementsIds : any;
  public dataElementMapper : any;
  public dataElementToDisplay : any;
  public hasDataLoaded :boolean = false;
  public hasAllSelected : boolean = false;

  constructor(public viewCtrl: ViewController,public params : NavParams) {
    this.getAndSetParameter();
  }

  getAndSetParameter(){
    this.selectedDataElementIdsModel = {};
    this.dataElementToDisplay = this.params.get("dataElementToDisplay");
    this.dataElementMapper = this.params.get("dataElementMapper");
    this.dataElementsIds  = Object.keys(this.dataElementMapper);
    this.dataElementsIds.forEach((dataElementId : any)=>{
      if(this.dataElementToDisplay[dataElementId]){
        this.selectedDataElementIdsModel[dataElementId] = true;
      }else{
        this.selectedDataElementIdsModel[dataElementId] = false;
      }
    });
    this.hasAllSelected = this.getAllSelectedStatus(this.selectedDataElementIdsModel);
    this.hasDataLoaded = true;
  }

  ionViewDidLoad() {
  }

  onSavingChanges(){
    this.dismiss();
  }

  dismiss() {
    let parameter = this.getSelectedDataElementsToDisplay(this.selectedDataElementIdsModel);
    this.viewCtrl.dismiss(parameter);
  }

  autoSelect(selectType){
    let ids = Object.keys(this.selectedDataElementIdsModel);
    if(selectType == 'selectAll'){
      this.setSelectionValue(ids,true);
    }else{
      this.setSelectionValue(ids,false);
    }
  }

  setSelectionValue(ids,value :boolean){
    ids.forEach(id=>{
      this.selectedDataElementIdsModel[id] = value;
    });
    this.hasAllSelected = this.getAllSelectedStatus(this.selectedDataElementIdsModel);
  }

  getAllSelectedStatus(selectedDataElementIdsModel){
    let hasAllSelected = true;
    let ids = Object.keys(selectedDataElementIdsModel);
    ids.forEach(id=>{
      if(!this.selectedDataElementIdsModel[id]){
        hasAllSelected = false;
      }
    });
    return hasAllSelected;
  }

  getSelectedDataElementsToDisplay(selectedDataElementIdsModel){
    let selectedDataElementToDisplay = {};
    Object.keys(selectedDataElementIdsModel).forEach((id:any)=>{
      if(selectedDataElementIdsModel[id]){
        selectedDataElementToDisplay[id] = this.dataElementMapper[id];
      }
    });
    return selectedDataElementToDisplay;
  }

}
