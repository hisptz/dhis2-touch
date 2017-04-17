import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {HttpClient} from "./http-client";

/*
 Generated class for the DashboardService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */

export interface Dashboard {
  id: string;
  name: string;
  dashboardItems: Array<any>
}

@Injectable()
export class DashboardService {

  dashboards:Dashboard[];

  constructor(private httpClient:HttpClient) {
  }

  resetDashboards(){
    this.dashboards = [];
  }

  /**
   * get all dashboards
   * @param currentUser
   * @returns {Promise<T>}
   */
  allDashboards(currentUser) {
    let url = '/api/25/dashboards.json?paging=false&fields=id,name,dashboardItems[:all,users[:all],resources[:all],reports[:all]]';
    let self = this;
    return new Promise(function (resolve, reject) {
      if (self.dashboards && self.dashboards.length > 0) {
        resolve(self.dashboards);
      } else {
        self.httpClient.get(url, currentUser).subscribe(response=> {
          self.dashboards = self.getDashboardsArrayFromApi(response.json());
          resolve(self.dashboards)
        }, error=> {
          reject(error.json());
        })
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

  /**
   * get formatted string neccessry for anlaytic
   * @param enumString
   * @returns {any}
   */
  formatEnumString(enumString) {
    enumString = enumString.replace(/_/g, ' ');
    enumString = enumString.toLowerCase();
    return enumString.substr(0, 1) + enumString.replace(/(\b)([a-zA-Z])/g,
        function (firstLetter) {
          return firstLetter.toUpperCase();
        }).replace(/ /g, '').substr(1);
  }


  /**
   * getDashboardItemObjects
   * @param dashboardItems
   * @param currentUser
   * @returns {Promise<T>}
   */
  getDashboardItemObjects(dashboardItems, currentUser) {
    let dashboardObjects = [];
    let self = this;
    let promises = [];
    let rejectedDashboardItems = 0;
    let rejectedDashboardsType = "";
    let allowedDashboardItems = ["CHART", "EVENT_CHART", "TABLE", "REPORT_TABLE", "EVENT_REPORT"];
    return new Promise(function (resolve, reject) {
      dashboardItems.forEach(dashboardItem=> {
        if (allowedDashboardItems.indexOf(dashboardItem.type) > -1) {
          promises.push(
            self.getDashboardItemObject(dashboardItem, currentUser).then(dashboardObject=> {
              dashboardObjects.push(dashboardObject);
            }, error=> {
            })
          )
        } else {
          rejectedDashboardItems++;
          if (rejectedDashboardItems == dashboardItems.length) {
            if (rejectedDashboardsType.indexOf(dashboardItem.type.toLowerCase()) == -1) {
              rejectedDashboardsType = rejectedDashboardsType + dashboardItem.type.toLowerCase() + ", ";
            }
            console.log("Here we are : " + rejectedDashboardsType);
            reject({
              rejectedDashboardItems: rejectedDashboardItems,
              errorMessage: "Selected dashboard has dashboard items of type " + rejectedDashboardsType + " which are not supported at the moment"
            });
          }
        }
      });
      Observable.forkJoin(promises).subscribe(() => {
          resolve(dashboardObjects);
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
  getDashboardItemObject(dashboardItem, currentUser) {
    let self = this;
    let url = "/api/25/" + self.formatEnumString(dashboardItem.type) + "s/" + dashboardItem[self.formatEnumString(dashboardItem.type)].id + ".json?fields=:all,program[id,name],programStage[id,name],columns[dimension,filter,items[id,name],legendSet[id,name]],rows[dimension,filter,items[id,name],legendSet[id,name]],filters[dimension,filter,items[id,name],legendSet[id,name]],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits,attributeDimensions[id,name,attribute[id,name,optionSet[id,name,options[id,name]]]],dataElementDimensions[id,name,dataElement[id,name,optionSet[id,name,options[id,name]]]],categoryDimensions[id,name,category[id,name,categoryOptions[id,name,options[id,name]]]]";
    return new Promise(function (resolve, reject) {
      self.httpClient.get(url, currentUser).subscribe(response=> {
        let dashboardObject = self.getDashboardItemObjectWithAnalyticsUrl(response.json());
        dashboardObject.interpretationLikeCount = dashboardItem.interpretationLikeCount;
        dashboardObject.interpretationCount = dashboardItem.interpretationCount;
        dashboardObject.visualizationType = dashboardItem.type;
        resolve(dashboardObject);
      }, error=> {
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
  getAnalyticDataForDashboardItems(dashboardObjects, currentUser) {
    let data = {};
    let self = this;
    let promises = [];
    return new Promise(function (resolve, reject) {
      dashboardObjects.forEach((dashboardObject:any)=> {
        promises.push(
          self.getAnalyticDataForDashboardItem(dashboardObject.analyticsUrl, currentUser).then(analyticData=> {
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
  getAnalyticDataForDashboardItem(analyticsUrl, currentUser) {
    let self = this;
    return new Promise(function (resolve, reject) {
      self.httpClient.get(analyticsUrl, currentUser).subscribe(response=> {
        resolve(response.json());
      }, error=> {
        reject(error.json());
      });
    });
  }

  /**
   * set analytic url on dashboard object
   * @param dashboardObject
   * @returns {any}
   */
  getDashboardItemObjectWithAnalyticsUrl(dashboardObject) {
    let analyticsUrl = this.getDashboardItemAnalyticsUrl(dashboardObject,false);
    dashboardObject.analyticsUrl = analyticsUrl;
    return dashboardObject;
  }

  /**
   * get analytic url
   * @param dashboardObject
   * @returns {string}
   */
  getDashboardItemAnalyticsUrl(dashboardObject, useCustomDimension) {
    let url = "/api/25/";
    let column = "";
    let row = "";
    let filter = "";
    let dashboardType = dashboardObject.type;

    if (dashboardType == 'MAP' && dashboardObject.layer == 'boundary') {
      url += 'geoFeatures';
    } else {
      url += "analytics";
    }

    dashboardObject.columns.forEach((dashboardObjectColumn : any,index : any)=>{
      let items = "";
      if(dashboardObjectColumn.dimension!="dy"){
        (index == 0)? items = "dimension="+dashboardObjectColumn.dimension: items += "&dimension="+dashboardObjectColumn.dimension;

        items += dashboardObjectColumn.hasOwnProperty('legendSet') ? '-' + dashboardObjectColumn.legendSet.id : "";
        items += ':';
        items += dashboardObjectColumn.hasOwnProperty('filter') ? dashboardObjectColumn.filter : "";

        dashboardObjectColumn.items.forEach((dashboardObjectColumnItem : any)=>{
          items += dashboardObjectColumnItem.id + ";"
        });
        column += items.slice(0, -1);
      }
    });
    //checking for rows
    dashboardObject.rows.forEach((dashboardObjectRow : any)=>{
      let items = "";
      if(dashboardObjectRow.dimension!="dy"){
        items += "&dimension="+dashboardObjectRow.dimension;
        items += dashboardObjectRow.hasOwnProperty('legendSet') ? '-' + dashboardObjectRow.legendSet.id : "";
        items += ':';
        items += dashboardObjectRow.hasOwnProperty('filter') ? dashboardObjectRow.filter : "";
        dashboardObjectRow.items.forEach((dashboardObjectRowItem : any)=>{
          items += dashboardObjectRowItem.id + ";"
        });
        row += items.slice(0, -1);
      }
    });
    //checking for filters
    dashboardObject.filters.forEach((dashboardObjectFilter : any)=>{
      let items = "";
      if(dashboardObjectFilter.dimension!="dy"){
        items += "&filter="+dashboardObjectFilter.dimension;
        items += dashboardObjectFilter.hasOwnProperty('legendSet') ? '-' + dashboardObjectFilter.legendSet.id : "";
        items += ':';
        items += dashboardObjectFilter.hasOwnProperty('filter') ? dashboardObjectFilter.filter : "";
        dashboardObjectFilter.items.forEach((dashboardObjectFilterItem : any)=>{
          items += dashboardObjectFilterItem.id + ";"
        });
        filter += items.slice(0, -1);
      }
    });

    //set url base on type
    if (dashboardType == "EVENT_CHART") {
      url += "/events/aggregate/" + dashboardObject.program.id + ".json?stage=" + dashboardObject.programStage.id + "&";
    } else if (dashboardType == "EVENT_REPORT") {
      if (dashboardObject.dataType == "AGGREGATED_VALUES") {
        url += "/events/aggregate/" + dashboardObject.program.id + ".json?stage=" + dashboardObject.programStage.id + "&";
      } else {
        url += "/events/query/" + dashboardObject.program.id + ".json?stage=" + dashboardObject.programStage.id + "&pageSize=50&";
      }

    } else if (dashboardType == "EVENT_MAP") {
      url += "/events/aggregate/" + dashboardObject.program.id + ".json?stage=" + dashboardObject.programStage.id + "&";
    } else if (dashboardType = 'MAP' && dashboardObject.layer == 'event') {
      url += "/events/query/" + dashboardObject.program.id + ".json?stage=" + dashboardObject.programStage.id + "&";
      //@todo consider start and end date
      url += 'startDate=' + dashboardObject.startDate + '&' + 'endDate=' + dashboardObject.endDate + '&';
    } else {
      url += ".json?";
    }

    //@todo find best way to structure geoFeatures
    if (dashboardObject.layer == 'boundary') {
      url += this.getGeoFeatureParameters(dashboardObject);
    } else {
      url += column + '&' + row;
      url += filter == "" ? "" : '&' + filter;
    }
    // url += "&user=" + currentUserId;

    url += "&displayProperty=NAME" + dashboardType == "EVENT_CHART" ?
      "&outputType=EVENT&"
      : dashboardType == "EVENT_REPORT" ?
      "&outputType=EVENT&displayProperty=NAME"
      : dashboardType == "EVENT_MAP" ?
      "&outputType=EVENT&displayProperty=NAME"
      : "&displayProperty=NAME";
    if (dashboardObject.layer == 'event') {
      url += "&coordinatesOnly=true";
    }
    return url;
  }


  /**
   *
   * @param dashboardObject
   * @returns {any}
     */
  getDashboardItemMetadataIdentifiers(dashboardObject) {
    let items = "";
    dashboardObject.rows.forEach((dashboardObjectRow:any)=> {
      if (dashboardObjectRow.dimension === "dx") {
        dashboardObjectRow.items.forEach((dashboardObjectRowItem:any)=> {
          items += dashboardObjectRowItem.id + ";"
        });
      } else {
        //find identifiers in the column if not in row
        dashboardObject.columns.forEach((dashboardObjectColumn:any) => {
          if (dashboardObjectColumn.dimension === "dx") {
            dashboardObjectColumn.items.forEach((dashboardObjectColumnItem:any)=> {
              items += dashboardObjectColumnItem.id + ";"
            });
          } else {
            dashboardObject.filters.forEach((dashboardObjectFilters:any) => {
              if (dashboardObjectFilters.dimension === "dx") {
                dashboardObjectFilters.items.forEach((dashboardObjectFilterItem:any)=> {
                  items += dashboardObjectFilterItem.id + ";"
                });
              }
            });
          }
        });
      }
    });
    return items.slice(0, -1);
  }


  /**
   *
   * @param dashboardObject
   * @returns {string}
     */
  getGeoFeatureParameters(dashboardObject): string {
    let dimensionItems: any;
    let params: string = 'ou=ou:';
    let columnItems = this.findDimensionItems(dashboardObject.columns, 'ou');
    let rowItems = this.findDimensionItems(dashboardObject.rows, 'ou');
    let filterItems = this.findDimensionItems(dashboardObject.filters, 'ou');
    if (columnItems != null) {
      dimensionItems = columnItems;
    } else if (rowItems != null) {
      dimensionItems = rowItems;
    } else if (filterItems != null) {
      dimensionItems = filterItems;
    }

    if (dimensionItems.length > 0) {
      dimensionItems.forEach(item => {
        params += item.dimensionItem + ";";

      })
    }
    return params;
  }

  /**
   *
   * @param dimensionHolder
   * @param dimension
   * @returns {any}
     */
  findDimensionItems(dimensionHolder, dimension): any {
    let items: any = null;
    if (dimensionHolder.length > 0) {
      for (let holder of dimensionHolder) {
        if (holder.dimension == dimension) {
          items = holder.items;
          break;
        }
      }
    }
    return items;
  }

}
