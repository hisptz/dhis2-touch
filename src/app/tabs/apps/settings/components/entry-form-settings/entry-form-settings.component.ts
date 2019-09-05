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
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../../../../store';
import { Option, EntryFormSetting, AppColorObject } from 'src/models';
import {
  DEFAULT_FORM_LABEL_SETTINGS,
  DEFAULT_FORM_LAYOUT_SETTINGS,
  DEFAULT_SETTINGS
} from 'src/constants';
import { getUpdatedSettingObject, getUpdatedDataObject } from '../../helpers';

@Component({
  selector: 'app-entry-form-settings',
  templateUrl: './entry-form-settings.component.html',
  styleUrls: ['./entry-form-settings.component.scss']
})
export class EntryFormSettingsComponent implements OnInit {
  @Input() entryFormSetting: EntryFormSetting;

  @Output() entryFormSettingChange = new EventEmitter();

  colorSettings$: Observable<AppColorObject>;
  formLabelOptions: Option[];
  formLayoutOptions: Option[];
  isTrashButtonDisabled: boolean;
  data: any;
  isLoading: boolean;

  constructor(private store: Store<State>) {
    this.isLoading = true;
    this.data = {};
    this.isTrashButtonDisabled = true;
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
  }

  ngOnInit() {
    this.entryFormSetting = this.entryFormSetting || DEFAULT_SETTINGS.entryForm;
    this.formLabelOptions = _.sortBy(DEFAULT_FORM_LABEL_SETTINGS, 'name');
    this.formLayoutOptions = _.sortBy(DEFAULT_FORM_LAYOUT_SETTINGS, 'name');
    this.setUpDataModel(this.entryFormSetting);
  }

  setUpDataModel(entryFormSetting: EntryFormSetting) {
    this.data = getUpdatedDataObject(entryFormSetting);
    setTimeout(() => {
      this.isLoading = false;
    }, 200);
  }

  onEntryFormSetingChnage(data: any) {
    this.entryFormSetting = getUpdatedSettingObject(
      data,
      this.entryFormSetting
    );
    this.entryFormSettingChange.emit({
      id: 'entryForm',
      data: this.entryFormSetting
    });
  }
}
