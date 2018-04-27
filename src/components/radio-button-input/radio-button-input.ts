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
  @Input() selectedValue;
  @Output() updateValueAction = new EventEmitter();

  constructor() {}

  ngOnInit() {
    if (!this.selectedValue) {
      this.selectedValue = '';
    }
  }

  clearInput() {
    this.selectedValue = '';
    this.saveValue();
  }

  saveValue() {
    this.updateValueAction.emit(this.selectedValue);
  }
}
