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
import { Option } from 'src/models';

@Component({
  selector: 'app-boolean-input',
  templateUrl: './boolean-input.component.html',
  styleUrls: ['./boolean-input.component.scss']
})
export class BooleanInputComponent implements OnInit {
  @Input() dataElementId: string;
  @Input() lockingFieldStatus: boolean;
  @Input() categoryOptionComboId: string;
  @Input() data: any;

  @Output() valueChange = new EventEmitter();

  inputFieldValue: any;
  fieldId: string;
  options: Option[];

  constructor() {
    this.inputFieldValue = '';
    this.options = [
      {
        name: 'Yes',
        code: 'true',
        id: '1'
      },
      {
        name: 'No',
        code: 'false',
        id: '2'
      }
    ];
  }

  ngOnInit() {
    const id = `${this.dataElementId}-${this.categoryOptionComboId}`;
    this.fieldId = id;
    this.data = this.data || {};
    if (this.data && this.data[id]) {
      this.inputFieldValue = `${this.data[id].value}`;
    }
  }
  onUpdateValue(value) {
    this.inputFieldValue = value;
    const dataValue = value === 'false' ? false : value === 'true' ? true : '';
    this.updateValues(dataValue);
  }

  updateValues(value: string | boolean) {
    const id = `${this.dataElementId}-${this.categoryOptionComboId}`;
    const status = 'not-sync';
    this.valueChange.emit({ id, value, status });
  }
}
