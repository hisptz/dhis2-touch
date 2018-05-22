import {Injectable} from '@angular/core';

@Injectable()
export class PeriodService {

  constructor() {
  }

  getPeriodsBasedOnType(periodType: string, year: number): any[] {
    switch (periodType) {
      case 'Monthly':
        return this._getMonthlyPeriods(year);
      case 'BiMonthly':
        return this._getBiMonthlyPeriods(year);
      case 'Quarterly':
        return this._getQuarterlyPeriods(year);
      case 'SixMonthly':
        return this._getSixMonthlyPeriods(year);
      case 'SixMonthlyApril':
        return this._getSixMonthlyAprilPeriods(year);
      case 'FinancialOct':
        return this._getFinancialOctoberPeriods(year);
      case 'Yearly':
        return this._getYearlyPeriods(year);
      case 'FinancialJuly':
        return this._getFinancialJulyPeriods(year);
      case 'FinancialApril':
        return this._getFinancialAprilPeriods(year);
      case 'RelativeWeek':
        return this._getRelativeWeekPeriods();
      case 'RelativeMonth':
        return this._getRelativeMonthPeriods();
      case 'RelativeBiMonth':
        return this._getRelativeBiMonthPeriods();
      case 'RelativeQuarter':
        return this._getRelativeQuarterPeriods();
      case 'RelativeSixMonthly':
        return this._getRelativeSixMonthPeriods();
      case 'RelativeFinancialYear':
        return this._getRelativeFinancialYearPeriods();
      case 'RelativeYear':
        return this._getRelativeYearPeriods();
      default:
        return [];
    }
  }

  private _getMonthlyPeriods(year) {
    const periods = [{id: year + '12', name: 'December ' + year}, {id: year + '11', name: 'November ' + year}, {
      id: year + '10',
      name: 'October ' + year
    }, {id: year + '09', name: 'September ' + year}, {id: year + '08', name: 'August ' + year}, {
      id: year + '07',
      name: 'July ' + year
    }, {id: year + '06', name: 'June ' + year}, {id: year + '05', name: 'May ' + year}, {
      id: year + '04',
      name: 'April ' + year
    }, {id: year + '03', name: 'March ' + year}, {id: year + '02', name: 'February ' + year}, {
      id: year + '01',
      name: 'January ' + year
    }];

    return periods.map((period: any) => {
      period.type = 'Monthly';
      return period;
    });
  }

  private _getBiMonthlyPeriods(year) {
    const periods = [{id: year + '01B', name: 'January - February ' + year}, {
      id: year + '02B',
      name: 'March - April ' + year
    }, {id: year + '03B', name: 'May - June ' + year}, {
      id: year + '04B',
      name: 'July - August ' + year
    }, {id: year + '05B', name: 'September - October ' + year}, {
      id: year + '06B',
      name: 'November - December ' + year
    }];

    return periods.map((period: any) => {
      period.type = 'BiMonthly';
      return period;
    });
  }

  private _getQuarterlyPeriods(year) {
    const periods = [{id: year + 'Q4', name: 'October - December ' + year}, {
      id: year + 'Q3',
      name: 'July - September ' + year
    }, {id: year + 'Q2', name: 'April - June ' + year}, {
      id: year + 'Q1',
      name: 'January - March ' + year
    }];

    return periods.map((period: any) => {
      period.type = 'Quarterly';
      return period;
    });
  }

  private _getSixMonthlyPeriods(year) {
    const periods = [{id: year + 'S1', name: 'January - June ' + year}, {
      id: year + 'S2',
      name: 'July - December ' + year
    }];

    return periods.map((period: any) => {
      period.type = 'SixMonthly';
      return period;
    });
  }

  private _getSixMonthlyAprilPeriods(year) {
    const useYear = parseInt(year, 10) + 1;
    const periods = [{
      id: year + 'AprilS2',
      name: 'October ' + year + ' - March ' + useYear,
      selected: true
    }, {id: year + 'AprilS1', name: 'April - September ' + year}];

    return periods.map((period: any) => {
      period.type = 'SixMonthly';
      return period;
    });

  }

  private _getFinancialOctoberPeriods(year) {
    const periods = [];
    for (let i = 0; i <= 10; i++) {
      const useYear = parseInt(year, 10) - i;
      const currentYear = useYear + 1;
      periods.push({id: useYear + 'Oct', name: 'October ' + useYear + ' - September ' + currentYear});
    }

    return periods.map((period: any) => {
      period.type = 'FinancialOctober';
      return period;
    });
  }

