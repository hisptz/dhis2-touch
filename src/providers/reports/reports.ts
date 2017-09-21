import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {SqlLiteProvider} from "../sql-lite/sql-lite";

/*
  Generated class for the ReportsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ReportsProvider {

  public resourceName :string;

  constructor(public http: Http, public sqLite: SqlLiteProvider) {
    this.resourceName = "reports";
  }

  getReportList(currentUser){

    return new Promise((resolve, reject)=> {
      this.sqLite.getAllDataFromTable(this.resourceName,currentUser.currentDatabase).then((reportList)=>{
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
      this.sqLite.getDataFromTableByAttributes(this.resourceName,attribute,attributeArray,currentUser.currentDatabase).then((reportList:any)=>{
        resolve(reportList[0]);
      },error=>{
        reject(error);
      })
    })
  }



}
