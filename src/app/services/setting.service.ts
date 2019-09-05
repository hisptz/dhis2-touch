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

import { Injectable } from '@angular/core';
import { AppSetting, CurrentUser } from 'src/models';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  constructor(private localStorageService: LocalStorageService) {}

  async setCurrentSettingsForTheApp(
    user: CurrentUser,
    appSettings: AppSetting
  ): Promise<any> {
    const { currentDatabase } = user;
    const key = `appSettings-${currentDatabase}`;
    await this.localStorageService.setDataOnLocalStorage(appSettings, key);
  }
  async getCurrentSettingsForTheApp(user: CurrentUser): Promise<any> {
    const { currentDatabase } = user;
    const key = `appSettings-${currentDatabase}`;
    return await this.localStorageService.getDataFromLocalStorage(key);
  }

  getSanitizedSettings(appSettings: AppSetting) {
    if (appSettings.entryForm) {
      if (
        isNaN(appSettings.entryForm.maxDataElementOnDefaultForm) ||
        appSettings.entryForm.maxDataElementOnDefaultForm <= 0
      ) {
        appSettings.entryForm.maxDataElementOnDefaultForm = 1;
      }
    }
    if (appSettings.synchronization) {
      if (
        isNaN(appSettings.synchronization.time) ||
        appSettings.synchronization.time < 1
      ) {
        appSettings.synchronization.time = 1;
      }
      appSettings.synchronization.time = this.getSynchronizationTimeToSave(
        appSettings.synchronization.time,
        appSettings.synchronization.timeType
      );
    }
    return appSettings;
  }

  getSynchronizationTimeToSave(time: number, timeType: string) {
    return timeType === 'minutes'
      ? time * 60 * 1000
      : timeType === 'hours'
      ? time * 60 * 60 * 1000
      : time;
  }

  getDisplaySynchronizationTime(time, timeType) {
    return timeType === 'minutes'
      ? time / (60 * 1000)
      : timeType === 'hours'
      ? time(60 * 60 * 1000)
      : time;
  }
}
