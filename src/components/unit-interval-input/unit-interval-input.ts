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

  singleValue: number;
  displayValue: any;
  maxCount: number;
  constructor() {
    this.maxCount = 100;
    this.singleValue = 0;
    this.updateDispayValue();
  }

  ngOnInit() {}

  changeValue() {
    this.updateDispayValue();
  }

  updateDispayValue() {
    this.displayValue = this.singleValue / this.maxCount;
  }
}
