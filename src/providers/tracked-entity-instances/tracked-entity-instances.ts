import {Injectable} from '@angular/core';
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {Observable} from "rxjs/Observable";

declare var dhis2: any;

/*
  Generated class for the TrackedEntityInstancesProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class TrackedEntityInstancesProvider {

  resource: string;

  constructor(private sqlLite: SqlLiteProvider) {
    this.resource = "trackedEntityInstances";
  }

  /**
   *
   * @param trackedEntityId
   * @param orgUnitId
   * @param orgUnitName
   * @param syncStatus
   * @param trackedEntityInstance
   * @returns {Array}
   */
  getTrackedEntityInstancesPayLoad(trackedEntityId, orgUnitId, orgUnitName, syncStatus, trackedEntityInstance?) {
    if (!trackedEntityInstance) {
      trackedEntityInstance = dhis2.util.uid();
    }
    if (!syncStatus) {
      syncStatus = "not-synced"
    }
    let payLoad = {
      "id": trackedEntityInstance,
      "trackedEntity": trackedEntityId,
      "orgUnit": orgUnitId,
      "orgUnitName": orgUnitName,
      "trackedEntityInstance": trackedEntityInstance,
      "deleted": false,
      "inactive": false,
      "enrollments": [],
      "relationships": [],
      "syncStatus": syncStatus
    };
    let payLoads = [];
    payLoads.push(payLoad);
    return payLoads;
  }

  /**
   *
   * @param attribute
   * @param attributeArray
   * @param currentUser
   * @returns {Observable<any>}
   */
  getTrackedEntityInstancesByAttribute(attribute, attributeArray, currentUser): Observable<any> {
    return new Observable(observer => {
      this.sqlLite.getDataFromTableByAttributes(this.resource, attribute, attributeArray, currentUser.currentDatabase).subscribe((trackedEntityInstances: any) => {
        observer.next(trackedEntityInstances);
        observer.complete();
      }, error => {
        observer.error(error);
      })
    })
  }

  /**
   *
   * @param currentUser
   * @returns {Observable<any>}
   */
  getAllTrackedEntityInstances(currentUser): Observable<any> {
    return new Observable(observer => {
      this.sqlLite.getAllDataFromTable(this.resource, currentUser.currentDatabase).subscribe((trackedEntityInstances: any) => {
        observer.next(trackedEntityInstances);
        observer.complete();
      }, error => {
        observer.error(error);
      })
    })
  }

  /**
   *
   * @param trackedEntityInstances
   * @param currentUser
   * @param status
   * @returns {Observable<any>}
   */
  updateSavedTrackedEntityInstancesByStatus(trackedEntityInstances, currentUser, status?): Observable<any> {
    return new Observable(observer => {
      trackedEntityInstances.forEach((trackedEntityInstance: any) => {
        delete trackedEntityInstance.attributes;
        if (status) {
          trackedEntityInstance.syncStatus = status;
        }
      });
      this.sqlLite.insertBulkDataOnTable(this.resource, trackedEntityInstances, currentUser.currentDatabase).subscribe(() => {
        observer.next();
        observer.complete();
      }, (error) => {
        observer.error(error);
      });
    });
  }


}
