import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

/**
 * Generated class for the NumericalInputFieldComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'numerical-input-field',
  templateUrl: 'numerical-input-field.html'
})
export class NumericalInputFieldComponent implements OnInit {
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
    const { allowBarcodeReaderOnNumerical } = this.dataEntrySettings;
    if (allowBarcodeReaderOnNumerical) {
      this.showBarcodeScanner = allowBarcodeReaderOnNumerical;
    }
    const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    if (this.data && this.data[fieldId]) {
      this.inputFieldValue = this.data[fieldId].value;
    }
  }

  updateValues() {
    let fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
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
