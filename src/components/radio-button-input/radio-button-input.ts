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
    if (!this.selectedValue) {
      this.selectedValue = '';
    }

    this.dataModal[this.fieldId] = this.selectedValue;
  }

  clearInput() {
    this.dataModal[this.dataModal] = '';
    this.saveValue();
  }

  saveValue() {
    console.log('dataModal :: ' + JSON.stringify(this.dataModal));
    //this.updateValueAction.emit(this.selectedValue);
  }
}
