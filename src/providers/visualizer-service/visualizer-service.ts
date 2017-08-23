import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import {ChartConfiguration} from '../../model/chart-configuration';
import {AnalyticsHeader, AnalyticsMetadata, AnalyticsObject} from '../../model/analytics-object';

/*
  Generated class for the VisualizerServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class VisualizerServiceProvider {

  constructor() {
  }

  drawChart(incomingAnalyticsObject: any, chartConfiguration: ChartConfiguration): any {
    // TODO MOVE THIS LOGIC TO ANALYTICS OBJECT IN THE FUTURE
    const analyticsObject = this._sanitizeAnalyticsBasedOnConfiguration(
      this._standardizeIncomingAnalytics(incomingAnalyticsObject),
      chartConfiguration
    );

    /**
     * Get generic chart object attributes
     * @type {{chart: any; title: any; subtitle: any; credits: any; colors: any[]; plotOptions: {}; tooltip: any; exporting: any}}
     */
    let chartObject: any = {
      chart: this._getChartAttributeOptions(chartConfiguration),
      title: this._getChartTitleObject(chartConfiguration),
      subtitle: this._getChartSubtitleObject(chartConfiguration),
      credits: this._getChartCreditsOptions(),
      colors: this._getChartColors(),
      plotOptions: this._getPlotOptions(chartConfiguration),
      tooltip: this._getTooltipOptions(chartConfiguration),
      exporting: this._getChartExportingOptions()
    };

    /**
     * Extend chart options depending on type
     */

    switch (chartConfiguration.type) {
      case 'radar':
        chartObject = this._extendSpiderWebChartOptions(chartObject, analyticsObject, chartConfiguration);
        break;
      case 'solidgauge':
        chartObject = this._extendSolidGaugeChartOptions(chartObject, analyticsObject, chartConfiguration);
        break;
      case 'gauge':
        const newChartConfiguration = _.clone(chartConfiguration);
        newChartConfiguration.type = 'solidgauge';
        chartObject = this._extendSolidGaugeChartOptions(chartObject, analyticsObject, newChartConfiguration);
        break;
      case 'pie':
        chartObject = this._extendPieChartOptions(chartObject, analyticsObject, chartConfiguration);
        break;
      case 'multipleAxis':
        // console.log('multipleAxis');
        break;
      case 'combined':
        console.log('combined');
        break;
      default :
        chartObject = this._extendOtherChartOptions(chartObject, analyticsObject, chartConfiguration);
        break
    }

    // console.log(analyticsObject, configuration);
    return chartObject
  }

  private _extendSpiderWebChartOptions(initialChartObject: any, analyticsObject: any, chartConfiguration: ChartConfiguration) {
    const newChartObject = _.clone(initialChartObject);

    const xAxisCategories: any[] = this._getAxisItems(analyticsObject, chartConfiguration.xAxisType, true);
    const yAxisSeriesItems: any[] = this._getAxisItems(analyticsObject, chartConfiguration.yAxisType);

    /**
     * Get pane attribute
     */
    newChartObject.pane = _.assign({}, this._getPaneOptions(chartConfiguration.type));

    /**
     * Get y axis options
     */
    newChartObject.yAxis = _.assign({}, this._getYAxisOptions(chartConfiguration));


    /**
     * Sort the corresponding series
     */
    const sortedSeries = this._getSortableSeries(this._getChartSeries(
      analyticsObject,
      xAxisCategories,
      yAxisSeriesItems,
      chartConfiguration
    ), chartConfiguration.cumulativeValues ? -1 : chartConfiguration.sortOrder);

    /**
     * Rearange series based on some chart type
     */
    const rearrangedSeries = this._getRearrangedSeries(sortedSeries, chartConfiguration.type);

    /**
     * Get series
     */
    newChartObject.series = _.assign([], rearrangedSeries);

    /**
     * Get refined x axis options
     */
    newChartObject.xAxis = this._getXAxisOptions(
      this._getRefinedXAxisCategories(newChartObject.series),
      chartConfiguration.type
    );

    return newChartObject;
  }

  private _extendPieChartOptions(initialChartObject: any, analyticsObject: any, chartConfiguration: ChartConfiguration) {
    const newChartObject = _.clone(initialChartObject);

    const xAxisCategories: any[] = this._getAxisItems(analyticsObject, chartConfiguration.xAxisType, true);
    const yAxisSeriesItems: any[] = this._getAxisItems(analyticsObject, chartConfiguration.yAxisType);

    /**
     * Sort the corresponding series
     */
    const sortedSeries = this._getSortableSeries(this._getChartSeries(
      analyticsObject,
      xAxisCategories,
      yAxisSeriesItems,
      chartConfiguration
    ), chartConfiguration.sortOrder);

    if (yAxisSeriesItems.length > 1) {

      /**
       * Get parent series for drill down
       * @type {{name: string; colorByPoint: boolean; data: any}[]}
       */
      newChartObject.series = this._getDrilldownParentSeries(
        sortedSeries,
        yAxisSeriesItems,
        chartConfiguration.yAxisType
      );

      /**
       * Get drill down series
       * @type {{series: any}}
       */
      newChartObject.drilldown = {
        series: sortedSeries
      }

    } else {
      /**
       * Get series
       */
      newChartObject.series = _.assign([], sortedSeries);
    }

    return newChartObject;
  }

  private _getDrilldownParentSeries(drilldownSeries: any[], yAxisItems: any[], parentType: string) {
    /**
     * Get series name
     * @type {string | string | string | string}
     */
      // todo find readable names for parent types that are not data, period or organisation unit
    const seriesName = parentType === 'pe' ? 'Period' :
      parentType === 'dx' ? 'Data' :
        parentType === 'ou' ? 'Organisation unit' : 'Categories';

    const seriesData = _.map(yAxisItems, yAxisObject => {
      return {
        name: yAxisObject.name,
        drilldown: yAxisObject.id,
        y: this._deduceDrilldownParentDataFromChildrenSeries(drilldownSeries, yAxisObject.id)
      }
    });

    const newSeriesObject = {
      name: seriesName,
      colorByPoint: true,
      data: seriesData
    };
    return [newSeriesObject];
  }

  private _deduceDrilldownParentDataFromChildrenSeries(drilldownSeries: any[], parentId: string): number {
    let parentData = 0;
    const correspondingSeriesObject = _.find(drilldownSeries, ['id', parentId]);

    if (correspondingSeriesObject) {
      parentData = _.reduce(_.map(correspondingSeriesObject.data, (data : any) => data.y), (sum : any, n) => {
        const newNumber = !isNaN(n) ? parseInt(n, 10) : 0;
        return parseInt(sum, 10) + newNumber;
      });
    }
    return parentData;
  }

  private _extendSolidGaugeChartOptions(initialChartObject: any, analyticsObject: any, chartConfiguration: ChartConfiguration) {
    // todo make gauge chart more understanble in analyisis
    const newChartObject = _.clone(initialChartObject);
    const xAxisCategories: any[] = this._getAxisItems(analyticsObject, chartConfiguration.xAxisType, true);
    const yAxisSeriesItems: any[] = this._getAxisItems(analyticsObject, chartConfiguration.yAxisType);

    /**
     * Get pane options
     */
    newChartObject.pane = this._getPaneOptions(chartConfiguration.type);

    /**
     * Get y axis options
     */
    newChartObject.yAxis = _.assign({}, this._getYAxisOptions(chartConfiguration));

    /**
     * Sort the corresponding series
     */
    const sortedSeries = this._getSortableSeries(this._getChartSeries(
      analyticsObject,
      xAxisCategories,
      yAxisSeriesItems,
      chartConfiguration
    ), chartConfiguration.cumulativeValues ? -1 : chartConfiguration.sortOrder);

    /**
     * Rearange series based on some chart type
     */
    const rearrangedSeries = this._getRearrangedSeries(sortedSeries, chartConfiguration.type);

    /**
     * Get series
     */
    newChartObject.series = _.assign([], rearrangedSeries);

    return newChartObject;
  }

  private _extendStackedChartOptions(initialChartObject: any, analyticsObject: any, chartConfiguration: ChartConfiguration) {
    const newChartObject = _.cloneDeep(initialChartObject);
    return newChartObject;
  }

  private _extendOtherChartOptions(initialChartObject: any, analyticsObject: any, chartConfiguration: ChartConfiguration): any {
    const newChartObject = _.clone(initialChartObject);

    const xAxisCategories: any[] = this._getAxisItems(analyticsObject, chartConfiguration.xAxisType, true);
    const yAxisSeriesItems: any[] = this._getAxisItems(analyticsObject, chartConfiguration.yAxisType);
    /**
     * Get y axis options
     */
    newChartObject.yAxis = _.assign({}, this._getYAxisOptions(chartConfiguration));

    /**
     * Sort the corresponding series
     */
    const sortedSeries = this._getSortableSeries(this._getChartSeries(
      analyticsObject,
      xAxisCategories,
      yAxisSeriesItems,
      chartConfiguration
    ), chartConfiguration.cumulativeValues ? -1 : chartConfiguration.sortOrder);

    /**
     * Rearange series based on some chart type
     */
    const rearrangedSeries = this._getRearrangedSeries(sortedSeries, chartConfiguration.type);

    /**
     * Get series
     */
    newChartObject.series = _.assign([], rearrangedSeries);

    /**
     * Get refined x axis options
     */
    newChartObject.xAxis = this._getXAxisOptions(
      this._getRefinedXAxisCategories(newChartObject.series),
      chartConfiguration.type
    );

    return newChartObject;
  }

  private _getRearrangedSeries(series: any[], chartType: string) {
    // todo find best way to rearrange charts
    // return _.indexOf(chartType, 'stacked') !== -1 || chartType === 'area' ? _.reverse(series) : series;
    return series;
  }

  private _getRefinedXAxisCategories(series: any[]) {
    let newCategories: any[] = [];
    // todo find a way to effectively merge categories from each data
    if (series) {
      const seriesDataObjects = _.map(series, (seriesObject: any) => seriesObject.data);

      if (seriesDataObjects) {
        const seriesCategoryNamesArray = _.map(seriesDataObjects, (seriesData) => {
          return _.map(seriesData, (data : any) => {
            return data.name;
          })
        });

        if (seriesCategoryNamesArray) {
          newCategories = _.assign([], seriesCategoryNamesArray[0]);
        }
      }
    }

    return newCategories;
  }


  private _getSortableSeries(series, sortOrder) {
    let newSeries = _.clone(series);
    let seriesCategories = [];
    if (sortOrder === 1) {
      newSeries = _.map(series, (seriesObject : any, seriesIndex) => {
        const newSeriesObject : any = _.clone(seriesObject);

        if (seriesIndex === 0) {
          newSeriesObject.data = _.assign([], _.reverse(_.sortBy(seriesObject.data, ['y'])));

          /**
           * Get series categories for the first series
           */
          seriesCategories = _.map(newSeriesObject.data, (seriesData : any) => seriesData.name)
        } else {
          if (seriesCategories) {
            newSeriesObject.data = _.map(seriesCategories, seriesCategory => _.find(seriesObject.data, ['name', seriesCategory]))
          }
        }

        return newSeriesObject;
      })
    } else if (sortOrder === -1) {
      newSeries = _.map(series, (seriesObject : any, seriesIndex) => {
        const newSeriesObject : any = _.clone(seriesObject);
        if (seriesIndex === 0) {
          newSeriesObject.data = _.assign([], _.sortBy(seriesObject.data, ['y']));

          /**
           * Get series categories for the first series
           */
          seriesCategories = _.map(newSeriesObject.data, (seriesData : any) => seriesData.name)
        } else {
          if (seriesCategories) {
            newSeriesObject.data = _.map(seriesCategories, seriesCategory => _.find(seriesObject.data, ['name', seriesCategory]))
          }
        }
        return newSeriesObject;
      })
    }
    return newSeries;
  }

  private _getChartSeries(analyticsObject: AnalyticsObject,
                          xAxisItems: any[],
                          yAxisItems: any[],
                          chartConfiguration: ChartConfiguration) {
    const series: any[] = [];
    if (yAxisItems) {
      yAxisItems.forEach((yAxisItem, yAxisIndex) => {
        series.push({
          name: yAxisItem.name,
          id: yAxisItem.id,
          index: yAxisIndex,
          turboThreshold: 0,
          pointPlacement: chartConfiguration.type === 'radar' ? 'on' : undefined,
          data: this._getSeriesData(
            analyticsObject,
            chartConfiguration,
            yAxisItem.id,
            xAxisItems
          ),
          type: this._getAllowedChartType(chartConfiguration.type)
        })
      })
    }
    return series;
  }

  private _getSeriesData(analyticsObject: AnalyticsObject,
                         chartConfiguration: ChartConfiguration,
                         yAxisItemId: string,
                         xAxisItems: any[]) {
    const data: any[] = [];
    /**
     * Get index to locate data for y axis
     */
    const yAxisItemIndex = _.findIndex(
      analyticsObject.headers,
      _.find(analyticsObject.headers, ['name', chartConfiguration.yAxisType]
      ));
    if (xAxisItems) {
      xAxisItems.forEach(xAxisItem => {
        /**
         * Get index to locate data for x axis
         */
        const xAxisItemIndex = _.findIndex(
          analyticsObject.headers,
          _.find(analyticsObject.headers, ['name', chartConfiguration.xAxisType]
          ));

        /**
         * Get index for value attribute to get the data
         */
        const dataIndex = _.findIndex(
          analyticsObject.headers,
          _.find(analyticsObject.headers, ['name', 'value']
          ));
        /**
         * Get the required data depending on xAxis and yAxis
         */
        const seriesValue = this._getSeriesValue(
          analyticsObject.rows,
          yAxisItemIndex,
          yAxisItemId,
          xAxisItemIndex,
          xAxisItem.id,
          dataIndex
        );

        data.push({
          id: xAxisItem.id,
          name: xAxisItem.name,
          dataLabels: this._getDataLabelsOptions(chartConfiguration),
          y: seriesValue
        });
      })
    }
    return data;
  }

  private _getSeriesValue(analyticsRows, yAxisItemIndex, yAxisItemId, xAxisItemIndex, xAxisItemId, dataIndex) {
    let seriesValue: any = null;
    for (const row of analyticsRows) {
      if (row[yAxisItemIndex] === yAxisItemId && row[xAxisItemIndex] === xAxisItemId) {
        seriesValue = parseFloat(row[dataIndex]);
        break;
      }
    }

    return seriesValue;
  }

  private _getDataLabelsOptions(chartConfiguration: ChartConfiguration) {
    let dataLabels = null;

    switch (chartConfiguration.type) {
      case 'pie':
        dataLabels = {
          enabled: chartConfiguration.showData,
          format: '{point.name}<br/> <b>{point.y}</b> ( {point.percentage:.1f} % )'
        };
        break;
      default:
        dataLabels = {
          enabled: chartConfiguration.showData
        };
        break;
    }

    return dataLabels;
  }

  private _getAxisItems(analyticsObject: any, axisType: string, isCategory: boolean = false) {
    let items: any[] = [];
    const metadataNames = analyticsObject.metaData.names;
    const metadataDimensions = analyticsObject.metaData.dimensions;
    const itemKeys = metadataDimensions[axisType];
    if (itemKeys) {
      items = _.map(itemKeys, (itemKey: any) => {
        return {
          id: itemKey,
          name: metadataNames[itemKey]
        };
      })
    }

    // todo find best way to remove this hardcoding
    if (isCategory && axisType === 'pe') {
      return _.reverse(items);
    }
    return items;
  }

  private _getChartTitleObject(chartConfiguration: ChartConfiguration): any {

    return null;
  }

  private _getChartSubtitleObject(chartConfiguration: ChartConfiguration): any {

    if (chartConfiguration.hideSubtitle) {
      return null;
    }
    return {
      text: chartConfiguration.subtitle
    };
  }

  private _getChartCreditsOptions(): any {
    return {
      enabled: false
    };
  }

  private _getChartColors(): any[] {
    return [
      '#A9BE3B', '#558CC0', '#D34957', '#FF9F3A',
      '#968F8F', '#B7409F', '#FFDA64', '#4FBDAE',
      '#B78040', '#676767', '#6A33CF', '#4A7833',
      '#434348', '#7CB5EC', '#F7A35C', '#F15C80'
    ];
  }

  private _getChartExportingOptions(): any {
    return {
      buttons: {
        contextButton: {
          enabled: false
        }
      }
    };
  }

  private _getChartLabelOptions(chartConfiguration: ChartConfiguration) {
    return {}
  }

  private _getTooltipOptions(chartConfiguration: ChartConfiguration) {
    const tooltipChartType = this._getAllowedChartType(chartConfiguration.type);
    let tooltipObject: any = {};

    if (tooltipChartType) {
      switch (tooltipChartType) {
        case 'solidgauge':
          tooltipObject = {
            enabled: false,
          };
          break;
        case 'pie':
          tooltipObject = {
            pointFormat: '{series.name}<br/> <b>{point.y}</b> ( {point.percentage:.1f} % )'
          };
          break;
        default:
          switch (chartConfiguration.type) {
            case 'stacked_column':
              tooltipObject = {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
              };
              break;
            default:
              tooltipObject = {
                enabled: true
              };
              break;
          }
          break;
      }
    }
    return tooltipObject;
  }

  private _getPlotOptions(chartConfiguration: ChartConfiguration) {
    const plotOptionChartType = this._getAllowedChartType(chartConfiguration.type);
    const plotOptions = {};

    if (plotOptionChartType) {
      switch (plotOptionChartType) {
        case 'solidgauge':
          plotOptions[plotOptionChartType] = {
            dataLabels: {
              y: 5,
              borderWidth: 0,
              useHTML: true
            }
          };
          break;
        case 'gauge':
          plotOptions[plotOptionChartType] = {
            dataLabels: {
              y: 5,
              borderWidth: 0,
              useHTML: true
            }
          };
          break;
        case 'pie':
          plotOptions[plotOptionChartType] = {
            borderWidth: 0,
            allowPointSelect: true,
            cursor: 'pointer',
            showInLegend: !chartConfiguration.hideLegend
          };
          break;
        default:
          plotOptions[plotOptionChartType] = {
            showInLegend: !chartConfiguration.hideLegend
          };

          /**
           * Set attributes for stacked charts
           */
          if (chartConfiguration.type === 'stacked_column' ||
            chartConfiguration.type === 'stacked_bar' ||
            chartConfiguration.type === 'area') {
            plotOptions[plotOptionChartType].stacking = chartConfiguration.percentStackedValues ? 'percent' : 'normal';
          }
          break;
      }
    }
    return plotOptions;
  }

  private _getChartAttributeOptions(chartConfiguration: ChartConfiguration) {
    const chartOptions: any = {
      renderTo: chartConfiguration.renderId,
      type: this._getAllowedChartType(chartConfiguration.type),
      backgroundColor : "#F4F4F4"
    };

    /**
     * Extend Options depending on chart type
     */
    if (chartConfiguration.type === 'pie') {
      chartOptions.plotBackgroundColor = null;
      chartOptions.plotBorderWidth = null;
      chartOptions.plotShadow = false;
    } else if (chartConfiguration.type === 'radar') {
      chartOptions.polar = true;
    }

    return chartOptions;
  }

  private _getPaneOptions(chartType: string) {
    let paneOptions = {};

    switch(chartType) {
      case 'radar':
        paneOptions = _.assign({}, {
          size: '80%'
        });
        break;
      default:
        paneOptions = _.assign({}, {
          center: ['50%', '85%'],
          size: '140%',
          startAngle: -90,
          endAngle: 90,
          background: {
            backgroundColor: '#EEE',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
          }
        });
        break;
    }
    return paneOptions;
  }

  private _getLegendOptions() {
    return {
      reversed: true
    }
  }

  private _getXAxisOptions(xAxisCategories: any[], chartType) {
    let xAxisOptions = {};

    switch(chartType) {
      case 'radar':
        xAxisOptions = _.assign({}, {
          categories: xAxisCategories,
          tickmarkPlacement: 'on',
          lineWidth: 0
        });
        break;
      default:
        xAxisOptions = _.assign({}, {
          categories: xAxisCategories,
          labels: {
            rotation: xAxisCategories.length <= 5 ? 0 : -45,
            style: {'color': '#000000', 'fontWeight': 'normal'}
          }
        });
        break;
    }

    return xAxisOptions;
  }

  private _getYAxisOptions(chartConfiguration: ChartConfiguration) {
    let yAxis = {
      min: 0,
      title: {
        text: ''
      }
    };

    /**
     * Get more options depending on chart type
     */
    switch (chartConfiguration.type) {
      case 'radar':
        yAxis['gridLineInterpolation'] = 'polygon';
        yAxis['lineWidth'] = 0;
        break;
      case 'solidgauge':
        yAxis['lineWidth'] = 0;
        yAxis['labels'] = {
          y: 16
        };
        yAxis['max'] = 100;
        break;
      case 'stacked_column':
        yAxis['stackLabels'] = {
          enabled: false,
          style: {
            fontWeight: 'bold'
          }
        };
        break;
      default:
        yAxis['labels'] = {
          style: {'color': '#000000', 'fontWeight': 'bold'}
        };
        break;
    }
    return yAxis;
  }

  private _getAllowedChartType(chartType: string): string {
    let newChartType = '';
    switch(chartType) {
      case 'radar':
        newChartType = 'line';
        break;
      default:
        const splitedChartType: any[] = chartType.split('_');
        newChartType = splitedChartType.length > 1 ? splitedChartType[1] : splitedChartType[0];
        break;
    }
    return newChartType;
  }

  private _sanitizeAnalyticsBasedOnConfiguration(analyticsObject: AnalyticsObject, chartConfiguration: ChartConfiguration) {
    let newAnalyticsObject = _.clone(analyticsObject);

    if (chartConfiguration.cumulativeValues) {
      newAnalyticsObject = _.assign({}, this._mapAnalyticsToCumulativeFormat(
        analyticsObject, chartConfiguration.xAxisType, chartConfiguration.yAxisType));
    }

    return newAnalyticsObject;
  }

  private _mapAnalyticsToCumulativeFormat(analyticsObject: AnalyticsObject, xAxisType, yAxisType) {
    const newAnalyticsObject = _.clone(analyticsObject);

    if (analyticsObject) {
      const yAxisDimensionArray = analyticsObject.metaData.dimensions[yAxisType];
      const xAxisDimensionArray = _.reverse(analyticsObject.metaData.dimensions[xAxisType]);
      const yAxisDimensionIndex = _.findIndex(analyticsObject.headers, _.find(analyticsObject.headers, ['name', yAxisType]));
      const xAxisDimensionIndex = _.findIndex(analyticsObject.headers, _.find(analyticsObject.headers, ['name', xAxisType]));
      const dataValueIndex = _.findIndex(analyticsObject.headers, _.find(analyticsObject.headers, ['name', 'value']));
      const newRows: any[] = [];
      yAxisDimensionArray.forEach(yAxisDimensionValue => {
        let initialValue = 0;
        xAxisDimensionArray.forEach(xAxisDimensionValue => {
          analyticsObject.rows.forEach((row) => {
            if (row[yAxisDimensionIndex] === yAxisDimensionValue && row[xAxisDimensionIndex] === xAxisDimensionValue) {
              initialValue += parseInt(row[dataValueIndex], 10);
              const newRow = _.clone(row);
              newRow[dataValueIndex] = initialValue;
              newRows.push(newRow);
            }
          })
        })
      });
      newAnalyticsObject.rows = _.assign([], newRows);
    }
    return newAnalyticsObject;
  }

  private _standardizeIncomingAnalytics(analyticsObject: any) {
    const sanitizedAnalyticsObject: AnalyticsObject = {
      headers: [],
      metaData: {
        names: null,
        dimensions: null
      },
      rows: []
    };

    if (analyticsObject) {
      /**
       * Check headers
       */
      if (analyticsObject.headers) {
        analyticsObject.headers.forEach((header: any) => {
          try {
            const newHeader: AnalyticsHeader = header;
            sanitizedAnalyticsObject.headers.push(newHeader);
          } catch (e) {
            console.warn('Invalid header object')
          }
        });
      }

      /**
       * Check metaData
       */
      if (analyticsObject.metaData) {

        try {
          const sanitizedMetadata: AnalyticsMetadata = this._getSanitizedAnalyticsMetadata(analyticsObject.metaData);
          sanitizedAnalyticsObject.metaData = sanitizedMetadata;
        } catch (e) {
          console.warn('Invalid metadata object')
        }
      }

      /**
       * Check rows
       */
      if (analyticsObject.rows) {
        sanitizedAnalyticsObject.rows = analyticsObject.rows;
      }

    }

    return sanitizedAnalyticsObject;
  }

  private _getSanitizedAnalyticsMetadata(analyticMetadata: any) {
    const sanitizedMetadata: AnalyticsMetadata = {
      names: null,
      dimensions: null
    };

    if (analyticMetadata) {

      /**
       * Get metadata names
       */
      if (analyticMetadata.names) {
        sanitizedMetadata.names = analyticMetadata.names;
      } else if (analyticMetadata.items) {
        const metadataItemsKeys = _.keys(analyticMetadata.items);
        const metadataNames: any = {};
        if (metadataItemsKeys) {
          metadataItemsKeys.forEach(metadataItemKey => {
            metadataNames[metadataItemKey] = analyticMetadata.items[metadataItemKey].name;
          })
        }
        sanitizedMetadata.names = metadataNames;
      }

      /**
       * Get metadata dimensions
       */
      if (analyticMetadata.dimensions) {
        sanitizedMetadata.dimensions = analyticMetadata.dimensions;
      } else {
        const metadataKeys = _.keys(analyticMetadata);
        const metadataDimensions: any = {};
        if (metadataKeys) {
          metadataKeys.forEach(metadataKey => {
            if (metadataKey !== 'names') {
              metadataDimensions[metadataKey] = analyticMetadata[metadataKey];
            }
          });
        }
        sanitizedMetadata.dimensions = metadataDimensions;
      }
    }

    return sanitizedMetadata;
  }

}
