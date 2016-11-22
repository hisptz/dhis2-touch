import { Injectable } from '@angular/core';
import {HttpClient} from "./http-client/http-client";
import {SqlLite} from "./sql-lite/sql-lite";
import {Observable} from 'rxjs/Rx';

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
    let self = this;
    return new Promise(function(resolve, reject) {
      self.sqlLite.getAllDataFromTable(self.resourceName,currentUser.currentDatabase).then((reportList)=>{
        resolve(reportList);
      },error=>{
        reject(error);
      });
    })
  }



}
