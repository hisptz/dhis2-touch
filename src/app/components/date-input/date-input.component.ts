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
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss']
})
export class DateInputComponent implements OnInit {
  @Input() dataElementId: string;
  @Input() categoryOptionComboId: string;
  @Input() lockingFieldStatus: boolean;
  @Input() data: any;
  @Input() valueType: string;

  @Output() valueChange = new EventEmitter();

  inputFieldValue: string;
  mode: string;

  constructor() {}

  ngOnInit() {
    const id = `${this.dataElementId}-${this.categoryOptionComboId}`;
    if (this.data && this.data[id]) {
      this.inputFieldValue = this.data[id].value;
    }
    this.mode =
      this.valueType && this.valueType !== ''
        ? this.valueType.toLowerCase()
        : 'date';
  }

  updateDateValue(value: string) {
    const id = `${this.dataElementId}-${this.categoryOptionComboId}`;
    const status = 'not-synced';
    this.inputFieldValue = value;
    this.valueChange.emit({ id, value, status });
  }
}
