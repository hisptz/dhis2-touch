import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppProvider } from '../../providers/app/app';

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

  //handling of multi lines data or key values pair
  onChangeBarcodeReader(dataResponse) {
    const { isMultlined } = dataResponse;
    const { isMultidata } = dataResponse;
    const { data } = dataResponse;
    if (!isMultlined && data) {
      this.inputFieldValue = data;
      this.updateValues();
    } else if (isMultlined && !isMultidata && data) {
      if (this.valueType !== 'LONG_TEXT') {
        this.inputFieldValue = data.split('\n').join(' ');
      } else {
        this.inputFieldValue = data;
      }
      this.updateValues();
    } else {
      this.appProvider.setNormalNotification(
        'Scanned value for multi line for text values is not yet supported'
      );
    }
  }
}
