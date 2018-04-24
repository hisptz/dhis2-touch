import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

/**
 * Generated class for the PhoneNumberInputComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'phone-number-input',
  templateUrl: 'phone-number-input.html'
})
export class PhoneNumberInputComponent implements OnInit {
  @Input() dataElementId;
  @Input() categoryOptionComboId;
  @Input() data;
  @Input() valueType;
  @Output() onChange = new EventEmitter();
  inputFieldValue: any;
  constructor() {}

  ngOnInit() {
    const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    if (this.data && this.data[fieldId]) {
      this.inputFieldValue = this.data[fieldId].value;
    }
  }

  saveValue() {
    const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    if (
      this.data &&
      this.data[fieldId] &&
      this.inputFieldValue != this.data[fieldId].value
    ) {
      this.onChange.emit({
        id: fieldId,
        value: this.inputFieldValue,
        status: 'not-synced'
      });
    } else if (this.data && !this.data[fieldId]) {
      if (this.inputFieldValue) {
        this.onChange.emit({
          id: fieldId,
          value: this.inputFieldValue,
          status: 'not-synced'
        });
      }
    }
  }

  updateValue() {
    console.log(this.inputFieldValue);
    if (this.inputFieldValue) {
      console.log(this.isPhoneNumberValid(this.inputFieldValue));
    }
  }

  isPhoneNumberValid(phoneNumber: string) {
    // +24-0455-9034, +21.3789.4512 or +23 1256 4587
    const phoneNumberValidator = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
    return phoneNumberValidator.test(phoneNumber);
  }
}
