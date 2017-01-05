import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';

/*
 Generated class for the ChartVisualizer provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class ChartVisualizer {

  constructor() {
  }

  /**
   * get all chars objects
   * @param analyticDataMapper
   * @param dashBoardItemObjects
   * @returns {Promise<T>}
     */
  getChartObjects(analyticDataMapper,dashBoardItemObjects){
    let self = this;
    let chartsObjects = {};
    return new Promise(function(resolve, reject) {
      dashBoardItemObjects.forEach((dashBoardItemObject : any)=>{
        let chartType = "line";
        if(dashBoardItemObject.type){
          let typeArray = dashBoardItemObject.type.split("_");
          chartType = typeArray[typeArray.length -1].toLowerCase();
        }
        let chartObject =  self.getChartObject(analyticDataMapper[dashBoardItemObject.id],dashBoardItemObject.category,[],dashBoardItemObject.series,[],dashBoardItemObject.name,chartType);
        chartsObjects[dashBoardItemObject.id] = chartObject;
      });
      resolve(chartsObjects);
    });
  }


  /**
   * get chart object
   * @param analyticsObject
   * @param xAxisType
   * @param xAxisItems
   * @param yAxisType
   * @param yAxisItems
   * @param title
   * @param chartType
   * @returns {{options: {title: {text: any}, chart: {type: string, zoomType: string}, xAxis: {categories: Array, labels: {rotation: number, style: {color: string, fontWeight: string}}}, series: Array}}}
     */
  getChartObject(analyticsObject, xAxisType,xAxisItems,yAxisType,yAxisItems,title,chartType){
    let self = this;
    let chartObject = {
      options : {
        title: {text: title },
        chart: { type: "", zoomType :'x' },
        xAxis: {categories: [], labels: {rotation: -40,style: {'color': '#000000', 'fontWeight': 'normal'}}},
        credits: {enabled: false},
        series: []
      }
    };
    if(chartType){
      chartObject.options.chart.type = chartType;
    }
    let metaDataObject = self.prepareCategories(analyticsObject, xAxisType,xAxisItems,yAxisType,yAxisItems);
    metaDataObject.xAxisItems.forEach((xAxisItem:any)=>{
      chartObject.options.xAxis.categories.push(xAxisItem.name);
    });
    metaDataObject.yAxisItems.forEach((yAxisItem:any)=>{
      let data = [];
      metaDataObject.xAxisItems.forEach((xAxisItem:any)=>{
        let number = self.getDataValue(analyticsObject,xAxisType,xAxisItem.uid,yAxisType,yAxisItem.uid);
        data.push(number);
      });
      chartObject.options.series.push({
        name : yAxisItem.name,
        data: data
      })
    });
    return chartObject;
  }

  /**
   * prepareCategories
   * @param analyticsObject
   * @param xAxisType
   * @param xAxisItems
   * @param yAxisType
   * @param yAxisItems
   * @returns {{xAxisItems: Array, yAxisItems: Array}}
     */
  prepareCategories(analyticsObject, xAxisType,xAxisItems,yAxisType,yAxisItems){
    let structure = {'xAxisItems':[],'yAxisItems':[]};
    let self = this;
    if(xAxisItems.length === 0){
      self.getMetadataArray(analyticsObject,xAxisType).forEach(value=>{
        structure.xAxisItems.push({'name':analyticsObject.metaData.names[value],'uid':value});
      });
    }
    if(xAxisItems.length !== 0){
      xAxisItems.forEach(value=>{
        structure.xAxisItems.push({'name':analyticsObject.metaData.names[value],'uid':value});
      });
    }
    if(yAxisItems.length !== 0){
      yAxisItems.forEach(value=>{
        structure.yAxisItems.push({'name':analyticsObject.metaData.names[value],'uid':value});
      });
    }if(yAxisItems.length === 0){
      self.getMetadataArray(analyticsObject,yAxisType).forEach(value=>{
        structure.yAxisItems.push({'name':analyticsObject.metaData.names[value],'uid':value});
      });
    }
    return structure;
  }

  /**
   *
   * @param analyticsObject
   * @param metadataType
   * @returns {Array}
     */
  getMetadataArray(analyticsObject,metadataType){
    let metadataArray = [];
    if(analyticsObject.metaData && analyticsObject.metaData[metadataType]){
      metadataArray = analyticsObject.metaData[metadataType];
    }
    return metadataArray;
  }

  /**
   *
   * @param analyticsObject
   * @param xAxisType
   * @param xAxisUid
   * @param yAxisType
   * @param yAxisUid
     * @returns {number}
     */
  getDataValue(analyticsObject,xAxisType,xAxisUid,yAxisType,yAxisUid){
    let self = this;let num = 0;
    for ( let value of analyticsObject.rows) {
      if(value[self.getTitleIndex(analyticsObject.headers,yAxisType)] === yAxisUid &&
        value[self.getTitleIndex(analyticsObject.headers,xAxisType)] === xAxisUid ){
        num = parseFloat(value[self.getTitleIndex(analyticsObject.headers,'value')]);
      }
    }
    return num;
  }

  /**
   *
   * @param analyticsObjectHeaders
   * @param name
   * @returns {number}
     */
  getTitleIndex(analyticsObjectHeaders,name){
    let index = 0;let counter = 0;
    analyticsObjectHeaders.forEach((header:any)=>{
      if(header.name === name){
        index = counter;
      }
      counter++;
    });
    return index;
  }

}
