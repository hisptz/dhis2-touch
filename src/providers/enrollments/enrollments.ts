import { Injectable } from '@angular/core';
import { SqlLiteProvider } from '../sql-lite/sql-lite';
import { Observable } from 'rxjs/Observable';

declare var dhis2: any;

/*
  Generated class for the EnrollmentsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class EnrollmentsProvider {
  resource: string;

  constructor(private sqlLite: SqlLiteProvider) {
    this.resource = 'enrollments';
  }

  /**
   *
   * @param trackedEntityId
   * @param orgUnitId
   * @param orgUnitName
   * @param programId
   * @param enrollmentDate
   * @param incidentDate
   * @param trackedEntityInstance
   * @param syncStatus
   * @param enrollment
   * @returns {Array}
   */
  getEnrollmentsPayLoad(
    trackedEntityId,
    orgUnitId,
    orgUnitName,
    programId,
    enrollmentDate,
    incidentDate,
    trackedEntityInstance,
    syncStatus,
    enrollment?
  ) {
    if (!enrollment) {
      enrollment = dhis2.util.uid();
    }
    const payLoad = {
      id: enrollment,
      trackedEntity: trackedEntityId,
      coordinate: {
        latitude: '0',
        longitude: '0'
      },
      orgUnit: orgUnitId,
      program: programId,
      trackedEntityInstance: trackedEntityInstance,
      enrollment: enrollment,
      orgUnitName: orgUnitName,
      enrollmentDate: enrollmentDate,
      incidentDate: incidentDate,
      status: 'ACTIVE',
      attributes: [],
      events: [],
      syncStatus: syncStatus
    };
    const payLoads = [];
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
  getSavedEnrollmentsByAttribute(
    attribute: string,
    attributeArray: Array<string>,
    currentUser
  ): Observable<any> {
    return new Observable(observer => {
      this.sqlLite
        .getDataFromTableByAttributes(
          this.resource,
          attribute,
          attributeArray,
          currentUser.currentDatabase
        )
        .subscribe(
          (enrollments: any) => {
            observer.next(enrollments);
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
   * @param orgUnitId
   * @param programId
   * @param currentUser
   * @returns {Observable<any>}
   */
  getSavedEnrollments(orgUnitId, programId, currentUser): Observable<any> {
    let enrollments = [];
    return new Observable(observer => {
      this.sqlLite
        .getDataFromTableByAttributes(
          this.resource,
          'orgUnit',
          [orgUnitId],
          currentUser.currentDatabase
        )
        .subscribe(
          (enrollmentResponse: any) => {
            if (enrollmentResponse && enrollmentResponse.length > 0) {
              enrollmentResponse.map((enrollment: any) => {
                if (enrollment.program == programId) {
                  enrollments.push(enrollment);
                }
              });
            }
            observer.next(enrollments);
            observer.complete();
          },
          error => {
            observer.error({ message: error });
          }
        );
    });
  }

  /**
   *
   * @param enrollments
   * @param currentUser
   * @param status
   * @returns {Observable<any>}
   */
  updateEnrollmentsByStatus(
    enrollments,
    currentUser,
    status?
  ): Observable<any> {
    return new Observable(observer => {
      enrollments.forEach((enrollment: any) => {
        if (status) {
          enrollment.syncStatus = status;
        }
      });
      this.sqlLite
        .insertBulkDataOnTable(
          this.resource,
          enrollments,
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
}
