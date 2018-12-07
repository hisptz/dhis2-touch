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
import { EnrollmentsProvider } from '../enrollments/enrollments';
import { TrackedEntityAttributeValuesProvider } from '../tracked-entity-attribute-values/tracked-entity-attribute-values';
import { TrackedEntityInstancesProvider } from '../tracked-entity-instances/tracked-entity-instances';
import { SqlLiteProvider } from '../sql-lite/sql-lite';
import { HttpClientProvider } from '../http-client/http-client';
import { Observable } from 'rxjs/Observable';
import { CurrentUser } from '../../models';
import { EventCaptureFormProvider } from '../event-capture-form/event-capture-form';
import * as _ from 'lodash';

@Injectable()
export class TrackerCaptureSyncProvider {
  constructor(
    private enrollmentsProvider: EnrollmentsProvider,
    private sqlLite: SqlLiteProvider,
    private trackedEntityInstancesProvider: TrackedEntityInstancesProvider,
    private trackedEntityAttributeValuesProvider: TrackedEntityAttributeValuesProvider,
    private eventCaptureFormProvider: EventCaptureFormProvider,
    private httpClientProvider: HttpClientProvider
  ) {}

  discoveringTrackerDataFromServer(
    eventType: string,
    organisationUnitId: string,
    orgUnitName: string,
    programId: string,
    programName: string,
    currentUser: CurrentUser
  ): Observable<any> {
    return new Observable(observer => {
      const syncStatus = 'synced';
      this.discoveringTrackedEntityInstancesFromServer(
        organisationUnitId,
        orgUnitName,
        programId,
        syncStatus,
        currentUser
      ).subscribe(
        trackedEntityInstances => {
          this.discoveringEnrollmentsFromServer(
            organisationUnitId,
            programId,
            currentUser
          ).subscribe(
            enrollments => {
              this.discoveringEventsForTrackerFromServer(
                organisationUnitId,
                programId,
                currentUser
              ).subscribe(
                events => {
                  observer.next({
                    trackedEntityInstances: [],
                    enrollments,
                    events
                  });
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
        },
        error => {
          console.log(JSON.stringify({ error }));
        }
      );
    });
  }

  discoveringTrackedEntityInstancesFromServer(
    organisationUnitId: string,
    orgUnitName: string,
    programId: string,
    syncStatus: string,
    currentUser: CurrentUser
  ): Observable<any> {
    const url = `/api/trackedEntityInstances.json?ou=${organisationUnitId}&program=${programId}&pageSize=50&order=lastUpdated:desc`;
    return new Observable(observer => {
      this.httpClientProvider.get(url, true, currentUser).subscribe(
        trackedEntityInstancesResponse => {
          const trackedEntityInstances = _.map(
            trackedEntityInstancesResponse.trackedEntityInstances,
            trackedEntityInstanceObj => {
              const id = trackedEntityInstanceObj.trackedEntityInstance;
              const attributes = _.map(
                trackedEntityInstanceObj.attributes,
                attributeObj => {
                  const { value, attribute } = attributeObj;
                  return { ...{}, trackedEntityInstance: id, value, attribute };
                }
              );
              delete trackedEntityInstanceObj.attributes;
              return {
                ...trackedEntityInstanceObj,
                orgUnitName,
                syncStatus,
                id,
                attributes
              };
            }
          );
          observer.next(trackedEntityInstances);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  discoveringEnrollmentsFromServer(
    organisationUnitId: string,
    programId: string,
    currentUser: CurrentUser
  ): Observable<any> {
    const url = `/api/enrollments.json?ou=${organisationUnitId}&program=${programId}&paging=false`;
    return new Observable(observer => {
      this.httpClientProvider.get(url, true, currentUser).subscribe(
        enrollmentResponse => {
          const enrollments = _.map(
            enrollmentResponse.enrollments,
            enrollmentObj => {
              const { enrollment } = enrollmentObj;
              return { ...{}, enrollment };
            }
          );
          observer.next(enrollments);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  discoveringEventsForTrackerFromServer(
    organisationUnitId: string,
    programId: string,
    currentUser: CurrentUser
  ): Observable<any> {
    const url = `/events.json?program=${programId}&orgUnit=${organisationUnitId}&paging=false`;
    return new Observable(observer => {
      this.httpClientProvider.get(url, true, currentUser).subscribe(
        eventReponse => {
          const events = _.map(eventReponse.events, eventObj => {
            const { event } = eventObj;
            return { ...{}, event };
          });
          observer.next(events);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }
}
