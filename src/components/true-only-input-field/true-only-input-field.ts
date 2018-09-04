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

/**
 * Generated class for the TrueOnlyInputFieldComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'true-only-input-field',
  templateUrl: 'true-only-input-field.html'
})
export class TrueOnlyInputFieldComponent implements OnInit {
  @Input() dataElementId;
  @Input() categoryOptionComboId;
  @Input() data;
  @Output() onChange = new EventEmitter();
  inputFieldValue: any;
  constructor() {}

  ngOnInit() {
    let fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    if (this.data && this.data[fieldId]) {
      const value = this.data[fieldId].value;
      this.inputFieldValue = value == '' ? false : true;
    }
  }

  updateValues() {
    let fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    const value = this.inputFieldValue ? this.inputFieldValue : '';
    if (this.data && this.data[fieldId] && value != this.data[fieldId].value) {
      this.onChange.emit({
        id: fieldId,
        value: value,
        status: 'not-synced'
      });
    } else if (this.data && !this.data[fieldId]) {
      if (value) {
        this.onChange.emit({
          id: fieldId,
          value: value,
          status: 'not-synced'
        });
      }
    }
  }
}
