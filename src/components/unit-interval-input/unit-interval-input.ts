import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

/**
 * Generated class for the UnitIntervalInputComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'unit-interval-input',
  templateUrl: 'unit-interval-input.html'
})
export class UnitIntervalInputComponent implements OnInit {
  @Input() dataElementId;
  @Input() categoryOptionComboId;
  @Input() data;
  @Output() onChange = new EventEmitter();

  rangeValue: number;
  displayValue: any;
  maxCount: number;
  constructor() {
    this.maxCount = 100;
    this.rangeValue = 0;
  }

  ngOnInit() {
    const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    if (this.data && this.data[fieldId]) {
      const dataValue = this.data[fieldId].value;
      if (dataValue) {
        this.displayValue = dataValue;
        this.rangeValue = dataValue * this.maxCount;
      } else {
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
    const dataValue = this.rangeValue / this.maxCount;
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
