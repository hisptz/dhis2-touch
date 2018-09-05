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
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

/**
 * Generated class for the EmailInputComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'email-input',
  templateUrl: 'email-input.html'
})
export class EmailInputComponent implements OnInit {
  @Input() dataElementId;
  @Input() categoryOptionComboId;
  @Input() data;
  @Input() valueType;
  @Output() onChange = new EventEmitter();
  @Input() dataValuesSavingStatusClass;
  inputFieldValue: any;
  constructor() {}

  ngOnInit() {
    const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    if (this.data && this.data[fieldId]) {
      this.inputFieldValue = this.data[fieldId].value;
    }
  }

  updateValue() {
    const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    if (this.inputFieldValue && this.isEmailValid(this.inputFieldValue)) {
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
    } else if (this.inputFieldValue.trim() !== '') {
      this.dataValuesSavingStatusClass[fieldId] =
        'input-field-container-failed';
    } else {
      this.onChange.emit({
        id: fieldId,
        value: this.inputFieldValue.trim(),
        status: 'not-synced'
      });
      this.dataValuesSavingStatusClass[fieldId] = 'input-field-container';
    }
  }
  isEmailValid(emial: string) {
    const emailvalidator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailvalidator.test(emial);
  }
}
