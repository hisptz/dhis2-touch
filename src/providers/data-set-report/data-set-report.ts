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
  Generated class for the DataSetReportProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataSetReportProvider {
  constructor(private sqlLite: SqlLiteProvider) {}

  /**
   *
   * @param orgUnit
   * @param dataSetId
   * @param period
   * @param currentUser
   * @param dataDimension
   * @returns {Observable<any>}
   */
  getReportValues(
    orgUnit,
    dataSetId,
    period,
    currentUser,
    dataDimension?
  ): Observable<any> {
    let orgUnitId = orgUnit.id;
    let resourceName = 'dataValues';
    let query = this.getQueryForDataValuesByPeriodAndDataSet(
      dataSetId,
      period,
      dataDimension
    );
    let entryFormDataValuesFromStorage = [];
    return new Observable(observer => {
      this.sqlLite
        .getByUsingQuery(query, resourceName, currentUser.currentDatabase)
        .subscribe(
          (dataValues: any) => {
            this.sqlLite
              .getAllDataFromTable(
                'organisationUnits',
                currentUser.currentDatabase
              )
              .subscribe(
                (organisationUnits: any) => {
                  let orgUnitIdsFilter = [];
                  organisationUnits.forEach((organisationUnit: any) => {
                    if (
                      organisationUnit &&
                      organisationUnit.path.indexOf(orgUnitId) > -1
                    ) {
                      orgUnitIdsFilter.push(organisationUnit.id);
                    }
                  });
                  dataValues.forEach((dataValue: any) => {
                    if (
                      dataValue &&
                      orgUnitIdsFilter.indexOf(dataValue.ou) > -1
                    ) {
                      entryFormDataValuesFromStorage.push({
                        id: dataValue.de + '-' + dataValue.co,
                        value: dataValue.value,
                        de: dataValue.de,
                        co: dataValue.co
                      });
                    }
                  });
                  observer.next(entryFormDataValuesFromStorage);
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
   * @param dataSetId
   * @param period
   * @param dataDimension
   * @returns {string}
   */
  getQueryForDataValuesByPeriodAndDataSet(dataSetId, period, dataDimension?) {
    let query =
      "SELECT co,de,value,ou FROM dataValues WHERE dataSetId ='" +
      dataSetId +
      "'";
    query += " AND pe = '" + period + "';";
    return query;
  }
}
