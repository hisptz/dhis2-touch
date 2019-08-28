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
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { CurrentUser } from '../../models';
import { OfflineCompletenessProvider } from '../offline-completeness/offline-completeness';

@Injectable()
export class EventCompletenessProvider {
  constructor(private offlineCompleteness: OfflineCompletenessProvider) {}

  savingEventsCompletenessData(
    events: any[],
    status: string = 'not-sync',
    currentUser: CurrentUser
  ): Observable<any> {
    const isDeleted = false;
    const type = 'event';
    const data = _.map(
      _.filter(events, event => {
        const status = 'COMPLETED';
        return event && event.status && event.status === status;
      }),
      event => {
        const { completedDate, completedBy } = event;
        return {
          id: event.event,
          eventId: event.id,
          status,
          type,
          completedBy,
          isDeleted,
          completedDate: completedDate.split('T')[0]
        };
      }
    );
    return new Observable(observer => {
      this.offlineCompleteness
        .savingOfflineCompleteness(data, currentUser)
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
