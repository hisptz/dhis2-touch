import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppProvider } from '../../providers/app/app';
/**
 * Generated class for the PasswordInputComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'password-input',
  templateUrl: 'password-input.html'
})
export class PasswordInputComponent {
  @Input() dataElementId;
  @Input() categoryOptionComboId;
  @Input() data;
  @Input() barcodeSettings;
  @Output() onChange = new EventEmitter();
  inputFieldValue: any;
  showBarcodeScanner: boolean;

  constructor(private appProvider: AppProvider) {
    this.showBarcodeScanner = false;
  }

  ngOnInit() {
    const { allowBarcodeReaderOnText } = this.barcodeSettings;
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
    this.onChange.emit({
      id: fieldId,
      value: this.inputFieldValue,
      status: 'not-synced'
    });
  }

  onChangeBarcodeReader(dataResponse) {
    const { isMultlined } = dataResponse;
    const { data } = dataResponse;
    if (!isMultlined && data) {
      this.inputFieldValue = data;
      this.updateValues();
    } else {
      this.appProvider.setNormalNotification(
        'Scanned value for multi line for text values is not yet supported'
      );
    }
  }
}
