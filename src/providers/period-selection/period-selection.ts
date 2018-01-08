import { Injectable } from '@angular/core';

/*
  Generated class for the PeriodSelectionProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
declare var dhis2;

@Injectable()
export class PeriodSelectionProvider {

  lastSelectedPeriod : any;

  constructor() {
  }

  /**
   *
   */
  resetPeriod(){
    this.lastSelectedPeriod = null;
  }

  /**
   *
   * @param period
   */
  setLastSelectedPeriod(period){
    this.lastSelectedPeriod = period;
  }

  /**
   *
   * @returns {any}
   */
  getLastSelectedPeriod(){
    return this.lastSelectedPeriod;
  }

  /**
   *
   * @param periodType
   * @param openFuturePeriods
   * @param currentPeriodOffset
   * @returns {any}
   */
  getPeriods(periodType,openFuturePeriods,currentPeriodOffset){
    let periodSelection = [];

    let periods = dhis2.period.generator.generateReversedPeriods(periodType, currentPeriodOffset);
    periods = dhis2.period.generator.filterOpenPeriods(periodType, periods, openFuturePeriods);
    periods.forEach((period : any)=>{
      periodSelection.push({
        name : period.name,
        startDate : period.startDate,
        endDate : period.endDate,
        iso : period.iso
      })
    });
    return periodSelection;
  }



}
