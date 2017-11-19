import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {EventCaptureFormProvider} from "../../providers/event-capture-form/event-capture-form";

/**
 * Generated class for the TrackerEventContainerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'tracker-event-container',
  templateUrl: 'tracker-event-container.html'
})
export class TrackerEventContainerComponent implements OnInit, OnDestroy{

  @Input() programStage;
  @Input() currentOpenEvent;
  @Input() currentUser;
  @Input() isOpenRow;
  @Input() dataValuesSavingStatusClass;
  @Output() onChange = new EventEmitter();

  dataObjectModel : any;

  constructor(private eventCaptureFormProvider : EventCaptureFormProvider) {
  }

  ngOnInit(){
    if(this.isOpenRow){
      this.isOpenRow = JSON.parse(this.isOpenRow);
    }
    this.dataObjectModel = {};
    if(this.currentOpenEvent && this.currentOpenEvent.dataValues && this.programStage && this.programStage.programStageDataElements ){
      this.updateDataObjectModel(this.currentOpenEvent.dataValues, this.programStage.programStageDataElements);
    }
  }

  ngOnDestroy(){
    this.programStage = null;
    this.currentOpenEvent = null;
  }

  updateDataObjectModel(dataValues,programStageDataElements){
    let dataValuesMapper = {};
    dataValues.forEach((dataValue : any)=>{
      dataValuesMapper[dataValue.dataElement] = dataValue;
    });
    programStageDataElements.forEach((programStageDataElement : any)=>{
      if(programStageDataElement.dataElement && programStageDataElement.dataElement.id){
        let dataElementId = programStageDataElement.dataElement.id;
        let fieldId = programStageDataElement.dataElement.id +"-dataElement";
        if(dataValuesMapper[dataElementId]){
          this.dataObjectModel[fieldId] = dataValuesMapper[dataElementId];
        }
      }
    });
  }

  updateData(updatedData){
    let dataValues = [];
    Object.keys(this.dataObjectModel).forEach((key : any)=>{
      let dataElementId = key.split('-')[0];
      dataValues.push({
        dataElement : dataElementId,
        value : this.dataObjectModel[key].value
      });
    });
    this.currentOpenEvent.dataValues = dataValues;
    this.currentOpenEvent.syncStatus = "not-synced";
    this.onChange.emit(this.isOpenRow);
    this.eventCaptureFormProvider.saveEvents([this.currentOpenEvent],this.currentUser).then(()=>{
      this.dataValuesSavingStatusClass[updatedData.id] ="input-field-container-success";
      this.dataObjectModel[updatedData.id] = updatedData;
    }).catch((error)=>{
      this.dataValuesSavingStatusClass[updatedData.id] ="input-field-container-failed";
      console.log(JSON.stringify(error));
    });
  }

}
