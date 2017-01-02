import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';

/*
 Generated class for the ChartVisualizer provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class ChartVisualizer {

  public chartObjects : any;

  constructor() {
    this.setChartsObjects();
  }

  getChartObject(analyticsObject, xAxisType,xAxisItems,yAxisType,yAxisItems,title,chartType){
    let self = this;
    let chartObject = this.chartObjects.defaultChartObject;
    if(chartType){
      chartObject.options.chart.type = chartType;
    }
    chartObject.options.title = title;
    let metaDataObject = self.prepareCategories(analyticsObject, xAxisType,xAxisItems,yAxisType,yAxisItems);
    metaDataObject.xAxisItems.forEach((xAxisItem)=>{
      //chartObject.options.xAxis.categories.push(xAxisItem.name);

    });
    alert(title);
    metaDataObject.xAxisItems.forEach((xAxisItem:any)=>{
      let data = [];let self = this;
      metaDataObject.yAxisItems.forEach((yAxisItem:any)=>{
        let number = self.getDataValue(analyticsObject,xAxisType,xAxisItem.uid,yAxisType,yAxisItem.uid);
        data.push(number);
      });
      chartObject.options.series.push({
        name : xAxisItem.name,
        data: data
      })
    });
    alert(JSON.stringify(chartObject));
    return chartObject;
  }

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

  getMetadataArray(analyticsObject,metadataType){
    let metadataArray = [];
    if(analyticsObject.metaData && analyticsObject.metaData[metadataType]){
      metadataArray = analyticsObject.metaData[metadataType];
    }
    return metadataArray;
  }

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


  /**
   * setter for define all charts objects
   */
  setChartsObjects(){
    this.chartObjects = {
      defaultChartObject : {
        options : {
          title: {
            text: ''
          },
          chart: { type: "", zoomType :'x' },
          //xAxis: {
          //  categories: [],
          //  labels: {
          //    rotation: -90,
          //    style: {'color': '#000000', 'fontWeight': 'normal'}
          //  }
          //},
          series: []
        }


      }
    }
  }

}
