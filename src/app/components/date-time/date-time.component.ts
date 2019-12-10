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
import * as moment from 'moment';
import { DatePicker } from '@ionic-native/date-picker/ngx';

@Component({
  selector: 'app-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss']
})
export class DateTimeComponent implements OnInit {
  @Input() mode: string;
  @Input() lockingFieldStatus: boolean;
  @Input() inputValue: string;
  @Input() withoutHorizontalPadding: boolean;

  @Output() dateTimeChange = new EventEmitter();

  defaultLabel: string;

  constructor(private datePicker: DatePicker) {}

  ngOnInit() {
    this.defaultLabel =
      this.mode === 'date'
        ? 'Touch to pick date'
        : this.mode === 'datetime'
        ? 'Touch to pick date and time'
        : this.mode === 'time'
        ? 'Touch to pick time'
        : '';
  }

  showDateTimePicker() {
    if (!this.lockingFieldStatus) {
      const dateValue = this.getDatePickerValue(this.inputValue, this.mode);
      this.datePicker
        .show({
          date: dateValue,
          mode: this.mode,
          okText: 'Done',
          cancelText: 'Back',
          todayText: 'Today',
          nowText: 'Now',
          allowFutureDates: true,
          is24Hour: false,
          androidTheme: this.datePicker.ANDROID_THEMES
            .THEME_DEVICE_DEFAULT_LIGHT
        })
        .then(
          dateResponse => {
            const displayValue = this.getDisplayValue(
              new Date(dateResponse),
              this.mode
            );
            this.dateTimeChange.emit(displayValue);
          },
          error => {}
        );
    }
  }

  clearInput() {
    if (!this.lockingFieldStatus) {
      this.dateTimeChange.emit('');
    }
  }

  getDatePickerValue(inputValue: string, mode: string) {
    let value = moment(new Date());
    if (inputValue) {
      value =
        mode === 'time'
          ? moment(inputValue, 'HH:mm')
          : mode === 'date'
          ? moment(inputValue, 'YYYY-MM-DD')
          : mode === 'datetime'
          ? moment(inputValue, 'YYYY-MM-DD HH:mm')
          : value;
    }
    return value.toDate();
  }

  getDisplayValue(date: Date, mode: string) {
    return mode === 'time'
      ? moment(date).format('HH:mm')
      : mode === 'date'
      ? moment(date).format('YYYY-MM-DD')
      : mode === 'datetime'
      ? moment(date).format('YYYY-MM-DD HH:mm')
      : '';
  }
}
