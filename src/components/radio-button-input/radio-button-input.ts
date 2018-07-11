import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the RadioButtonInputComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'radio-button-input',
  templateUrl: 'radio-button-input.html'
})
export class RadioButtonInputComponent implements OnInit {
  @Input() options;
  @Input() selectedValue: string;
  @Input() fieldId: string;
  @Output() updateValueAction = new EventEmitter();
  dataModal: any = {};
  constructor() {}

  ngOnInit() {
    this.dataModal[this.fieldId] = this.selectedValue;
  }

  clearInput() {
    this.dataModal[this.fieldId] = '';
    this.saveValue();
  }

  saveValue() {
    this.selectedValue = this.dataModal[this.fieldId];
    this.updateValueAction.emit(this.selectedValue);
  }
}
