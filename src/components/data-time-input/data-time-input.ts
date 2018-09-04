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
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DatePicker } from '@ionic-native/date-picker';
import * as moment from 'moment';
/**
 * Generated class for the DataTimeInputComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'data-time-input',
  templateUrl: 'data-time-input.html'
})
export class DataTimeInputComponent implements OnInit {
  @Input() mode: string;
  @Input() inputValue: string;
  @Input() withoutHorizontalPadding: boolean;
  @Output() dateTimeUpdateAction = new EventEmitter();
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

  showTime() {
    const date = this.getDatePickerValue(this.inputValue, this.mode);
    this.datePicker
      .show({
        date: date,
        mode: this.mode,
        okText: 'Done',
        cancelText: 'Back',
        todayText: 'Today',
        nowText: 'Now',
        allowFutureDates: true,
        is24Hour: false,
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
      })
      .then(
        date => {
          const displayValue = this.getDisplayValue(new Date(date), this.mode);
          this.dateTimeUpdateAction.emit(displayValue);
        },
        error => {}
      );
  }

  clearInput() {
    this.dateTimeUpdateAction.emit('');
  }

  getDatePickerValue(inputValue, mode) {
    let value = moment(new Date());
    if (inputValue) {
      if (mode === 'time') {
        value = moment(inputValue, 'HH:mm');
      } else if (mode === 'date') {
        value = moment(inputValue, 'YYYY-MM-DD');
      } else if (mode === 'datetime') {
        value = moment(inputValue, 'YYYY-MM-DD HH:mm');
      }
    }
    return value.toDate();
  }

  getDisplayValue(date, mode) {
    let displayValue = '';
    if (mode === 'time') {
      displayValue = moment(date).format('HH:mm');
    } else if (mode === 'date') {
      displayValue = moment(date).format('YYYY-MM-DD');
    } else if (mode === 'datetime') {
      displayValue = moment(date).format('YYYY-MM-DD HH:mm');
    }
    return displayValue;
  }
}
