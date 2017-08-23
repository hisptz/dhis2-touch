import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import {Dashboard} from "../../model/dashboard";
import {HttpClientProvider} from "../http-client/http-client";
import {Observable} from 'rxjs/Observable';
import {ResourceProvider} from "../resource/resource";

/*
  Generated class for the DashboardProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DashboardProvider {

  dashboards:Dashboard[];
  dashboardObjectsMapper:any = {};
  currentFullScreenVisualizationData : any = {};
  openedDashboardIds :any  = {};

  constructor(private http : HttpClientProvider,private resourceProvder : ResourceProvider) {}

  /**
   * reset all dashboard issues
   */
  resetDashboards() {
    this.dashboards = [];
    this.dashboardObjectsMapper = {};
    this.currentFullScreenVisualizationData
  }

  /**
   * setCurrentFullScreenVisualizationData
   * @param data
   */
  setCurrentFullScreenVisualizationData(data){
    if(data.dashboardItem && data.dashboardItem.id){
      data.dashboardItem.id = 'full-' + data.dashboardItem.id;
    }
    this.currentFullScreenVisualizationData = data;
  }

  /**
   *   getCurrentFullScreenVisualizationData
   * @returns {any}
   */
  getCurrentFullScreenVisualizationData(){
    return this.currentFullScreenVisualizationData;
  }


  loadAll(currentUser): Observable<any> {
    return Observable.create(observer => {
      if (this.dashboards && this.dashboards.length > 0) {
        observer.next(this.dashboards);
        observer.complete();
      } else {
        let url = '/api/25/dashboards.json?fields=id,name,publicAccess,access,externalAccess,userGroupAccesses,dashboardItems[id,displayName,type,created,shape,appKey,reports[id,displayName],chart[id,displayName],map[id,displayName],reportTable[id,displayName],eventReport[id,displayName],eventChart[id,displayName],resources[id,displayName],users[id,displayName]&paging=false';
        this.http.get(url,currentUser)
          .then((dashboardResponse : any) => {
            this.dashboards = this.getDashboardsArrayFromApi(JSON.parse(dashboardResponse.data));
            observer.next(this.dashboards);
            observer.complete()
          }, error => {
            observer.error(error);
          });
      }
    });
  }

  /**
   * get formatted dashboards as array
   * @param dashboardsResponse
   * @returns {Array}
   */
  getDashboardsArrayFromApi(dashboardsResponse) {
    let dashboardsArray = [];
    if (dashboardsResponse && dashboardsResponse.dashboards) {
      for (let dashboard of  dashboardsResponse.dashboards) {
        dashboardsArray.push(dashboard);
      }
    }
    return dashboardsArray;
  }

  getDashBoardTitle(dashboardItem){
    let key = _.camelCase(dashboardItem.type);
    let title : string = key;
    if(dashboardItem[key] && dashboardItem[key].length > 0){
      title = _.capitalize(key);
    }else if(dashboardItem[key] && dashboardItem[key].id){
      title =  dashboardItem[key].displayName;
    }else{
      title = _.capitalize(key);
    }
    return title;
  }

  getDashBoardItemIcon(dashBoardType){
    let icons = this.resourceProvder.getDashBoardItemsIcons();
    return icons[dashBoardType];
  }


}
