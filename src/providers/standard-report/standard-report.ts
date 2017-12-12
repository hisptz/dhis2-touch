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

  /**
   *
   * @param currentUser
   * @returns {Promise<any>}
   */
  getReportList(currentUser){
    return new Promise((resolve, reject)=> {
      this.SqlLite.getAllDataFromTable(this.resource,currentUser.currentDatabase).then((reportList)=>{
        resolve(reportList);
      },error=>{
        reject(error);
      });
    })
  }

  /**
   *
   * @param reportParams
   * @returns {boolean}
   */
  hasReportRequireParameterSelection(reportParams){
    let requireReportParameter = false;
    if(reportParams.paramReportingPeriod || reportParams.paramOrganisationUnit){
      requireReportParameter = true;
    }
    return requireReportParameter;
  }

  /**
   *
   * @param reportId
   * @param currentUser
   * @returns {Promise<any>}
   */
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


  getReportDesign(reportId,currentUser){
    let attribute = "id";
    let resource = "reportDesign";
    let attributeArray = [];
    attributeArray.push(reportId);
    return new Promise((resolve, reject)=> {
      this.SqlLite.getDataFromTableByAttributes(resource,attribute,attributeArray,currentUser.currentDatabase).then((reportList:any)=>{
        resolve(reportList[0]);
      },error=>{
        reject(error);
      })
    })
  }

  /**
   *
   * @param relativePeriods
   * @returns {string}
   */
  getReportPeriodType(relativePeriods){
    let reportPeriodType = "Yearly";
    let reportPeriods = [];

    if(relativePeriods.last14Days || relativePeriods.yesterday || relativePeriods.thisDay || relativePeriods.last3Days || relativePeriods.last7Days){
      reportPeriods.push("Daily");
    }
    if(relativePeriods.last52Weeks || relativePeriods.last12Weeks || relativePeriods.lastWeek || relativePeriods.thisWeek || relativePeriods.last4Weeks || relativePeriods.weeksThisYear){
      reportPeriods.push("Weekly");
    }
    if(relativePeriods.lastSixMonth || relativePeriods.lastMonth || relativePeriods.monthsThisYear || relativePeriods.monthsLastYear || relativePeriods.last6Months || relativePeriods.thisMonth || relativePeriods.last2SixMonths || relativePeriods.last3Months || relativePeriods.last12Months ||  relativePeriods.thisSixMonth){
      reportPeriods.push("Monthly");
    }
    if(relativePeriods.biMonthsThisYear || relativePeriods.lastBimonth || relativePeriods.last6BiMonths || relativePeriods.thisBimonth){
      reportPeriods.push("BiMonthly")
    }
    if(relativePeriods.quartersLastYear || relativePeriods.last4Quarters || relativePeriods.quartersThisYear || relativePeriods.thisQuarter || relativePeriods.lastQuarter ){
      reportPeriods.push("Quarterly")
    }
    if(relativePeriods.lastYear || relativePeriods.last5Years || relativePeriods.thisYear){
      reportPeriods.push("Yearly")
    }
    //@todo checking preference on relative periods
    if(reportPeriods.length > 0){
      reportPeriodType = reportPeriods[0];
    }
    return reportPeriodType;
  }




}
