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

  singleValue: number;
  constructor() {
    this.singleValue = 0;
  }

  ngOnInit() {}
}
