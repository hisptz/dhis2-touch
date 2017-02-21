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
  }

  /**
   * get all dashBoards from server
   * @param currentUser
   * @returns {Promise<T>}
     */
  getAllDashBoardsFromServer(currentUser){
    let url = "/api/dashboards.json?paging=false&filter=itemCount:gt:0&fields=name,id," +
      "dashboardItems[id,type,shape,chart[:all],reportTable[:all]," +
      "map[id,lastUpdated,created,name,zoom,longitude,latitude,displayName,mapViews[:all],:all],:all,program[id,name]," +
      "programStage[id,name],columns[dimension,filter,legendSet[id,name],items[id,name]]," +
      "rows[dimension,filter,legendSet[id,name],items[id,name]]," +
      "filters[dimension,filter,legendSet[id,name],items[id,name]],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits]";
    let self = this;
    return new Promise(function(resolve, reject) {
      self.httpClient.get(url,currentUser).subscribe(response=>{
        resolve(response.json())
      },error=>{
        reject(error.json());
      })
    });
  }

  /**
   * get formatted string neccessry for anlaytic
   * @param enumString
   * @returns {any}
     */
  formatEnumString(enumString){
    enumString = enumString.replace(/_/g,' ');
    enumString=enumString.toLowerCase();
    return enumString.substr(0,1)+enumString.replace(/(\b)([a-zA-Z])/g,
        function(firstLetter){
          return   firstLetter.toUpperCase();
        }).replace(/ /g,'').substr(1);
  }


  /**
   * getDashBoardItemObjects
   * @param dashboardItems
   * @param currentUser
   * @returns {Promise<T>}
     */
  getDashBoardItemObjects(dashboardItems,currentUser){
    let dashBoardObjects = [];let self= this;
    let promises = [];
    return new Promise(function(resolve, reject) {
      dashboardItems.forEach(dashboardItem=>{
        promises.push(
          self.getDashBoardItemObject(dashboardItem,currentUser).then(dashBoardObject=>{
            dashBoardObjects.push(dashBoardObject);
          },error=>{})
        )
      });
      Observable.forkJoin(promises).subscribe(() => {
          resolve(dashBoardObjects);
        },
        (error) => {
          reject(error);
        })
    });
  }

  /**
   * get dashBoardItemObject with analytic url
   * @param dashboardItem
   * @param currentUser
   * @returns {Promise<T>}
     */
  getDashBoardItemObject(dashboardItem,currentUser){
    let self = this;
    let url = "/api/"+self.formatEnumString(dashboardItem.type)+"s/"+dashboardItem[self.formatEnumString(dashboardItem.type)].id+".json?fields=:all,program[id,name],programStage[id,name],columns[dimension,filter,items[id,name],legendSet[id,name]],rows[dimension,filter,items[id,name],legendSet[id,name]],filters[dimension,filter,items[id,name],legendSet[id,name]],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits,attributeDimensions[id,name,attribute[id,name,optionSet[id,name,options[id,name]]]],dataElementDimensions[id,name,dataElement[id,name,optionSet[id,name,options[id,name]]]],categoryDimensions[id,name,category[id,name,categoryOptions[id,name,options[id,name]]]]";
    return new Promise(function(resolve, reject) {
      self.httpClient.get(url,currentUser).subscribe(response=>{
        let dashBoardObject = self.getDashBoardItemObjectWithAnalyticsUrl(response.json());
        dashBoardObject.interpretationLikeCount = dashboardItem.interpretationLikeCount;
        dashBoardObject.interpretationCount = dashboardItem.interpretationCount;
        resolve(dashBoardObject);
      },error=>{
        reject(error.json());
      });
    });
  }

  /**
   * get analytic data for each object
   * @param dashboardObjects
   * @param currentUser
   * @returns {Promise<T>}
     */
  getAnalyticDataForDashBoardItems(dashboardObjects,currentUser){
    let data = {};let self= this;
    let promises = [];
    return new Promise(function(resolve, reject) {
      dashboardObjects.forEach((dashboardObject:any)=> {
        promises.push(
          self.getAnalyticDataForDashBoardItem(dashboardObject.analyticsUrl,currentUser).then(analyticData=> {
            data[dashboardObject.id] = analyticData;
          }, error=> {
          })
        )
      });
      Observable.forkJoin(promises).subscribe(() => {
          resolve(data);
        },
        (error) => {
          reject(error);
        })
    });
  }

  /**
   * get analytic data from login instance
   * @param analyticsUrl
   * @param currentUser
   * @returns {Promise<T>}
     */
  getAnalyticDataForDashBoardItem(analyticsUrl,currentUser){
    let self = this;
    return new Promise(function(resolve, reject) {
      self.httpClient.get(analyticsUrl,currentUser).subscribe(response=>{
        resolve(response.json());
      },error=>{
        reject(error.json());
      });
    });
  }

  /**
   * set analytic url on dashboard object
   * @param dashBoardObject
   * @returns {any}
     */
  getDashBoardItemObjectWithAnalyticsUrl(dashBoardObject){
    let analyticsUrl = this.getDashBoardItemAnalyticsUrl(dashBoardObject);
    dashBoardObject.analyticsUrl = analyticsUrl;
    return dashBoardObject;
  }

  /**
   * get analytic url
   * @param dashBoardObject
   * @returns {string}
     */
  getDashBoardItemAnalyticsUrl(dashBoardObject){
    let url = "/api/analytics";let column = "";let row = "";let filter = "";
    //checking for columns
    dashBoardObject.columns.forEach((dashBoardObjectColumn : any,index : any)=>{
      let items = "";
      if(dashBoardObjectColumn.dimension!="dy"){
        (index == 0)? items = "dimension="+dashBoardObjectColumn.dimension+":": items += "&dimension="+dashBoardObjectColumn.dimension+":";
        dashBoardObjectColumn.items.forEach((dashBoardObjectColumnItem : any)=>{
          items += dashBoardObjectColumnItem.id + ";"
        });
        if(dashBoardObjectColumn.filter) {
          items += dashBoardObjectColumn.filter+';';
        }
        column += items.slice(0, -1);
      }
    });
    //checking for rows
    dashBoardObject.rows.forEach((dashBoardObjectRow : any)=>{
      let items = "";
      if(dashBoardObjectRow.dimension!="dy"){
        items += "&dimension="+dashBoardObjectRow.dimension+":";
        dashBoardObjectRow.items.forEach((dashBoardObjectRowItem : any)=>{
          items += dashBoardObjectRowItem.id + ";"
        });
        if(dashBoardObjectRow.filter) {
          items += dashBoardObjectRow.filter+';';
        }
        row += items.slice(0, -1);
      }
    });
    //checking for filters
    dashBoardObject.filters.forEach((dashBoardObjectFilter : any)=>{
      let items = "";
      if(dashBoardObjectFilter.dimension!="dy"){
        items += "&dimension="+dashBoardObjectFilter.dimension+":";
        dashBoardObjectFilter.items.forEach((dashBoardObjectFilterItem : any)=>{
          items += dashBoardObjectFilterItem.id + ";"
        });
        if(dashBoardObjectFilter.filter) {
          items += dashBoardObjectFilter.filter+';';
        }
        filter += items.slice(0, -1);
      }
    });

    //set url base on type
    if( dashBoardObject.type=="EVENT_CHART" ) {
      url += "/events/aggregate/"+dashBoardObject.program.id+".json?stage=" +dashBoardObject.programStage.id+"&";
    }else if ( dashBoardObject.type=="EVENT_REPORT" ) {
      if( dashBoardObject.dataType=="AGGREGATED_VALUES") {
        url += "/events/aggregate/"+dashBoardObject.program.id+".json?stage=" +dashBoardObject.programStage.id+"&";
      }else {
        url += "/events/query/"+dashBoardObject.program.id+".json?stage=" +dashBoardObject.programStage.id+"&";
      }

    }else if ( dashBoardObject.type=="EVENT_MAP" ) {
      url +="/events/aggregate/"+dashBoardObject.program.id+".json?stage="  +dashBoardObject.programStage.id+"&";
    }else {
      url += ".json?";
    }

    url += column+row;
    ( filter == "" )? url+"" : url += filter;
    url += "&displayProperty=NAME"+  dashBoardObject.type=="EVENT_CHART" ?
      "&outputType=EVENT&"
      : dashBoardObject.type=="EVENT_REPORT" ?
      "&outputType=EVENT&displayProperty=NAME"
      : dashBoardObject.type=="EVENT_MAP" ?
      "&outputType=EVENT&displayProperty=NAME"
      :"&displayProperty=NAME" ;
    return url;
  }


}
