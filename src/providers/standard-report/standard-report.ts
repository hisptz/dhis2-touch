import { Injectable } from '@angular/core';
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

  resource : string;
  reportPeriods:any;
  periodTypeSelected: any;

  constructor(private HttpClient : HttpClientProvider,private SqlLite : SqlLiteProvider) {
    this.resource = "reports";
  }

  /**
   *
   * @param currentUser
   * @returns {Promise<any>}
   */
  downloadReportsFromServer(currentUser){
    let fields = "id,name,created,type,relativePeriods,reportParams,designContent";
    let filter = "type:eq:HTML&filter=designContent:ilike:cordova";
    let url = "/api/25/"+this.resource+".json?paging=false&fields=" + fields;
    url += "&filter=" + filter;
    return new Promise((resolve, reject)=> {
      this.HttpClient.get(url,currentUser).then((response : any)=>{
        response = JSON.parse(response.data);
        resolve(response);
      },error=>{
        reject(error);
      });
    });
  }

  /**
   *
   * @param currentUser
   * @returns {Promise<any>}
   */
  downloadConstantsFromServer(currentUser){
    let fields = "id,name,value";
    let resource = "constants";
    let url = "/api/25/"+resource+".json?paging=false&fields=" + fields;
    return new Promise((resolve, reject)=> {
      this.HttpClient.get(url,currentUser).then((response : any)=>{
        response = JSON.parse(response.data);
        resolve(response.constants);
      },error=>{
        reject(error);
      });
    });
  }

  /**
   *
   * @param reports
   * @param currentUser
   * @returns {Promise<any>}
   */
  saveConstantsFromServer(reports,currentUser){
    let resource = "constants";
    return new Promise((resolve, reject)=> {
      if(reports.length == 0){
        resolve();
      }else{
        this.SqlLite.insertBulkDataOnTable(resource,reports,currentUser.currentDatabase).then(()=>{
          resolve();
        },error=>{
          console.log(JSON.stringify(error));
          reject(error);
        });
      }
    });
  }

  /**
   *
   * @param reports
   * @param currentUser
   * @returns {Promise<any>}
   */
  saveReportsFromServer(reports,currentUser){
    return new Promise((resolve, reject)=> {
      if(reports.length == 0){
        resolve();
      }else{
        this.SqlLite.insertBulkDataOnTable(this.resource,reports,currentUser.currentDatabase).then(()=>{
          this.savingReportDesign(reports,currentUser).then(()=>{
            resolve();
          },error=>{
            reject(error);
          });
        },error=>{
          reject(error);
        });
      }
    });
  }

  /**
   *
   * @param reports
   * @param currentUser
   * @returns {Promise<any>}
   */
  savingReportDesign(reports,currentUser){
    let resource = 'reportDesign';
    let reportDesigns = [];
    reports.forEach((report : any)=>{
      reportDesigns.push(
        {id : report.id,designContent : report.designContent}
      )
    });
    return new Promise((resolve, reject)=> {
      this.SqlLite.insertBulkDataOnTable(resource,reports,currentUser.currentDatabase).then(()=>{
        resolve();
      },error=>{
        console.log(JSON.stringify(error));
        reject(error);
      });
    });
  }

  getReportList(currentUser){
    return new Promise((resolve, reject)=> {
      this.SqlLite.getAllDataFromTable(this.resource,currentUser.currentDatabase).then((reportList)=>{
        resolve(reportList);
      },error=>{
        reject(error);
      });
    })
  }

  hasReportRequireParameterSelection(reportParams){
    let requireReportParameter = false;
    if(reportParams.paramReportingPeriod || reportParams.paramOrganisationUnit){
      requireReportParameter = true;
    }
    return requireReportParameter;
  }

  getReportId(reportId,currentUser){
    let attribute = "id";
    let attributeArray = [];
    attributeArray.push(reportId);
    return new Promise((resolve, reject)=> {
      this.SqlLite.getDataFromTableByAttributes(this.resource,attribute,attributeArray,currentUser.currentDatabase).then((reportList:any)=>{
        resolve(reportList[0]);
      },error=>{
        reject(error);
      })
    })
  }

  fetchReportsRelativePeriodsfromServer(reportId, currentUser){
    let fields = "relativePeriods";
    let url = "/api/25/"+this.resource+"/"+reportId+".json?paging=false&fields=" + fields;

    return new Promise((resolve, reject)=> {
      this.HttpClient.get(url,currentUser).then((response : any)=>{
        response = JSON.parse(response.data);
        resolve(response);
      },error=>{
        reject(error);
      });
    });
  }

  fetchReportsRelativePeriods(reportPeriods){
    let periodType  = [];
    this.reportPeriods = reportPeriods;

    if(this.reportPeriods.thisYear){
      periodType.push('This yeear');

    } if(this.reportPeriods.quartersLastYear){
      periodType.push('quarters last year');

    } if(this.reportPeriods.last52Weeks){
      periodType.push('Last 52 Weeks');

    } if(this.reportPeriods.thisWeek){
      periodType.push('This Week');

    } if(this.reportPeriods.lastMonth){
      periodType.push('Last month');

    } if(this.reportPeriods.last14Days){
      periodType.push('Last 14 days');

    } if(this.reportPeriods.biMonthsThisYear){
      periodType.push('bi-monnths this year');

    } if(this.reportPeriods.monthsThisYear){
      periodType.push('months this year');

    } if(this.reportPeriods.last2SixMonths){
      periodType.push('Last 2 six months');

    } if(this.reportPeriods.yesterday){
      periodType.push('Yesterday');

    } if(this.reportPeriods.thisQuarter){
      periodType.push('This quarter');

    } if(this.reportPeriods.last12Months){
      periodType.push('Last 12 months');

    } if(this.reportPeriods.last5FinancialYears){
      periodType.push('Last 5 financial years');

    } if(this.reportPeriods.thisSixMonth){
      periodType.push('This six month');

    } if(this.reportPeriods.lastQuarter){
      periodType.push('Last quarter');

    } if(this.reportPeriods.thisFinancialYear){
      periodType.push('This financial year');

    } if(this.reportPeriods.last4Weeks){
      periodType.push('Last 4 Weeks');

    } if(this.reportPeriods.last3Months){
      periodType.push('Last 3 months');

    } if(this.reportPeriods.thisDay){
      periodType.push('This day');

    } if(this.reportPeriods.thisMonth){
      periodType.push('This month');

    } if(this.reportPeriods.last6BiMonths){
      periodType.push('Last 6 bi-monnths');

    } if(this.reportPeriods.lastFinancialYear){
      periodType.push('Last financial year');

    } if(this.reportPeriods.last5Years){
      periodType.push('Last 5 yeears');

    } if(this.reportPeriods.weeksThisYear){
      periodType.push('Weeks this year');

    } if(this.reportPeriods.last6Months){
      periodType.push('Last 6 months');

    } if(this.reportPeriods.last3Days){
      periodType.push('Last 3 days');

    } if(this.reportPeriods.quartersThisYear){
      periodType.push('quarters this year');

    } if(this.reportPeriods.monthsLastYear){
      periodType.push('months last year');

    } if(this.reportPeriods.lastWeek){
      periodType.push('Last Week');

    } if(this.reportPeriods.last7Days){
      periodType.push('Last 7 days');

    } if(this.reportPeriods.thisBimonth){
      periodType.push('This bi-monnth');

    } if(this.reportPeriods.lastBimonth){
      periodType.push('Last bi-monnth');

    } if(this.reportPeriods.lastSixMonth){
      periodType.push('Last six month');

    } if(this.reportPeriods.lastYear){
      periodType.push('Last yeear');

    } if(this.reportPeriods.last12Weeks){
      periodType.push('Last 12 Weeks');

    } if(this.reportPeriods.last4Quarters){
      periodType.push('Last 4 quarters');

    }


    if(periodType.length === 0){
      this.periodTypeSelected = 'Yearly';
    }else{
      periodType.forEach((selectedPeriod)=>{
        if(selectedPeriod.toString().includes('Week')){
          this.periodTypeSelected = 'Weekly';

        } if(selectedPeriod.toString().includes('day')){
          this.periodTypeSelected = 'Daily';

        } if(selectedPeriod.toString().includes('month')){
          this.periodTypeSelected = 'Monthly';

        } if(selectedPeriod.toString().includes('bi-')){
          this.periodTypeSelected = 'BiMonthly';

        } if(selectedPeriod.toString().includes('quarter')){
          this.periodTypeSelected = 'Quarterly';

        } if(selectedPeriod.toString().includes('yeear')){
          this.periodTypeSelected = 'Yearly';

        }
        // else if(selectedPeriod.toString().includes('day')){
        //   this.periodTypeSelected = 'Daily';
        // }

      });
    }


  }

  getFetchedPeriodType(){
    return this.periodTypeSelected
  }




}
