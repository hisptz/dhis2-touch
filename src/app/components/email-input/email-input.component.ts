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
  selector: 'app-email-input',
  templateUrl: './email-input.component.html',
  styleUrls: ['./email-input.component.scss']
})
export class EmailInputComponent implements OnInit {
  @Input() dataElementId: string;
  @Input() categoryOptionComboId: string;
  @Input() lockingFieldStatus: boolean;
  @Input() data: any;
  @Output() emailChange = new EventEmitter();
  @Input() dataValuesSavingStatusClass: any;
  inputFieldValue: any;
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
    if (value && this.isEmailValid(value)) {
      if (
        this.data &&
        ((this.data[id] && value !== this.data[id].value) || !this.data[id])
      ) {
        this.emailChange.emit({ id, value, status });
      }
    } else if (value !== '') {
      this.dataValuesSavingStatusClass[id] = 'input-field-container-failed';
    } else {
      this.dataValuesSavingStatusClass[id] = 'input-field-container';
      this.emailChange.emit({ id, value, status });
    }
  }

  isEmailValid(emial: string) {
    const emailvalidator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailvalidator.test(emial);
  }
}
