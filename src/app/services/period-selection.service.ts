/*
 *
 * Copyright 2019 HISP Tanzania
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
 * @since 2019
 * @author Joseph Chingalo <profschingalo@gmail.com>
 */
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

declare var dhis2;

@Injectable({
  providedIn: 'root'
})
export class PeriodSelectionService {
  constructor() {}

  async intiateCalendarInstance(calendarId: string) {
    try {
      dhis2.period.initiateCalendar(calendarId);
    } catch (error) {
      const message = `Error on initiate calendar : ${JSON.stringify(error)}`;
      console.log(message);
    }
  }

  async getPeriodsList(
    periodType: string,
    openFuturePeriods: number,
    currentPeriodOffset: number
  ) {
    let periods = dhis2.period.generator.generateReversedPeriods(
      periodType,
      currentPeriodOffset
    );
    periods = dhis2.period.generator.filterOpenPeriods(
      periodType,
      periods,
      openFuturePeriods
    );
    return _.map(periods, (period: any) => {
      const { id, name, iso, startDate, endDate } = period;
      return { id, name, iso, startDate, endDate };
    });
  }
}
