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

@Component({
  selector: 'app-phone-number-input',
  templateUrl: './phone-number-input.component.html',
  styleUrls: ['./phone-number-input.component.scss']
})
export class PhoneNumberInputComponent implements OnInit {
  @Input() dataElementId: string;
  @Input() categoryOptionComboId: string;
  @Input() lockingFieldStatus: boolean;
  @Input() data: any;
  @Output() phoneNumberChange = new EventEmitter();
  @Input() dataValuesSavingStatusClass: any;

  inputFieldValue: string;
  constructor() {}

  ngOnInit() {
    this.dataValuesSavingStatusClass = this.dataValuesSavingStatusClass || {};
    this.data = this.data || {};
    const id = `${this.dataElementId}-${this.categoryOptionComboId}`;
    if (this.data && this.data[id]) {
      this.inputFieldValue = this.data[id].value;
    } else {
      this.inputFieldValue = '';
    }
  }

  updateValue() {
    const id = `${this.dataElementId}-${this.categoryOptionComboId}`;
    const value = this.inputFieldValue.trim();
    const status = 'not-synced';
    if (value && this.isPhoneNumberValid(value)) {
      if (
        this.data &&
        ((this.data[id] && value !== this.data[id].value) || !this.data[id])
      ) {
        this.phoneNumberChange.emit({ id, value, status });
      }
    } else if (value !== '') {
      this.dataValuesSavingStatusClass[id] = 'input-field-container-failed';
    } else {
      this.dataValuesSavingStatusClass[id] = 'input-field-container';
      this.phoneNumberChange.emit({ id, value, status });
    }
  }

  isPhoneNumberValid(phoneNumber: string) {
    // +24-0455-9034, +21.3789.4512 or +23 1256 4587
    const phoneNumberValidator = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
    return phoneNumberValidator.test(phoneNumber);
  }
}
