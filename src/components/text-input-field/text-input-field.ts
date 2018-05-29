import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

/**
 * Generated class for the TextInputFieldComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'text-input-field',
  templateUrl: 'text-input-field.html'
})
export class TextInputFieldComponent implements OnInit {
  @Input() dataElementId;
  @Input() categoryOptionComboId;
  @Input() data;
  @Input() valueType;
  @Input() dataEntrySettings;
  @Output() onChange = new EventEmitter();
  inputFieldValue: any;
  constructor() {}

  ngOnInit() {
    console.log('for text : ' + JSON.stringify(this.dataEntrySettings));
    const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    if (this.data && this.data[fieldId]) {
      this.inputFieldValue = this.data[fieldId].value;
    }
  }

  updateValues() {
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
}
