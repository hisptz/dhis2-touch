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
  showBarcodeScanner: boolean;

  constructor() {
    this.showBarcodeScanner = false;
  }

  ngOnInit() {
    const { allowBarcodeReaderOnText } = this.dataEntrySettings;
    if (allowBarcodeReaderOnText) {
      this.showBarcodeScanner = allowBarcodeReaderOnText;
    }
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

  onChangeBarcodeReader(dataResponse) {
    const { isMultlined } = dataResponse;
    const { isMultidata } = dataResponse;
    const { data } = dataResponse;
    console.log('isMultidata : ' + isMultidata);
    console.log('isMultlined : ' + isMultlined);
    console.log('data : ' + data);
  }
}
