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
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

/**
 * Generated class for the UnitIntervalInputComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'unit-interval-input',
  templateUrl: 'unit-interval-input.html'
})
export class UnitIntervalInputComponent implements OnInit {
  @Input() dataElementId;
  @Input() categoryOptionComboId;
  @Input() data;
  @Output() onChange = new EventEmitter();

  rangeValue: any;
  displayValue: any;
  maxCount: number;
  constructor() {
    this.maxCount = 100;
    this.rangeValue = 0;
  }

  ngOnInit() {
    const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    if (this.data && this.data[fieldId]) {
      const dataValue = this.data[fieldId].value;
      if (dataValue) {
        this.displayValue = dataValue;
        this.rangeValue = dataValue * this.maxCount;
      } else {
        this.displayValue = '';
      }
    }
  }

  clearValue() {
    const dataValue = '';
    this.rangeValue = 0;
    this.displayValue = dataValue;
    this.saveValue(dataValue);
  }

  updateValue() {
    const dataValue = this.rangeValue / this.maxCount;
    this.displayValue = dataValue;
    this.saveValue(dataValue);
  }

  saveValue(dataValue) {
    const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    if (
      this.data &&
      this.data[fieldId] &&
      dataValue != this.data[fieldId].value
    ) {
      this.onChange.emit({
        id: fieldId,
        value: dataValue,
        status: 'not-synced'
      });
    } else if (this.data && !this.data[fieldId]) {
      if (dataValue) {
        this.onChange.emit({
          id: fieldId,
          value: dataValue,
          status: 'not-synced'
        });
      }
    }
  }
}
