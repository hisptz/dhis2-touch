import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Rx';
import {HttpClientProvider} from "../http-client/http-client";

/*
 Generated class for the DashboardServiceProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */


export interface Dashboard {
  id: string;
  name: string;
  dashboardItems: Array<any>
}

@Injectable()
export class DashboardServiceProvider {

  dashboards:Dashboard[];
  dashboardObjectsMapper:any = {};
  currentFullScreenVisualizationData : any = {};
  openedDashboardIds :any  = {};

  constructor(private httpClient:HttpClientProvider) {
  }

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

  setOpenedDashboardIds(openedDashboardIds){
    this.openedDashboardIds = openedDashboardIds;
  }

  getOpenedDashboardIds(){
    return this.openedDashboardIds;
  }


  /**
   *   getCurrentFullScreenVisualizationData
   * @returns {any}
   */
  getCurrentFullScreenVisualizationData(){
    return this.currentFullScreenVisualizationData;
  }



  /**
   * get all dashboards
   * @param currentUser
   * @returns {Promise<T>}
   */
  allDashboards(currentUser) {
    let url = '/api/25/dashboards.json?paging=false&fields=id,name,dashboardItems[:all,users[:all],resources[:all],reports[:all]]';

    return new Promise((resolve, reject)=> {
      if (this.dashboards && this.dashboards.length > 0) {
        resolve(this.dashboards);
      } else {
        this.httpClient.get(url, currentUser).then((response:any)=> {
          this.dashboards = this.getDashboardsArrayFromApi(JSON.parse(response.data));
          resolve(this.dashboards);
        }, error=> {
          reject(error);
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
  getDashboardItemObjects(dashboardItems, selectedDashboardId, currentUser) {
    let dashboardObjects = [];
    let promises = [];
    let rejectedDashboardItems = 0;
    let rejectedDashboardsType = "";
    let allowedDashboardItems = ["CHART", "EVENT_CHART", "TABLE", "REPORT_TABLE", "EVENT_REPORT"];
    return new Promise((resolve, reject)=> {
      if (this.dashboardObjectsMapper[selectedDashboardId]) {
        resolve(this.dashboardObjectsMapper[selectedDashboardId])
      } else {
        dashboardItems.forEach(dashboardItem=> {
          if (allowedDashboardItems.indexOf(dashboardItem.type) > -1) {
            promises.push(
              this.getDashboardItemObject(dashboardItem, currentUser).then(dashboardObject=> {
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
              reject({
                rejectedDashboardItems: rejectedDashboardItems,
                errorMessage: "Selected dashboard has dashboard items of type " + rejectedDashboardsType + " which are not supported at the moment"
              });
            }
          }
        });
        Observable.forkJoin(promises).subscribe(() => {
            this.dashboardObjectsMapper[selectedDashboardId] = dashboardObjects;
            resolve(dashboardObjects);
          },
          (error) => {
            reject(error);
          })
      }
    });
  }

  /**
   * get dashBoardItemObject with analytic url
   * @param dashboardItem
   * @param currentUser
   * @returns {Promise<T>}
   */
  getDashboardItemObject(dashboardItem, currentUser) {
    let url = "/api/25/" + this.formatEnumString(dashboardItem.type) + "s/" + dashboardItem[this.formatEnumString(dashboardItem.type)].id + ".json?fields=:all,program[id,name],programStage[id,name],columns[dimension,filter,items[id,name],legendSet[id,name]],rows[dimension,filter,items[id,name],legendSet[id,name]],filters[dimension,filter,items[id,name],legendSet[id,name]],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits,attributeDimensions[id,name,attribute[id,name,optionSet[id,name,options[id,name]]]],dataElementDimensions[id,name,dataElement[id,name,optionSet[id,name,options[id,name]]]],categoryDimensions[id,name,category[id,name,categoryOptions[id,name,options[id,name]]]]";
    return new Promise((resolve, reject)=> {
      this.httpClient.get(url, currentUser).then((response:any)=> {
        let dashboardObject = this.getDashboardItemObjectWithAnalyticsUrl(JSON.parse(response.data));
        dashboardObject.interpretationLikeCount = dashboardItem.interpretationLikeCount;
        dashboardObject.interpretationCount = dashboardItem.interpretationCount;
        dashboardObject.visualizationType = dashboardItem.type;
        resolve(dashboardObject);
      }, error=> {
        reject(error);
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
    let promises = [];
    return new Promise((resolve, reject)=> {
      dashboardObjects.forEach((dashboardObject:any)=> {
        promises.push(
          this.getAnalyticDataForDashboardItem(dashboardObject.analyticsUrl, currentUser).then(analyticData=> {
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
    return new Promise((resolve, reject)=> {
      this.httpClient.get(analyticsUrl, currentUser).then((response:any)=> {
        resolve(JSON.parse(response.data));
      }, error=> {
        reject(error);
      });
    });
  }

  /**
   * set analytic url on dashboard object
   * @param dashboardObject
   * @returns {any}
   */
  getDashboardItemObjectWithAnalyticsUrl(dashboardObject) {
    let analyticsUrl = this.getDashboardItemAnalyticsUrl(dashboardObject, false);
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

    dashboardObject.columns.forEach((dashboardObjectColumn:any, index:any)=> {
      let items = "";
      if (dashboardObjectColumn.dimension != "dy") {
        (index == 0) ? items = "dimension=" + dashboardObjectColumn.dimension : items += "&dimension=" + dashboardObjectColumn.dimension;

        items += dashboardObjectColumn.hasOwnProperty('legendSet') ? '-' + dashboardObjectColumn.legendSet.id : "";
        items += ':';
        items += dashboardObjectColumn.hasOwnProperty('filter') ? dashboardObjectColumn.filter : "";

        dashboardObjectColumn.items.forEach((dashboardObjectColumnItem:any)=> {
          items += dashboardObjectColumnItem.id + ";"
        });
        column += items.slice(0, -1);
      }
    });
    //checking for rows
    dashboardObject.rows.forEach((dashboardObjectRow:any)=> {
      let items = "";
      if (dashboardObjectRow.dimension != "dy") {
        items += "&dimension=" + dashboardObjectRow.dimension;
        items += dashboardObjectRow.hasOwnProperty('legendSet') ? '-' + dashboardObjectRow.legendSet.id : "";
        items += ':';
        items += dashboardObjectRow.hasOwnProperty('filter') ? dashboardObjectRow.filter : "";
        dashboardObjectRow.items.forEach((dashboardObjectRowItem:any)=> {
          items += dashboardObjectRowItem.id + ";"
        });
        row += items.slice(0, -1);
      }
    });
    //checking for filters
    dashboardObject.filters.forEach((dashboardObjectFilter:any)=> {
      let items = "";
      if (dashboardObjectFilter.dimension != "dy") {
        items += "&filter=" + dashboardObjectFilter.dimension;
        items += dashboardObjectFilter.hasOwnProperty('legendSet') ? '-' + dashboardObjectFilter.legendSet.id : "";
        items += ':';
        items += dashboardObjectFilter.hasOwnProperty('filter') ? dashboardObjectFilter.filter : "";
        dashboardObjectFilter.items.forEach((dashboardObjectFilterItem:any)=> {
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
  getGeoFeatureParameters(dashboardObject):string {
    let dimensionItems:any;
    let params:string = 'ou=ou:';
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
  findDimensionItems(dimensionHolder, dimension):any {
    let items:any = null;
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
