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
import { CurrentUser } from 'src/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SystemInformationService {
  constructor(
    private httpClientService: HttpClientService,
    private localStorageService: LocalStorageService
  ) {}

  getCurrentUserSystemInformationFromServer(
    user: CurrentUser
  ): Observable<any> {
    return new Observable(observer => {
      const apiUrl = `/api/system/info`;
      this.httpClientService
        .get(apiUrl, true, user)
        .then(response => {
          observer.next(response);
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }

  setUserSystemInformation(systemInformation: any): Observable<any> {
    const { version } = systemInformation;
    const key = 'systemInformation';
    let dhisVersion = '22';
    if (version) {
      const versionArray = version.split('.');
      dhisVersion = versionArray.length > 0 ? versionArray[1] : dhisVersion;
    }
    dhisVersion = dhisVersion.split('-')[0];
    return new Observable(observer => {
      this.localStorageService
        .setDataOnLocalStorage(systemInformation, key)
        .then(() => {
          observer.next(dhisVersion);
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }

  async getCurrentUserSystemInformation(): Promise<any> {
    const key = 'systemInformation';
    return await this.localStorageService.getDataFromLocalStorage(key);
  }
}
