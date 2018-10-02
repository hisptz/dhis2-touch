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
 * Generated class for the DateInputFieldComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'date-input-field',
  templateUrl: 'date-input-field.html'
})
export class DateInputFieldComponent implements OnInit {
  @Input() dataElementId: string;
  @Input() categoryOptionComboId: string;
  @Input() data;
  @Input() valueType: string;
  @Output() onChange = new EventEmitter();

  inputFieldValue: string;
  mode: string;

  constructor() {}

  ngOnInit() {
    const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    if (this.data && this.data[fieldId]) {
      this.inputFieldValue = this.data[fieldId].value;
    }
    this.mode =
      this.valueType && this.valueType != ''
        ? this.valueType.toLowerCase()
        : 'date';
  }

  updateValue(value) {
    const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    this.inputFieldValue = value;
    const data = {
      id: fieldId,
      value: value,
      status: 'not-synced'
    };
    this.onChange.emit(data);
  }
}
