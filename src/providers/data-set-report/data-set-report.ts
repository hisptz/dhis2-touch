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
