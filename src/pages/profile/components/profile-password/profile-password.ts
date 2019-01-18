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
 * Generated class for the ProfilePasswordComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'profile-password',
  templateUrl: 'profile-password.html'
})
export class ProfilePasswordComponent implements OnInit {
  @Input() currentUser;
  @Input() dataEntrySettings;
  @Input() barcodeSettings;
  @Input() isPasswordFormValid: boolean;
  @Input() isUserPasswordUpdateProcessActive: boolean;
  @Input() colorSettings: any;

  @Output() onChangePasswordFormField = new EventEmitter();
  @Output() onUpdateUserPassword = new EventEmitter();

  dataObject;
  formFields;

  constructor() {
    this.dataObject = {};
    this.formFields = [];
  }

  ngOnInit() {
    this.formFields = this.getUpdateUserPasswordForm();
  }

  updateValue(data, key) {
    const { value } = data;
    if (value && value.trim() !== '') {
      this.dataObject[key] = value;
      this.onChangePasswordFormField.emit({ id: key, value: value });
    }
  }

  updatePassword() {
    setTimeout(() => {
      const key = 'newPassword';
      const value = this.dataObject[key];
      this.onUpdateUserPassword.emit(value);
    }, 100);
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }

  getUpdateUserPasswordForm() {
    return [
      {
        id: 'oldPassword',
        displayName: 'Old password'
      },
      {
        id: 'newPassword',
        displayName: 'New password'
      },
      {
        id: 'newPasswordConfirmation',
        displayName: 'New password confirmation'
      }
    ];
  }
}
