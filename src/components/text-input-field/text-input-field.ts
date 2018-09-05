/*
 *
 * Copyright 2015 HISP Tanzania
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 *
 * @since 2015
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
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
  @Input() dataElementId: string;
  @Input() categoryOptionComboId: string;
  @Input() data: any;
  @Input() valueType: string;
  @Input() barcodeSettings: any;
  @Input() placeholder: string;

  @Output() onChange = new EventEmitter();

  inputFieldValue: any;
  showBarcodeScanner: boolean;

  constructor(private appProvider: AppProvider) {
    this.showBarcodeScanner = false;
  }

  ngOnInit() {
    if (!this.placeholder) {
      this.placeholder = '';
    }
    const { allowBarcodeReaderOnText } = this.barcodeSettings;
    if (allowBarcodeReaderOnText) {
      this.showBarcodeScanner = allowBarcodeReaderOnText;
    }
    const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    if (this.data && this.data[fieldId]) {
      this.inputFieldValue = this.data[fieldId].value;
    } else {
      this.inputFieldValue = '';
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
