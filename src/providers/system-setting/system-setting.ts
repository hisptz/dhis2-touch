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
 */
import { Injectable } from '@angular/core';
import { HttpClientProvider } from '../http-client/http-client';
import { Observable } from 'rxjs/Observable';
import { CurrentUser } from '../../models/currentUser';
import { LocalStorageProvider } from '../local-storage/local-storage';

/*
  Generated class for the SystemSettingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SystemSettingProvider {
  constructor(
    private httpClientProvider: HttpClientProvider,
    private localStorageProvider: LocalStorageProvider
  ) {}

  getSystemSettingsFromServer(currentUser: CurrentUser): Observable<any> {
    return new Observable(observer => {
      const url = '/api/systemSettings';
      this.httpClientProvider.get(url, true, currentUser).subscribe(
        response => {
          const { keyFlag } = response;
          const { currentStyle } = response;
          const { keyApplicationFooter } = response;
          const { applicationTitle } = response;
          const { keyApplicationNotification } = response;
          const { keyApplicationIntro } = response;
          observer.next({
            keyFlag,
            currentStyle,
            keyApplicationFooter,
            applicationTitle,
            keyApplicationNotification,
            keyApplicationIntro
          });
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  saveSystemSettings(systemSettings: any, serverUrl: string): Observable<any> {
    return new Observable(observer => {
      const key = 'systemSettings-' + serverUrl;
      this.localStorageProvider
        .setDataOnLocalStorage(systemSettings, key)
        .subscribe(
          () => {
            observer.next();
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  getSavedSystemSettings(serverUrl: string): Observable<any> {
    return new Observable(observer => {
      const key = 'systemSettings-' + serverUrl;
      this.localStorageProvider.getDataOnLocalStorage(key).subscribe(
        systemSettings => {
          observer.next(systemSettings);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }
}
