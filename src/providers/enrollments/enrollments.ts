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
import { CurrentUser } from '../../models/current-user';
import * as _ from 'lodash';

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
    enrollment?,
    status?: string
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
      status: status ? status : 'ACTIVE',
      attributes: [],
      events: [],
      syncStatus: syncStatus
    };
    const payLoads = [];
    payLoads.push(payLoad);
    return payLoads;
  }

  getActiveEnrollment(
    trackedEntityInstance: string,
    currentProgramId: string,
    currentUser: CurrentUser
  ) {
    return new Observable(observer => {
      this.sqlLite
        .getDataFromTableByAttributes(
          this.resource,
          'trackedEntityInstance',
          [trackedEntityInstance],
          currentUser.currentDatabase
        )
        .subscribe(
          (enrollments: any) => {
            let matchedEnrollments: any = _.filter(enrollments, {
              program: currentProgramId
            });
            const matchedEnrollment =
              matchedEnrollments && matchedEnrollments.length > 0
                ? matchedEnrollments[0]
                : {};
            observer.next(matchedEnrollment);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  updateEnrollement(
    trackedEntityInstance,
    incidentDate,
    enrollmentDate,
    coorinates,
    currentProgramId,
    currentOrganisationUnitId,
    currentUser: CurrentUser
  ): Observable<any> {
    const syncStatus = 'not-synced';
    return new Observable(observer => {
      this.getSavedEnrollments(
        currentOrganisationUnitId,
        currentProgramId,
        currentUser
      ).subscribe(
        (enrollments: any) => {
          let matchedEnrollments: any = _.filter(enrollments, {
            trackedEntityInstance: trackedEntityInstance
          });
          matchedEnrollments.forEach((matchedEnrollment: any) => {
            matchedEnrollments.syncStatus = syncStatus;
            matchedEnrollment.coordinate = coorinates;
            matchedEnrollment.enrollmentDate = enrollmentDate;
            matchedEnrollment.incidentDate = incidentDate;
          });
          if (matchedEnrollments && matchedEnrollments.length > 0) {
            this.updateEnrollmentsByStatus(
              matchedEnrollments,
              currentUser
            ).subscribe(
              () => {
                observer.next();
                observer.complete();
              },
              error => {
                observer.error(error);
              }
            );
          } else {
            observer.error();
          }
        },
        error => {
          observer.error(error);
        }
      );
    });
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
              enrollments = _.filter(enrollmentResponse, enrollment => {
                return enrollment.program === programId;
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