  private _getFinancialJulyPeriods(year) {
    const periods = [];
    for (let i = 0; i <= 10; i++) {
      const useYear = parseInt(year, 10) - i;
      const currentYear = useYear + 1;
      periods.push({id: useYear + 'July', name: 'July ' + useYear + ' - June ' + currentYear});
    }
    return periods.map((period: any) => {
      period.type = 'FinancialJuly';
      return period;
    });
  }

  private _getFinancialAprilPeriods(year) {
    const periods = [];
    for (let i = 0; i <= 10; i++) {
      const useYear = parseInt(year, 10) - i;
      const currentYear = useYear + 1;
      periods.push({id: useYear + 'April', name: 'April ' + useYear + ' - March ' + currentYear});
    }

    return periods.map((period: any) => {
      period.type = 'FinancialApril';
      return period;
    });
  }

  private _getYearlyPeriods(year) {
    const periods = [];
    for (let i = 0; i <= 10; i++) {
      const useYear = parseInt(year, 10) - i;
      periods.push({id: useYear, name: useYear});
    }

    return periods.map((period: any) => {
      period.type = 'Yearly';
      return period;
    });
  }

  private _getRelativeWeekPeriods() {
    const periods = [{id: 'THIS_WEEK', name: 'This Week'}, {id: 'LAST_WEEK', name: 'Last Week'}, {
      id: 'LAST_4_WEEKS',
      name: 'Last 4 Weeks'
    }, {id: 'LAST_12_WEEKS', name: 'last 12 Weeks'}, {id: 'LAST_52_WEEKS', name: 'Last 52 weeks'}];

    return periods.map((period: any) => {
      period.type = 'RelativeWeek';
      return period;
    });
  }

  private _getRelativeMonthPeriods() {
    const periods = [{id: 'THIS_MONTH', name: 'This Month'}, {id: 'LAST_MONTH', name: 'Last Month'}, {
      id: 'LAST_3_MONTHS',
      name: 'Last 3 Months'
    }, {id: 'LAST_6_MONTHS', name: 'Last 6 Months'}, {id: 'LAST_12_MONTHS', name: 'Last 12 Months'}];

    return periods.map((period: any) => {
      period.type = 'RelativeMonth';
      return period;
    });
  }

  private _getRelativeBiMonthPeriods() {
    const periods = [{id: 'THIS_BIMONTH', name: 'This Bi-month'}, {
      id: 'LAST_BIMONTH',
      name: 'Last Bi-month'
    }, {id: 'LAST_6_BIMONTHS', name: 'Last 6 bi-month'}];

    return periods.map((period: any) => {
      period.type = 'RelativeBiMonth';
      return period;
    });
  }

  private _getRelativeQuarterPeriods() {
    const periods = [{id: 'THIS_QUARTER', name: 'This Quarter'}, {
      id: 'LAST_QUARTER',
      name: 'Last Quarter'
    }, {id: 'LAST_4_QUARTERS', name: 'Last 4 Quarters'}];

    return periods.map((period: any) => {
      period.type = 'RelativeQuarter';
      return period;
    });
  }

  private _getRelativeSixMonthPeriods() {
    const periods = [{id: 'THIS_SIX_MONTH', name: 'This Six-month'}, {
      id: 'LAST_SIX_MONTH',
      name: 'Last Six-month'
    }, {id: 'LAST_2_SIXMONTHS', name: 'Last 2 Six-month', selected: true}];

    return periods.map((period: any) => {
      period.type = 'RelativeSixMonth';
      return period;
    });

  }

  private _getRelativeFinancialYearPeriods() {
    const periods = [{id: 'THIS_FINANCIAL_YEAR', name: 'This Financial Year'}, {
      id: 'LAST_FINANCIAL_YEAR',
      name: 'Last Financial Year'
    }, {id: 'LAST_5_FINANCIAL_YEARS', name: 'Last 5 Financial Years'}];

    return periods.map((period: any) => {
      period.type = 'RelativeFinancialYear';
      return period;
    });
  }

  private _getRelativeYearPeriods() {
    const periods = [{id: 'THIS_YEAR', name: 'This Year'}, {
      id: 'LAST_YEAR',
      name: 'Last Year'
    }, {id: 'LAST_5_YEARS', name: 'Last 5 Years'}];

    return periods.map((period: any) => {
      period.type = 'RelativeYear';
      return period;
    });

  }
}
