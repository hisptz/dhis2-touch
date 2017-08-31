import { Injectable } from '@angular/core';
import {HttpClientProvider} from "../http-client/http-client";
import {SqlLiteProvider} from "../sql-lite/sql-lite";


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

  downloadConstantsFromServer(currentUser){
    let fields = "id,name,value";
    let resource = "constants";
    let url = "/api/25/"+resource+".json?paging=false&fields=" + fields;
    return new Promise((resolve, reject)=> {
      this.HttpClient.get(url,currentUser).then((response : any)=>{
        response = JSON.parse(response.data);
        resolve(response);
      },error=>{
        reject(error);
      });
    });
  }

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

  saveReportsFromServer(reports,currentUser){
    return new Promise((resolve, reject)=> {
      if(reports.length == 0){
        resolve();
      }else{
        this.SqlLite.insertBulkDataOnTable(this.resource,reports,currentUser.currentDatabase).then(()=>{
          resolve();
        },error=>{
          console.log(JSON.stringify(error));
          reject(error);
        });
      }
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



}
