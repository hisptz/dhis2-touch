import { Injectable } from '@angular/core';
import {HttpClient} from "./http-client/http-client";
import {Observable} from 'rxjs/Rx';

/*
  Generated class for the Dashboard provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Dashboard {

  constructor(public httpClient: HttpClient) {
    console.log('Hello Dashboard Provider');
  }

  getAllDashBoardsFromServer(currentUser){
    let url = "/api/dashboards.json?paging=false&fields=name,id,itemCount,dashboardItems[id,name,interpretationCount," +
      "interpretationLikeCount,type,shape,chart[id,name,type,series,category,relativePeriods,programIndicatorDimensions," +
      "dataDimensionItems,dataElementDimensions,periods,organisationUnits,categoryDimensions]]";
    let self = this;
    return new Promise(function(resolve, reject) {
      self.httpClient.get(url,currentUser).subscribe(response=>{
        resolve(response.json())
      },error=>{
        reject(error.json());
      })
    });
  }

  getDefaultDashBoard(type){
    let dashBoard = {
      title: { text: 'simple chart' },
      chart: { type: type },
      series: [
        {
          data: [49.9, 17.5, 10.4]
        },
        {
          data: [6.9, 11.5, 16.4]
        },
        {
          data: [42.9, 30.5, 14.8]
        },
        {
          data: [39.9, 18.5, 20.4]
        },
        {
          data: [16.9, 15.5, 1.4]
        },
        {
          data: [32.9, 3.5, 17.8]
        }
      ]
    }
    return dashBoard;
  }


}
