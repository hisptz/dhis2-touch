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
import { SqlLiteProvider } from '../sql-lite/sql-lite';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the TrackedEntityAttributeValuesProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class TrackedEntityAttributeValuesProvider {
  resource: string;

  constructor(private sqlLite: SqlLiteProvider) {
    this.resource = 'trackedEntityAttributeValues';
  }

  /**
   *
   * @param trackedEntityInstance
   * @param trackedEntityAttributeValues
   * @param currentUser
   * @returns {Observable<any>}
   */
  savingTrackedEntityAttributeValues(
    trackedEntityInstance,
    trackedEntityAttributeValues,
    currentUser
  ): Observable<any> {
    let payLoad = [];
    trackedEntityAttributeValues.forEach((trackedEntityAttributeValue: any) => {
      payLoad.push({
        id: trackedEntityInstance + '-' + trackedEntityAttributeValue.attribute,
        trackedEntityInstance: trackedEntityInstance,
        attribute: trackedEntityAttributeValue.attribute,
        value: trackedEntityAttributeValue.value
      });
    });
    return new Observable(observer => {
      this.sqlLite
        .insertBulkDataOnTable(
          this.resource,
          payLoad,
          currentUser.currentDatabase
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

  /**
   *
   * @param trackedEntityInstanceIds
   * @param currentUser
   * @returns {Observable<any>}
   */
  getTrackedEntityAttributeValues(
    trackedEntityInstanceIds,
    currentUser
  ): Observable<any> {
    return new Observable(observer => {
      this.sqlLite
        .getDataFromTableByAttributes(
          this.resource,
          'trackedEntityInstance',
          trackedEntityInstanceIds,
          currentUser.currentDatabase
        )
        .subscribe(
          (trackedEntityAttributeValues: any) => {
            observer.next(trackedEntityAttributeValues);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }
}
