import { Injectable } from '@angular/core';

declare var dhis2;

/*
  Generated class for the PeriodService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PeriodService {

  public lastSelectedPeriod : any;

  constructor() {
  }

  resetPeriod(){
    this.lastSelectedPeriod = null;
  }

  setLastSelectedPeriod(period){
    this.lastSelectedPeriod = period;
  }

  getLastSelectedPeriod(){
    return this.lastSelectedPeriod;
  }

  /**
   *
   * @param selectedDataSet
   * @param currentPeriodOffset
   * @returns {any}
     */
  getPeriods(selectedDataSet,currentPeriodOffset){
    let periodType = selectedDataSet.periodType;
    let openFuturePeriods = parseInt(selectedDataSet.openFuturePeriods);
    let periods = dhis2.period.generator.generateReversedPeriods(periodType, currentPeriodOffset);
    periods = dhis2.period.generator.filterOpenPeriods(periodType, periods, openFuturePeriods);
    return periods;
  }

}
