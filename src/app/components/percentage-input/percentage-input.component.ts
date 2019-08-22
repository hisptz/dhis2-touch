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
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-percentage-input',
  templateUrl: './percentage-input.component.html',
  styleUrls: ['./percentage-input.component.scss']
})
export class PercentageInputComponent implements OnInit {
  @Input() dataElementId: string;
  @Input() categoryOptionComboId: string;
  @Input() data: any;
  @Input() lockingFieldStatus: boolean;
  @Output() percentageChange = new EventEmitter();

  displayValue: string;
  rangeValue: number | string;
  maxCount: number;
  colorSettings$: Observable<any>;

  constructor(private store: Store<State>) {
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
    this.maxCount = 100;
    this.displayValue = '';
  }

  ngOnInit() {
    const id = `${this.dataElementId}-${this.categoryOptionComboId}`;
    this.data = this.data || {};
    if (this.data && this.data[id]) {
      const value = this.data[id].value;
      if (value && !isNaN(value) && value !== '') {
        this.displayValue = value;
        this.rangeValue = value;
      }
    }
  }

  clearInput() {
    const value = '';
    this.rangeValue = 0;
    this.displayValue = value;
    this.saveValue(value);
  }
  updateValue() {
    const dataValue = this.rangeValue > 0 ? this.rangeValue.toString() : '';
    this.displayValue = dataValue;
    this.saveValue(dataValue);
  }

  saveValue(value: string) {
    const id = `${this.dataElementId}-${this.categoryOptionComboId}`;
    const status = 'not-synced';
    if (
      this.data &&
      ((this.data[id] && value !== this.data[id].value) || !this.data[id])
    ) {
      this.percentageChange.emit({ id, value, status });
    }
  }
}
