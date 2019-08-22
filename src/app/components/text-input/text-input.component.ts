/*
 *
 * Copyright 2019 HISP Tanzania
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
 * @since 2019
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToasterMessagesService } from 'src/app/services/toaster-messages.service';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnInit {
  @Input() dataElementId: string;
  @Input() categoryOptionComboId: string;
  @Input() data: any;
  @Input() valueType: string;
  @Input() readonly: boolean;
  @Input() barcodeSettings: any;
  @Input() placeholder: string;
  @Input() lockingFieldStatus: boolean;
  @Input() updateOnChangeValue: boolean;

  @Output() change = new EventEmitter();

  inputFieldValue: any;
  showBarcodeScanner: boolean;

  constructor(private toasterMessage: ToasterMessagesService) {
    this.showBarcodeScanner = false;
    this.inputFieldValue = '';
  }

  ngOnInit() {
    this.readonly = this.readonly || false;
    this.lockingFieldStatus = this.lockingFieldStatus || this.readonly;
    if (!this.placeholder) {
      this.placeholder = '';
    }
    if (this.barcodeSettings) {
      const { allowBarcodeReaderOnText } = this.barcodeSettings;
      if (allowBarcodeReaderOnText) {
        this.showBarcodeScanner = allowBarcodeReaderOnText;
      }
    }
    const id = `${this.dataElementId}-${this.categoryOptionComboId}`;
    if (this.data && this.data[id]) {
      this.inputFieldValue = this.data[id].value;
    }
  }

  updateTextInputValue() {
    const id = `${this.dataElementId}-${this.categoryOptionComboId}`;
    const value = this.inputFieldValue.trim();
    const status = 'not-synced';
    this.change.emit({ id, value, status });
  }

  // @todo handling of multi lines data or key values pair
  onChangeBarcodeReader(dataResponse: any) {
    const { isMultlined } = dataResponse;
    const { isMultidata } = dataResponse;
    const { data } = dataResponse;
    if (!isMultlined && data) {
      this.inputFieldValue = data;
      this.updateTextInputValue();
    } else if (isMultlined && !isMultidata && data) {
      if (this.valueType !== 'LONG_TEXT') {
        this.inputFieldValue = data.split('\n').join(' ');
      } else {
        this.inputFieldValue = data;
      }
      this.updateTextInputValue();
    } else {
      this.toasterMessage.showToasterMessage(
        'Scanned value for multi line for text values is not yet supported'
      );
    }
  }
}
