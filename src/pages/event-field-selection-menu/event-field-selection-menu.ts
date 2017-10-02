import { Component,OnInit } from '@angular/core';
import {ViewController, NavParams, IonicPage} from 'ionic-angular';

/*
  Generated class for the EventFieldSelectionMenu page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-event-field-selection-menu',
  templateUrl: 'event-field-selection-menu.html'
})
export class EventFieldSelectionMenu implements OnInit{

  public selectedDataElementIdsModel : any;
  public dataElementsIds : any;
  public dataElementMapper : any;
  public dataElementToDisplay : any;
  public hasDataLoaded :boolean = false;
  public hasAllSelected : boolean = false;

  constructor(public viewCtrl: ViewController,public params : NavParams) {

  }

  ngOnInit() {
    this.getAndSetParameter();
  }

  /**
   * get and set all parameter
   */
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
    //alert("Reamin values are: "+JSON.stringify(parameter))
    this.viewCtrl.dismiss(parameter);
  }

  /**
   * handling auto-select
   * @param selectType
     */
  autoSelect(selectType){
    let ids = Object.keys(this.selectedDataElementIdsModel);
    if(selectType == 'selectAll'){
      this.setSelectionValue(ids,true);
    }else{
      this.setSelectionValue(ids,false);
    }
  }

  /**
   * sekt values for select all or un select all
   * @param ids
   * @param value
     */
  setSelectionValue(ids,value :boolean){

    ids.forEach(id=>{
      this.selectedDataElementIdsModel[id] = value;

    });
    this.hasAllSelected = this.getAllSelectedStatus(this.selectedDataElementIdsModel);
  }

  /**
   * get all selected data elements
   * @param selectedDataElementIdsModel
   * @returns {boolean}
     */
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

  /**
   * get data elements for event list
   * @param selectedDataElementIdsModel
   * @returns {{}}
     */
  getSelectedDataElementsToDisplay(selectedDataElementIdsModel){
    let selectedDataElementToDisplay = {};
    let oneOptionHasSelected = false;
    Object.keys(selectedDataElementIdsModel).forEach((id:any)=>{
      if(selectedDataElementIdsModel[id]){
        oneOptionHasSelected = true;
        selectedDataElementToDisplay[id] = this.dataElementMapper[id];
      }
    });
    if(!oneOptionHasSelected){
      let defaultId = Object.keys(selectedDataElementIdsModel)[0];
      selectedDataElementToDisplay[defaultId] = this.dataElementMapper[defaultId];
    }

    return selectedDataElementToDisplay;
  }





}
