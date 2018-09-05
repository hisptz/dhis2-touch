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
import { SqlLiteProvider } from '../sql-lite/sql-lite';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the LocalInstanceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocalInstanceProvider {
  LOCAL_INSTANCE_KEY: string;

  constructor(private sqlLiteProvider: SqlLiteProvider) {
    this.LOCAL_INSTANCE_KEY = 'LOCAL_INSTANCE_KEY';
  }

  /**
   *
   * @returns {Observable<any>}
   */
  getLocalInstances(): Observable<any> {
    return new Observable(observer => {
      this.sqlLiteProvider
        .createTable(this.LOCAL_INSTANCE_KEY, this.LOCAL_INSTANCE_KEY)
        .subscribe(
          () => {
            this.sqlLiteProvider
              .getAllDataFromTable(
                this.LOCAL_INSTANCE_KEY,
                this.LOCAL_INSTANCE_KEY
              )
              .subscribe(
                (localInstances: any) => {
                  observer.next(localInstances);
                  observer.complete();
                },
                error => {
                  observer.error(error);
                }
              );
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  /**
   *
   * @param localInstances
   * @param currentUser
   * @param loggedInInInstance
   * @returns {Observable<any>}
   */
  setLocalInstanceInstances(
    localInstances,
    currentUser,
    loggedInInInstance
  ): Observable<any> {
    return new Observable(observer => {
      let newInstances = [];
      if (!loggedInInInstance && (currentUser && currentUser.serverUrl)) {
        loggedInInInstance = currentUser.serverUrl;
        if (currentUser.serverUrl.split('://').length > 1) {
          loggedInInInstance = currentUser.serverUrl.split('://')[1];
        }
      }
      newInstances.push({
        id: currentUser.currentDatabase,
        name: loggedInInInstance,
        currentUser: currentUser,
        currentLanguage: currentUser.currentLanguage
      });
      if (localInstances && localInstances.length) {
        localInstances.forEach((localInstance: any) => {
          if (localInstance.id != currentUser.currentDatabase) {
            if (!localInstance.currentUser.currentLanguage) {
              localInstance.currentLanguage = 'en';
              localInstance.currentUser.currentLanguage = 'en';
            }
            newInstances.push(localInstance);
          }
        });
      }
      this.sqlLiteProvider
        .insertBulkDataOnTable(
          this.LOCAL_INSTANCE_KEY,
          newInstances,
          this.LOCAL_INSTANCE_KEY
        )
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
}
