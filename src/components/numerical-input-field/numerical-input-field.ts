import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppProvider } from '../../providers/app/app';

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

  constructor(private appProvider: AppProvider) {
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
    if (!isMultlined && data) {
      if (isNaN(data)) {
        this.appProvider.setNormalNotification(
          'Scanned value is not numerical value'
        );
      } else {
        this.inputFieldValue = data;
        this.updateValues();
      }
    } else {
      this.appProvider.setNormalNotification(
        'Scanned value for multi line for numerical values is not yet supported'
      );
    }
  }
}
