import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

/**
 * Generated class for the DateInputFieldComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'date-input-field',
  templateUrl: 'date-input-field.html'
})
export class DateInputFieldComponent implements OnInit {
  @Input() dataElementId: string;
  @Input() categoryOptionComboId: string;
  @Input() data;
  @Input() valueType: string;
  @Output() onChange = new EventEmitter();

  inputFieldValue: string;
  mode: string;

  constructor() {}

  ngOnInit() {
    const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    if (this.data && this.data[fieldId]) {
      this.inputFieldValue = this.data[fieldId].value;
    }
    this.mode =
      this.valueType && this.valueType != ''
        ? this.valueType.toLowerCase()
        : 'date';
  }

  updateValue(value) {
    const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    this.inputFieldValue = value;
    const data = {
      id: fieldId,
      value: value,
      status: 'not-synced'
    };
    this.onChange.emit(data);
  }
}
