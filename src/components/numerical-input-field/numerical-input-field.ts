import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

/**
 * Generated class for the NumericalInputFieldComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'numerical-input-field',
  templateUrl: 'numerical-input-field.html'
})
export class NumericalInputFieldComponent implements OnInit{

  @Input() dataElementId;
  @Input() categoryOptionComboId;
  @Input() data;
  @Input() valueType;
  @Output() onChange = new EventEmitter();
  inputFieldValue : any;
  //{"id":"s46m5MS0hxu-Prlt0C1RF0s","value":"1","status":"synced"}
  //id = dataElementId + "-" + categoryOptionComboId
  constructor() {}

  ngOnInit(){
    let fieldId = this.dataElementId + "-" + this.categoryOptionComboId;
    if(this.data && this.data[fieldId]){
      this.inputFieldValue  = this.data[fieldId].value;
    }
  }

}
