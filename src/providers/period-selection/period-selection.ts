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

/*
  Generated class for the PeriodSelectionProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
declare var dhis2;

@Injectable()
export class PeriodSelectionProvider {
  lastSelectedPeriod: any;

  constructor() {}

  /**
   *
   */
  resetPeriod() {
    this.lastSelectedPeriod = null;
  }

  /**
   *
   * @param period
   */
  setLastSelectedPeriod(period) {
    this.lastSelectedPeriod = period;
  }

  /**
   *
   * @returns {any}
   */
  getLastSelectedPeriod() {
    return this.lastSelectedPeriod;
  }

  /**
   *
   * @param periodType
   * @param openFuturePeriods
   * @param currentPeriodOffset
   * @returns {any}
   */
  getPeriods(periodType, openFuturePeriods, currentPeriodOffset) {
    let periodSelection = [];
    let periods = dhis2.period.generator.generateReversedPeriods(
      periodType,
      currentPeriodOffset
    );
    periods = dhis2.period.generator.filterOpenPeriods(
      periodType,
      periods,
      openFuturePeriods
    );
    periods.map((period: any) => {
      periodSelection.push({
        name: period.name,
        startDate: period.startDate,
        endDate: period.endDate,
        iso: period.iso
      });
    });
    return periodSelection;
  }
}
