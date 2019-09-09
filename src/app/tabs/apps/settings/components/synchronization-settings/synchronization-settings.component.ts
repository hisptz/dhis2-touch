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
import { SynchronizationSetting, AppColorObject, Option } from 'src/models';
import {
  DEFAULT_SETTINGS,
  DEFAULT_UNIT_TIME_SYNCHRONIZATION
} from 'src/constants';
import { getUpdatedSettingObject, getUpdatedDataObject } from '../../helpers';

@Component({
  selector: 'app-synchronization-settings',
  templateUrl: './synchronization-settings.component.html',
  styleUrls: ['./synchronization-settings.component.scss']
})
export class SynchronizationSettingsComponent implements OnInit {
  @Input() synchronizationSetting: SynchronizationSetting;

  @Output() synchronizationSettingChange = new EventEmitter();

  colorSettings$: Observable<AppColorObject>;
  data: any;
  unitTimeSynchronizationOptions: Option[];
  isLoading: boolean;
  isTrashButtonDisabled: boolean;

  constructor(private store: Store<State>) {
    this.isLoading = true;
    this.isTrashButtonDisabled = true;
    this.data = {};
    this.unitTimeSynchronizationOptions = DEFAULT_UNIT_TIME_SYNCHRONIZATION;
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
  }
  ngOnInit() {
    this.synchronizationSetting =
      this.synchronizationSetting || DEFAULT_SETTINGS.synchronization;
    this.setUpDataModel(this.synchronizationSetting);
  }

  setUpDataModel(synchronizationSettings: SynchronizationSetting) {
    this.data = getUpdatedDataObject(synchronizationSettings);
    setTimeout(() => {
      this.isLoading = false;
    }, 200);
  }

  getNumberOfUnitOfTimeLabel() {
    return `Number of ${this.synchronizationSetting.timeType}`;
  }

  onSynchronizationSetingChnage(data: any) {
    this.synchronizationSetting = getUpdatedSettingObject(
      data,
      this.synchronizationSetting
    );
    const isTypeOnSyncSettingChange = true;
    this.synchronizationSettingChange.emit({
      id: 'synchronization',
      isTypeOnSyncSettingChange,
      data: this.synchronizationSetting
    });
  }
}
