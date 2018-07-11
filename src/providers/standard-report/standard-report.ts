import {Injectable} from '@angular/core';
import {HttpClientProvider} from "../http-client/http-client";
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {Observable} from "rxjs/Observable";


/*
  Generated class for the StandardReportProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class StandardReportProvider {

  resource: string;

  constructor(private HttpClient: HttpClientProvider, private SqlLite: SqlLiteProvider) {
    this.resource = "reports";
  }

  /**
   *
   * @param currentUser
   * @returns {Observable<any>}
   */
  downloadReportsFromServer(currentUser): Observable<any> {
    let fields = "id,name,created,type,relativePeriods,reportParams,designContent";
    let filter = "type:eq:HTML&filter=designContent:ilike:cordova";
    let url = "/api/25/" + this.resource + ".json?paging=false&fields=" + fields;
    url += "&filter=" + filter;
    return new Observable(observer => {
      this.HttpClient.get(url, true, currentUser).subscribe((response: any) => {
        observer.next(response);
        observer.complete();
      }, error => {
        observer.error(error);
      });
    });
  }

  /**
   *
   * @param currentUser
   * @returns {Observable<any>}
   */
  downloadConstantsFromServer(currentUser): Observable<any> {
    let fields = "id,name,value";
    let resource = "constants";
    let url = "/api/25/" + resource + ".json?paging=false&fields=" + fields;
    return new Observable(observer => {
      this.HttpClient.get(url, true, currentUser).subscribe((response: any) => {
        observer.next(response.constants);
        observer.complete();
      }, error => {
        observer.error(error);
      });
    });
  }

  /**
   *
   * @param constants
   * @param currentUser
   * @returns {Observable<any>}
   */
  saveConstantsFromServer(constants, currentUser): Observable<any> {
    let resource = "constants";
    return new Observable(observer => {
      if (constants.length == 0) {
        observer.next();
        observer.complete();
      } else {
        this.SqlLite.insertBulkDataOnTable(resource, constants, currentUser.currentDatabase).subscribe(() => {
          observer.next();
          observer.complete();
        }, error => {
          observer.error(error);
        });
      }
    });
  }

  /**
   *
   * @param reports
   * @param currentUser
   * @returns {Observable<any>}
   */
  saveReportsFromServer(reports, currentUser): Observable<any> {
    return new Observable(observer => {
      if (reports.length == 0) {
        observer.next();
        observer.complete();
      } else {
        this.SqlLite.insertBulkDataOnTable(this.resource, reports, currentUser.currentDatabase).subscribe(() => {
          this.savingReportDesign(reports, currentUser).subscribe(() => {
            observer.next();
            observer.complete();
          }, error => {
            observer.error(error);
          });
        }, error => {
          observer.error(error);
        });
      }
    });
  }

  /**
   *
   * @param reports
   * @param currentUser
   * @returns {Observable<any>}
   */
  savingReportDesign(reports, currentUser): Observable<any> {
    let resource = 'reportDesign';
    let reportDesigns = [];
    reports.forEach((report: any) => {
      reportDesigns.push(
        {id: report.id, designContent: report.designContent}
      )
    });
    return new Observable(observer => {
      this.SqlLite.insertBulkDataOnTable(resource, reports, currentUser.currentDatabase).subscribe(() => {
        observer.next();
        observer.complete();
      }, error => {
        observer.error(error);
      });
    });
  }

  /**
   *
   * @param currentUser
   * @returns {Promise<any>}
   */
  getReportList(currentUser): Observable<any> {
    return new Observable(observer => {
      let dataSetsReportResourceName = "dataSets";
      let reportParams = {
        paramGrandParentOrganisationUnit: false,
        paramReportingPeriod: true,
        paramOrganisationUnit: true,
        paramParentOrganisationUnit: false
      };
      let reportList = [];
      this.SqlLite.getAllDataFromTable(this.resource, currentUser.currentDatabase).subscribe((reports: any) => {
        reports.forEach((report: any) => {
          report.type = "standardReport";
          report.openFuturePeriods = 1;
          reportList.push(report);
        });
        this.SqlLite.getAllDataFromTable(dataSetsReportResourceName, currentUser.currentDatabase).subscribe((dataSets: any) => {
          dataSets.forEach((dataSet: any) => {
            reportList.push({
              id: dataSet.id, name: dataSet.name, reportParams: reportParams,
              type: "dataSetReport",
              openFuturePeriods: dataSet.openFuturePeriods,
              relativePeriods: {dataSetPeriodType: dataSet.periodType}
            });
          });
          reportList = this.getSortedReports(reportList);
          observer.next(reportList);
          observer.complete();
        }, error => {
          reportList = this.getSortedReports(reportList);
          observer.next(reportList);
          observer.complete();
        });
      }, error => {
        observer.next(error);
        observer.complete();
      });
    })
  }

  /**
   *
   * @param reports
   * @returns {any}
   */
  getSortedReports(reports) {
    reports.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
    return reports;
  }

  /**
   *
   * @param reportParams
   * @returns {boolean}
   */
  hasReportRequireParameterSelection(reportParams) {
    let requireReportParameter = false;
    if (reportParams.paramReportingPeriod || reportParams.paramOrganisationUnit) {
      requireReportParameter = true;
    }
    return requireReportParameter;
  }

  /**
   *
   * @param reportId
   * @param currentUser
   * @returns {Observable<any>}
   */
  getReportId(reportId, currentUser): Observable<any> {
    let attribute = "id";
    let attributeArray = [];
    attributeArray.push(reportId);
    return new Observable(observer => {
      this.SqlLite.getDataFromTableByAttributes(this.resource, attribute, attributeArray, currentUser.currentDatabase).subscribe((reports: any) => {
        observer.next(reports[0]);
        observer.complete();
      }, error => {
        observer.error(error);
      })
    })
  }

  /**
   *
   * @param reportId
   * @param currentUser
   * @returns {Observable<any>}
   */
  getReportDesign(reportId, currentUser): Observable<any> {
    let attribute = "id";
    let resource = "reportDesign";
    let attributeArray = [];
    attributeArray.push(reportId);
    return new Observable(observer => {
      this.SqlLite.getDataFromTableByAttributes(resource, attribute, attributeArray, currentUser.currentDatabase).subscribe((response: any) => {
        observer.next(response[0]);
        observer.complete();
      }, error => {
        observer.error(error);
      })
    })
  }

  /**
   *
   * @param relativePeriods
   * @returns {string}
   */
  getReportPeriodType(relativePeriods) {
    let reportPeriodType = "Yearly";
    let reportPeriods = [];

    if (relativePeriods.dataSetPeriodType) {
      reportPeriods.push(relativePeriods.dataSetPeriodType)
    }

    if (relativePeriods.last14Days || relativePeriods.yesterday || relativePeriods.thisDay || relativePeriods.last3Days || relativePeriods.last7Days) {
      reportPeriods.push("Daily");
    }
    if (relativePeriods.last52Weeks || relativePeriods.last12Weeks || relativePeriods.lastWeek || relativePeriods.thisWeek || relativePeriods.last4Weeks || relativePeriods.weeksThisYear) {
      reportPeriods.push("Weekly");
    }
    if (relativePeriods.lastSixMonth || relativePeriods.lastMonth || relativePeriods.monthsThisYear || relativePeriods.monthsLastYear || relativePeriods.last6Months || relativePeriods.thisMonth || relativePeriods.last2SixMonths || relativePeriods.last3Months || relativePeriods.last12Months || relativePeriods.thisSixMonth) {
      reportPeriods.push("Monthly");
    }
    if (relativePeriods.biMonthsThisYear || relativePeriods.lastBimonth || relativePeriods.last6BiMonths || relativePeriods.thisBimonth) {
      reportPeriods.push("BiMonthly")
    }
    if (relativePeriods.quartersLastYear || relativePeriods.last4Quarters || relativePeriods.quartersThisYear || relativePeriods.thisQuarter || relativePeriods.lastQuarter) {
      reportPeriods.push("Quarterly")
    }
    if (relativePeriods.lastYear || relativePeriods.last5Years || relativePeriods.thisYear) {
      reportPeriods.push("Yearly")
    }
    //@todo checking preference on relative periods
    if (reportPeriods.length > 0) {
      reportPeriodType = reportPeriods[0];
    }
    return reportPeriodType;
  }


}
