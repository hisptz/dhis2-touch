import {Component, OnDestroy, OnInit} from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EventHideShowColumnPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-hide-show-column',
  templateUrl: 'event-hide-show-column.html',
})
export class EventHideShowColumnPage implements OnInit, OnDestroy{

  programStage : any;
  dataElements : Array<any>;
  selectedItemsModel : any;

  constructor(public viewCtrl: ViewController,public params : NavParams) {
  }

  ngOnInit(){
    this.selectedItemsModel = [];
    this.dataElements = [];
    this.programStage = this.params.get('programStage');
    let columnsToDisplay = this.params.get('columnsToDisplay');
    let dataEntrySettings = this.params.get('dataEntrySettings');
    Object.keys(columnsToDisplay).forEach(key=>{
      this.selectedItemsModel[key] = true;
    });
    this.programStage.programStageDataElements.forEach((programStageDataElement : any)=>{
      if(programStageDataElement.dataElement && programStageDataElement.dataElement.id){
        let fieldLabelKey = programStageDataElement.dataElement.displayName;
        if(dataEntrySettings && dataEntrySettings.label && programStageDataElement.dataElement[dataEntrySettings.label]){
          if(programStageDataElement.dataElement[dataEntrySettings.label] != "0"){
            fieldLabelKey = programStageDataElement.dataElement[dataEntrySettings.label];
          }
        }
        this.dataElements.push({id : programStageDataElement.dataElement.id,name : fieldLabelKey})
      }
    });
  }

  autoSelectFields(status){
    this.dataElements.forEach((trackedEntityAttribute : any)=>{
      this.selectedItemsModel[trackedEntityAttribute.id] = status;
    });
  }

  saveChanges(){
    let columnsToDisplay = {};
    this.dataElements.forEach((dataElement : any)=>{
      if(this.selectedItemsModel[dataElement.id]){
        columnsToDisplay[dataElement.id] = dataElement.name;
      }
    });
    if(Object.keys(columnsToDisplay).length == 0 && this.dataElements.length > 0){
      columnsToDisplay[this.dataElements[0].id] = this.dataElements[0].name;
    }
    this.viewCtrl.dismiss(columnsToDisplay);
  }

  ngOnDestroy(){
    this.programStage = null;
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}
