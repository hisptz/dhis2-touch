import { Injectable } from '@angular/core';
import {ChartConfiguration} from '../../model/chart-configuration';
import {Visualization} from '../../model/visualization';
import {VisualizationServiceProvider} from "../visualization-service/visualization-service";
import {VisualizerServiceProvider} from "../visualizer-service/visualizer-service";
import * as _ from 'lodash';

/*
  Generated class for the ChartServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ChartServiceProvider {

  constructor(private visualizationService: VisualizationServiceProvider,
              private visualizer: VisualizerServiceProvider){}


  public getChartObjects(visualizationObject: Visualization, chartType: string = null): any {

    const visualizationObjectLayers = _.clone(visualizationObject.layers);

    if (visualizationObjectLayers.length === 0) {
      return {visualizationObject: visualizationObject, chartObjects: []};
    }

    const chartObjects = visualizationObjectLayers.map((layer, index) => {
      const newLayer = _.clone(layer);
      const renderId: string = visualizationObject.id + '_' + index;

      /**
       * Set renderId
       * @type {string}
       */
      if (!newLayer.settings.chartConfiguration) {
        return {id: newLayer.settings.id, content: null};
      }
      const newChartConfiguration: ChartConfiguration = _.clone(newLayer.settings.chartConfiguration);

      newChartConfiguration.renderId = renderId;

      /**
       * Include custom chart type if any
       */
      if (chartType != null) {
        newChartConfiguration.type = chartType;
      }

      let chartObject = null;
      if (newLayer.analytics) {
        if (newChartConfiguration.type === 'multipleAxis') {
          //TODO REMOVE THIS AND CENTRALIZE EVERYTHING IN NEW VISUALIZATION COMPONENT
          chartObject = this.visualizationService.drawChart(newLayer.analytics, newChartConfiguration);
          chartObject.chart.renderTo = renderId;
        } else {
          chartObject =  this.visualizer.drawChart(newLayer.analytics, newChartConfiguration)
        };
      }

      return {id: newLayer.settings.id, content: chartObject};
    });

    return {visualizationObject: visualizationObject, chartObjects: chartObjects}
  }

  getChartObject(analyticsObject: any, chartConfiguration: ChartConfiguration) {
    if (!analyticsObject) {
      return null;
    }
    let chartObject = null;
    if (chartConfiguration.type === 'multipleAxis') {
      chartObject = this.visualizationService.drawChart(analyticsObject, chartConfiguration);
      chartObject.chart.renderTo = chartConfiguration.renderId;
    } else {
      chartObject = this.visualizer.drawChart(analyticsObject, chartConfiguration);
    }
    return chartObject;
  }

  getChartConfiguration(visualizationDetails: any): ChartConfiguration[] {
    const chartConfigurations = [];
    const visualizationSettings = visualizationDetails.visualizationSettings;
    visualizationSettings.forEach(favoriteObject => {
      let chartType = favoriteObject.hasOwnProperty('type') ? favoriteObject.type.toLowerCase() : 'column';
      if (favoriteObject.useMultipleAxis) {
        chartType = 'multipleAxis';
      }
      const chartConfiguration = {
        renderId: '',
        type: chartType,
        title: favoriteObject.hasOwnProperty('displayName') ? favoriteObject.displayName : '',
        subtitle: favoriteObject.hasOwnProperty('subtitle') ? favoriteObject.subtitle : '',
        hideTitle: favoriteObject.hasOwnProperty('hideTitle') ? favoriteObject.hideTitle : true,
        hideSubtitle: favoriteObject.hasOwnProperty('hideSubtitle') ? favoriteObject.hideSubtitle : true,
        showData: favoriteObject.hasOwnProperty('showData') ? favoriteObject.showData : true,
        hideEmptyRows: favoriteObject.hasOwnProperty('hideEmptyRows') ? favoriteObject.hideEmptyRows : true,
        hideLegend: favoriteObject.hasOwnProperty('hideLegend') ? favoriteObject.hideLegend : true,
        cumulativeValues: favoriteObject.hasOwnProperty('cumulativeValues') ? favoriteObject.cumulativeValues : false,
        showLabels: true,
        sortOrder: favoriteObject.hasOwnProperty('sortOrder') ? favoriteObject.sortOrder : 0,
        percentStackedValues: favoriteObject.hasOwnProperty('percentStackedValues') ? favoriteObject.percentStackedValues : false,
        multiAxisTypes: favoriteObject.hasOwnProperty('selectedChartTypes') ? favoriteObject.selectedChartTypes : [],
        xAxisType: this._getAxisType('xAxisType', favoriteObject),
        yAxisType: this._getAxisType('yAxisType', favoriteObject),
      };
      chartConfigurations.push({id: favoriteObject.id, chartConfiguration: chartConfiguration})
    });
    visualizationDetails.chartConfigurations = chartConfigurations;
    return visualizationDetails;
  }

  getChartConfiguration1(favoriteObject: any, renderId: string, visualizationLayouts: any): ChartConfiguration {
    const visualizationLayoutObject: any = _.find(visualizationLayouts, ['id', favoriteObject.id]);
    let chartType = favoriteObject.hasOwnProperty('type') ? favoriteObject.type.toLowerCase() : 'column';
    if (favoriteObject.useMultipleAxis) {
      chartType = 'multipleAxis';
    }
    return {
      renderId: renderId,
      type: chartType,
      title: favoriteObject.hasOwnProperty('displayName') ? favoriteObject.displayName : '',
      subtitle: favoriteObject.hasOwnProperty('subtitle') ? favoriteObject.subtitle : '',
      hideTitle: favoriteObject.hasOwnProperty('hideTitle') ? favoriteObject.hideTitle : true,
      hideSubtitle: favoriteObject.hasOwnProperty('hideSubtitle') ? favoriteObject.hideSubtitle : true,
      showData: favoriteObject.hasOwnProperty('showData') ? favoriteObject.showData : true,
      hideEmptyRows: favoriteObject.hasOwnProperty('hideEmptyRows') ? favoriteObject.hideEmptyRows : true,
      hideLegend: favoriteObject.hasOwnProperty('hideLegend') ? favoriteObject.hideLegend : true,
      cumulativeValues: favoriteObject.hasOwnProperty('cumulativeValues') ? favoriteObject.cumulativeValues : false,
      showLabels: true,
      sortOrder: favoriteObject.hasOwnProperty('sortOrder') ? favoriteObject.sortOrder : 0,
      percentStackedValues: favoriteObject.hasOwnProperty('percentStackedValues') ? favoriteObject.percentStackedValues : false,
      multiAxisTypes: favoriteObject.hasOwnProperty('selectedChartTypes') ? favoriteObject.selectedChartTypes : [],
      xAxisType: visualizationLayoutObject ? _.map(visualizationLayoutObject.layout.rows, (row : any) => {
        return row.value
      })[0] : 'dx',
      yAxisType: visualizationLayoutObject ? _.map(visualizationLayoutObject.layout.columns, (column : any) => {
        return column.value
      })[0] : 'ou'
    };
  }

  private _getAxisType(axis, favoriteObject) {
    let axisType = '';
    if (axis === 'xAxisType') {
      if (favoriteObject.hasOwnProperty('rows') && favoriteObject.rows.length > 0) {
        axisType = favoriteObject.rows[0].dimension;
      } else {
        axisType = 'dx'
      }
    } else {
      if (favoriteObject.hasOwnProperty('columns') && favoriteObject.columns.length > 0) {
        axisType = favoriteObject.columns[0].dimension;
      } else {
        axisType = 'ou'
      }
    }
    return axisType;
  }




}
