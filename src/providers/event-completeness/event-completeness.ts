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
  /**
   * @param  {OfflineCompletenessProvider} offlineCompletenessProvider
   */
  constructor(
    private offlineCompletenessProvider: OfflineCompletenessProvider
  ) {}

  /**
   * @param  {any[]} events
   * @param  {string='not-sync'} status
   * @param  {CurrentUser} currentUser
   * @returns Observable
   */
  savingEventsCompletenessData(
    events: any[],
    status: string = 'not-sync',
    currentUser: CurrentUser
  ): Observable<any> {
    return new Observable(observer => {
      this.discoverAndUpdateEventsCompletenessInfo(events, status, currentUser)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  async discoverAndUpdateEventsCompletenessInfo(
    events: any[],
    status: string = 'not-sync',
    currentUser: CurrentUser
  ) {
    // @TODO handling preference on data btn device and online server
    const unCompletedEventIds = this.getUncompletedEventIds(events);
    const type = 'event';
    const completedEvents = this.getCompletedEvents(events);
    let offlineData = [];
    try {
      offlineData = await this.offlineCompletenessProvider
        .getOfflineCompletenessesByType(type, currentUser)
        .toPromise();
    } catch (error) {}
    const ids = _.map(offlineData, (data: any) => data.id);
    const completesssData = _.filter(
      this.getEventCompletenesstData(completedEvents, status),
      (dataObj: any) => _.indexOf(ids, dataObj.id) === -1
    );
    await this.offlineCompletenessProvider.savingOfflineCompleteness(
      completesssData,
      currentUser
    );
    console.log({
      unCompletedEventIds
    });
    // await this.offlineCompletenessProvider.offlineEventUncompleteness(unCompletedEventIds, currentUser)
  }

  /**
   * @param  {any[]} events
   * @param  {string} status
   * @returns any
   */
  getEventCompletenesstData(events: any[], status: string): any[] {
    const isDeleted = false;
    const type = 'event';
    return _.map(events, event => {
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
    });
  }

  getCompletedEvents(events: any[]) {
    const status = 'COMPLETED';
    return _.filter(events, event => {
      return event && event.status && event.status === status;
    });
  }

  /**
   * @param  {any[]} events
   * @returns string
   */
  getUncompletedEventIds(events: any[]): string[] {
    return _.map(
      _.filter(events, event => {
        const status = 'COMPLETED';
        return event && event.status && event.status !== status;
      }),
      event => event.event
    );
  }
}
