import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

/**
 * Generated class for the PercentageInputComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'percentage-input',
  templateUrl: 'percentage-input.html'
})
export class PercentageInputComponent implements OnInit {
  @Input() dataElementId;
  @Input() categoryOptionComboId;
  @Input() data;
  @Output() onChange = new EventEmitter();

  rangeValue: any;
  displayValue: any;
  constructor() {}

  ngOnInit() {
    const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    if (this.data && this.data[fieldId]) {
      const dataValue = this.data[fieldId].value;
      if (dataValue) {
        this.rangeValue = dataValue;
        this.displayValue = dataValue;
      } else {
        this.rangeValue = 0;
        this.displayValue = '';
      }
    }
  }

  clearValue() {
    const dataValue = '';
    this.rangeValue = 0;
    this.displayValue = dataValue;
    this.saveValue(dataValue);
  }

  updateValue() {
    const dataValue = this.rangeValue;
    this.displayValue = dataValue;
    this.saveValue(dataValue);
  }

  saveValue(dataValue) {
    const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    if (
      this.data &&
      this.data[fieldId] &&
      dataValue != this.data[fieldId].value
    ) {
      this.onChange.emit({
        id: fieldId,
        value: dataValue,
        status: 'not-synced'
      });
    } else if (this.data && !this.data[fieldId]) {
      if (dataValue) {
        this.onChange.emit({
          id: fieldId,
          value: dataValue,
          status: 'not-synced'
        });
      }
    }
  }
}
