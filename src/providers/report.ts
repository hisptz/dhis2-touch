import { Injectable } from '@angular/core';
import {HttpClient} from "./http-client";
import {SqlLite} from "./sql-lite";

/*
  Generated class for the Report provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Report {

  public resourceName :string;
  constructor(private httpClient : HttpClient,private sqlLite :SqlLite) {
    this.resourceName = "reports";
  }

  getReportList(currentUser){

    return new Promise((resolve, reject)=> {
      this.sqlLite.getAllDataFromTable(this.resourceName,currentUser.currentDatabase).then((reportList)=>{
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
    let self = this;
    let attribute = "id";
    let attributeArray = [];
    attributeArray.push(reportId);
    return new Promise(function(resolve, reject) {
      this.sqlLite.getDataFromTableByAttributes(self.resourceName,attribute,attributeArray,currentUser.currentDatabase).then((reportList:any)=>{
        resolve(reportList[0]);
      },error=>{
        reject(error);
      })
    })
  }

}
