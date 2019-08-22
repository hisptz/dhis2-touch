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
  selector: 'app-true-only-input',
  templateUrl: './true-only-input.component.html',
  styleUrls: ['./true-only-input.component.scss']
})
export class TrueOnlyInputComponent implements OnInit {
  @Input() dataElementId: string;
  @Input() categoryOptionComboId: string;
  @Input() lockingFieldStatus: boolean;
  @Input() data: any;
  @Output() valueChange = new EventEmitter();

  inputFieldValue: any;
  colorSettings$: Observable<any>;

  constructor(private store: Store<State>) {
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
  }

  ngOnInit() {
    this.data = this.data || {};
    const id = `${this.dataElementId}-${this.categoryOptionComboId}`;
    if (this.data && this.data[id]) {
      const value = this.data[id].value;
      this.inputFieldValue = value === '' ? false : true;
    }
  }

  updateValues() {
    const id = `${this.dataElementId}-${this.categoryOptionComboId}`;
    const status = 'not-sync';
    const value = this.inputFieldValue ? this.inputFieldValue : '';
    if (
      this.data &&
      (!this.data[id] || (this.data[id] && value !== this.data[id]))
    ) {
      this.valueChange.emit({ id, value, status });
    }
  }
}
