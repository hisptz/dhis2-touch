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
