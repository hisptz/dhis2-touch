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
import { HttpClientService } from './http-client.service';
import { LocalStorageService } from './local-storage.service';
import { CurrentUser, SystemSettings } from 'src/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SystemSettingService {
  constructor(
    private httpClientService: HttpClientService,
    private localStorageService: LocalStorageService
  ) {}

  getSystemSettingsFromServer(user: CurrentUser): Observable<SystemSettings> {
    const apiUrl = `/api/systemSettings`;
    return new Observable(observer => {
      this.httpClientService
        .get(apiUrl, true, user)
        .then((response: any) => {
          const {
            keyFlag,
            currentStyle,
            keyApplicationFooter,
            applicationTitle,
            keyApplicationNotification,
            keyApplicationIntro
          } = response;
          observer.next({
            keyFlag,
            currentStyle,
            keyApplicationFooter,
            applicationTitle,
            keyApplicationNotification,
            keyApplicationIntro
          });
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }

  saveSystemSettings(
    systemSettings: SystemSettings,
    user: CurrentUser
  ): Promise<any> {
    const { serverUrl } = user;
    const key = `systemSettings-${serverUrl}`;
    return this.localStorageService.setDataOnLocalStorage(systemSettings, key);
  }

  getSavedSystemSettings(user: CurrentUser): Promise<SystemSettings> {
    const { serverUrl } = user;
    const key = `systemSettings-${serverUrl}`;
    return this.localStorageService.getDataFromLocalStorage(key);
  }
}
