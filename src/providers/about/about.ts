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
import { Injectable } from '@angular/core';
import { AppProvider } from '../app/app';
import { UserProvider } from '../user/user';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the AboutProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AboutProvider {
  constructor(
    private appProvider: AppProvider,
    private userProvider: UserProvider
  ) {}

  /**
   *
   * @returns {{id: string; name: string; icon: string}[]}
   */
  getAboutContentDetails() {
    const syncContents = [
      //{id : 'appInformation',name : 'App information',icon: 'assets/icon/app-information.png'},
      {
        id: 'dataValues',
        name: 'Aggregate status',
        icon: 'assets/icon/data-values.png'
      },
      {
        id: 'eventStatus',
        name: 'Event status',
        icon: 'assets/icon/event-status.png'
      },
      // {
      //   id: 'eventForTrackerStatus',
      //   name: 'Event for tracker status',
      //   icon: 'assets/icon/event-status.png'
      // },
      // {
      //   id: 'enrollment',
      //   name: 'Enrollments',
      //   icon: 'assets/icon/profile-tracker.png'
      // },
      {
        id: 'systemInfo',
        name: 'System info',
        icon: 'assets/icon/system-info.png'
      }
    ];
    return syncContents;
  }

  /**
   *
   * @returns {Observable<any>}
   */
  getAppInformation(): Observable<any> {
    let appInformation = { name: '', version: '', package: '' };
    return new Observable(observer => {
      this.appProvider.getAppInformation().subscribe(
        (response: any) => {
          appInformation.name = response.appName;
          appInformation.version = response.versionNumber;
          appInformation.package = response.packageName;
          observer.next(appInformation);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  /**
   *
   * @returns {Observable<any>}
   */
  getSystemInformation(): Observable<any> {
    return new Observable(observer => {
      this.userProvider.getCurrentUserSystemInformation().subscribe(
        systemInfo => {
          observer.next(this.getArrayFromObject(systemInfo));
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  /**
   *
   * @param object
   * @returns {Array}
   */
  getArrayFromObject(object) {
    let array = [];
    for (let key in object) {
      let newValue = object[key];
      if (newValue instanceof Object) {
        newValue = JSON.stringify(newValue);
      }
      const newKey = (key.charAt(0).toUpperCase() + key.slice(1))
        .replace(/([A-Z])/g, ' $1')
        .trim();
      array.push({ key: newKey, value: newValue });
    }
    return array;
  }
}
