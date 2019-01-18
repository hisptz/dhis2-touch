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
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the ProfileInfoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'profile-info',
  templateUrl: 'profile-info.html'
})
export class ProfileInfoComponent implements OnInit {
  @Input() data;
  @Input() currentUser;
  @Input() profileInfoForm;
  @Input() dataEntrySettings;
  @Input() barcodeSettings;
  @Input() dataValuesSavingStatusClass;

  @Output() onProfileInfoUpdate = new EventEmitter();

  numericalInputField;
  textInputField;
  dataObject: any = {};
  isLoading: boolean;

  constructor() {
    this.isLoading = true;
    this.numericalInputField = [
      'INTEGER_NEGATIVE',
      'INTEGER_POSITIVE',
      'INTEGER',
      'NUMBER',
      'INTEGER_ZERO_OR_POSITIVE'
    ];
    this.textInputField = ['TEXT', 'LONG_TEXT'];
  }

  ngOnInit() {
    Object.keys(this.data).map(key => {
      if (key !== 'status') {
        const id = key + '-profile';
        this.dataObject[id] = { id: id, value: this.data[key] };
      }
    });
    this.isLoading = false;
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }

  updateValue(data) {
    this.data.status = false;
    if (data && data.id) {
      const { id } = data;
      const { value } = data;
      this.dataValuesSavingStatusClass[id] = 'input-field-container-saving';
      this.dataObject[id] = data;
      const dataId = id.split('-profile')[0];
      this.data[dataId] = value;
      this.onProfileInfoUpdate.emit({ data: this.data, id: id });
    }
  }
}
