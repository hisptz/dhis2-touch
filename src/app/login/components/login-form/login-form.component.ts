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
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CurrentUser, LoginFormField } from 'src/models';
import { LOGIN_FORM_FIELDS } from 'src/constants';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  @Input()
  currentUser: CurrentUser;

  @Output()
  loginFormReady = new EventEmitter();
  @Output() startLoginProcess = new EventEmitter();

  @Input() buttonColor: string;

  isLoading: boolean;
  isLoginFormValid: boolean;
  updateOnChangeValue: boolean;
  loginFormData: any;
  data: any;
  loginFormFields: LoginFormField[];

  constructor() {
    this.loginFormFields = LOGIN_FORM_FIELDS;
    this.loginFormData = {};
    this.data = {};
    this.isLoading = true;
    this.updateOnChangeValue = true;
  }

  ngOnInit() {
    this.loginFormFields.map((field: any) => {
      const { id } = field;
      const fieldId = id + '-login';
      const value =
        this.currentUser && this.currentUser[id] ? this.currentUser[id] : '';
      this.data[fieldId] = { id: fieldId, value: value };
      if (value.trim() !== '') {
        this.loginFormData[id] = value;
      }
    });
    this.isLoading = false;
    this.checkingForFormValidity();
  }

  updateValue(data) {
    const { id } = data;
    const { value } = data;
    if (id) {
      const fieldId = id.split('-')[0];
      delete this.loginFormData[fieldId];
      if (value) {
        this.loginFormData[fieldId] = value;
      }
      this.checkingForFormValidity();
    }
  }

  checkingForFormValidity() {
    const data = {
      status:
        Object.keys(this.loginFormData).length === this.loginFormFields.length,
      currentUser: this.loginFormData
    };
    this.isLoginFormValid = data.status;
    this.loginFormReady.emit(data);
  }

  onStartLoginProcess() {
    this.startLoginProcess.emit({ status: true });
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }
}
