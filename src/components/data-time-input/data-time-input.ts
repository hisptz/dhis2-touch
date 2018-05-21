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
        okText: 'Update',
        cancelText: 'Cancel',
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
