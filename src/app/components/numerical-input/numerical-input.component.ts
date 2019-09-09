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
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ToasterMessagesService } from 'src/app/services/toaster-messages.service';
import { BarcodeSetting } from 'src/models';

@Component({
  selector: 'app-numerical-input',
  templateUrl: './numerical-input.component.html',
  styleUrls: ['./numerical-input.component.scss']
})
export class NumericalInputComponent implements OnInit {
  @Input() dataElementId: string;
  @Input() categoryOptionComboId: string;
  @Input() lockingFieldStatus: boolean;
  @Input() data: any;
  @Input() valueType: string;
  @Input() barcodeSettings: BarcodeSetting;

  @Output() numericalValueChange = new EventEmitter();

  inputFieldValue: string;
  showBarcodeScanner: boolean;

  constructor(private toasterMessage: ToasterMessagesService) {
    this.showBarcodeScanner = false;
    this.inputFieldValue = '';
  }

  ngOnInit() {
    this.valueType = this.valueType || 'NUMBER';
    this.data = this.data || {};
    if (this.barcodeSettings) {
      const { allowBarcodeReaderOnNumerical } = this.barcodeSettings;
      if (allowBarcodeReaderOnNumerical) {
        this.showBarcodeScanner = allowBarcodeReaderOnNumerical;
      }
    }
    const id = `${this.dataElementId}-${this.categoryOptionComboId}`;
    if (this.data && this.data[id]) {
      this.inputFieldValue = this.data[id].value;
    }
  }

  updateValues() {
    const id = `${this.dataElementId}-${this.categoryOptionComboId}`;
    const value = this.inputFieldValue;
    const status = 'not-synced';
    if (
      this.data &&
      ((this.data[id] && value !== this.data[id].value) || !this.data[id])
    ) {
      this.numericalValueChange.emit({ id, value, status });
    }
  }

  // handling of multi lines data or key values pair
  onChangeBarcodeReader(dataResponse) {
    const { isMultlined } = dataResponse;
    const { data } = dataResponse;
    if (!isMultlined && data) {
      if (isNaN(data)) {
        this.toasterMessage.showToasterMessage(
          'Scanned value is not numerical value'
        );
      } else {
        this.inputFieldValue = data;
        this.updateValues();
      }
    } else {
      this.toasterMessage.showToasterMessage(
        'Scanned value for multi line for numerical values is not yet supported'
      );
    }
  }
}
