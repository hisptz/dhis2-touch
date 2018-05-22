import {Injectable} from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class ChartService {
  constructor() {
  }

  drawChart(incomingAnalyticsObject: any, chartConfiguration: any): any {
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
      // legend: this._getLegendOptions(chartConfiguration)
    };

    /**
     * Extend chart options depending on type
     */

    switch (chartConfiguration.type) {
      case 'radar':
        chartObject = this._extendSpiderWebChartOptions(
          chartObject,
          analyticsObject,
          chartConfiguration
        );
        break;
      case 'solidgauge':
        chartObject = this._extendSolidGaugeChartOptions(
          chartObject,
          analyticsObject,
          chartConfiguration
        );
        break;
      case 'gauge':
        const newChartConfiguration = _.clone(chartConfiguration);
        newChartConfiguration.type = 'solidgauge';
        chartObject = this._extendSolidGaugeChartOptions(
          chartObject,
          analyticsObject,
          newChartConfiguration
        );
        break;
      case 'pie':
        chartObject = this._extendPieChartOptions(
          chartObject,
          analyticsObject,
          chartConfiguration
        );
        break;
      case 'combined':
        console.log('combined');
        break;
      default:
        chartObject = this._extendOtherChartOptions(
          chartObject,
          analyticsObject,
          chartConfiguration
        );
        break;
    }

    // console.log(analyticsObject, configuration);
    return chartObject;
  }

  private _extendSpiderWebChartOptions(initialChartObject: any,
                                       analyticsObject: any,
                                       chartConfiguration: any) {
    const newChartObject = _.clone(initialChartObject);
    const yAxisSeriesItems: any[] = this._getAxisItems(
      analyticsObject,
      chartConfiguration.yAxisType
    );

    /**
     * Get pane attribute
     */
    newChartObject.pane = _.assign(
      {},
      this._getPaneOptions(chartConfiguration.type)
    );

    /**
     * Get y axis options
     */
    newChartObject.yAxis = _.assign(
      [],
      this._getYAxisOptions(chartConfiguration)
    );

    /**
     * Sort the corresponding series
     */
    const sortedSeries = this._getSortableSeries(
      this._getChartSeriesNew(
        analyticsObject,
        this._getAxisItemsNew(
          analyticsObject,
          chartConfiguration.xAxisType,
          true
        ),
        yAxisSeriesItems,
        chartConfiguration
      ),
      chartConfiguration.cumulativeValues ? -1 : chartConfiguration.sortOrder
    );

    /**
     * Rearange series based on some chart type
     */
    const rearrangedSeries = this._getRearrangedSeries(
      sortedSeries,
      chartConfiguration.type
    );

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

  private _extendPieChartOptions(initialChartObject: any,
                                 analyticsObject: any,
                                 chartConfiguration: any) {
    const newChartObject = _.clone(initialChartObject);
    const yAxisSeriesItems: any[] = this._getAxisItems(
      analyticsObject,
      chartConfiguration.yAxisType
    );

    /**
     * Sort the corresponding series
     */
    const sortedSeries = this._getSortableSeries(
      this._getChartSeriesNew(
        analyticsObject,
        this._getAxisItemsNew(
          analyticsObject,
          chartConfiguration.xAxisType,
          true
        ),
        yAxisSeriesItems,
        chartConfiguration
      ),
      chartConfiguration.sortOrder
    );

    const sanitizedSeries = sortedSeries.map(series => {
      series.data = series.data.map(dataObject => {
        if (dataObject.y === null) {
          dataObject.y = 0;
        }
        return dataObject;
      });
      return series;
    });

    if (yAxisSeriesItems.length > 1) {
      /**
       * Get parent series for drill down
       * @type {{name: string; colorByPoint: boolean; data: any}[]}
       */
      newChartObject.series = this._getDrilldownParentSeries(
        sanitizedSeries,
        yAxisSeriesItems,
        chartConfiguration.yAxisType
      );

      /**
       * Get drill down series
       * @type {{series: any}}
       */
      newChartObject.drilldown = {
        series: sanitizedSeries
      };
    } else {
      /**
       * Get series
       */
      newChartObject.series = _.assign([], sanitizedSeries);
    }

    return newChartObject;
  }

  private _getDrilldownParentSeries(drilldownSeries: any[],
                                    yAxisItems: any[],
                                    parentType: string) {
    /**
     * Get series name
     * @type {string | string | string | string}
     */
      // todo find readable names for parent types that are not data, period or organisation unit
    const seriesName =
        parentType === 'pe'
          ? 'Period'
          : parentType === 'dx'
          ? 'Data'
          : parentType === 'ou' ? 'Organisation unit' : 'Categories';

    const seriesData = _.map(yAxisItems, yAxisObject => {
      return {
        name: yAxisObject.name,
        drilldown: yAxisObject.id,
        y: this._deduceDrilldownParentDataFromChildrenSeries(
          drilldownSeries,
          yAxisObject.id
        )
      };
    });

    const newSeriesObject = {
      name: seriesName,
      colorByPoint: true,
      data: seriesData
    };
    return [newSeriesObject];
  }

  private _deduceDrilldownParentDataFromChildrenSeries(drilldownSeries: any[],
                                                       parentId: string): number {
    let parentData = 0;
    const correspondingSeriesObject = _.find(drilldownSeries, ['id', parentId]);

    if (correspondingSeriesObject) {
      parentData = _.reduce(
        _.map(correspondingSeriesObject.data, data => data.y),
        (sum, n) => {
          const newNumber = !isNaN(n) ? parseInt(n, 10) : 0;
          return parseInt(sum, 10) + newNumber;
        }
      );
    }
    return parentData;
  }

  private _extendSolidGaugeChartOptions(initialChartObject: any,
                                        analyticsObject: any,
                                        chartConfiguration: any) {
    // todo make gauge chart more understanble in analyisis
    const newChartObject = _.clone(initialChartObject);
    const yAxisSeriesItems: any[] = this._getAxisItems(
      analyticsObject,
      chartConfiguration.yAxisType
    );

    /**
     * Get pane options
     */
    newChartObject.pane = this._getPaneOptions(chartConfiguration.type);

    /**
     * Get y axis options
     */
    newChartObject.yAxis = _.assign(
      [],
      this._getYAxisOptions(chartConfiguration)
    );

    /**
     * Sort the corresponding series
     */
    const sortedSeries = this._getSortableSeries(
      this._getChartSeriesNew(
        analyticsObject,
        this._getAxisItemsNew(
          analyticsObject,
          chartConfiguration.xAxisType,
          true
        ),
        yAxisSeriesItems,
        chartConfiguration
      ),
      chartConfiguration.cumulativeValues ? -1 : chartConfiguration.sortOrder
    );

    /**
     * Rearange series based on some chart type
     */
    const rearrangedSeries = this._getRearrangedSeries(
      sortedSeries,
      chartConfiguration.type
    );

    /**
     * Get series
     */
    newChartObject.series = _.assign([], rearrangedSeries);

    return newChartObject;
  }

  private _extendOtherChartOptions(initialChartObject: any,
                                   analyticsObject: any,
                                   chartConfiguration: any): any {
    const newChartObject = _.clone(initialChartObject);

    const yAxisSeriesItems: any[] = this._getAxisItems(
      analyticsObject,
      chartConfiguration.yAxisType
    );

    /**
     * Get y axis options
     */
    newChartObject.yAxis = _.assign(
      [],
      this._getYAxisOptions(chartConfiguration)
    );

    /**
     * Sort the corresponding series
     */
    const sortedSeries = this._getSortableSeries(
      this._getChartSeriesNew(
        analyticsObject,
        this._getAxisItemsNew(
          analyticsObject,
          chartConfiguration.xAxisType,
          true
        ),
        yAxisSeriesItems,
        chartConfiguration
      ),
      chartConfiguration.cumulativeValues ? -1 : chartConfiguration.sortOrder
    );

    /**
     * Rearange series based on some chart type
     */
    const rearrangedSeries = this._getRearrangedSeries(
      sortedSeries,
      chartConfiguration.type
    );

    /**
     * Update series with axis options
     */
    const seriesWithAxisOptions = this._updateSeriesWithAxisOptions(
      rearrangedSeries,
      chartConfiguration.multiAxisTypes
    );

    /**
     * Get series
     */
    newChartObject.series = _.assign([], seriesWithAxisOptions);

    /**
     * Get refined x axis options
     */

    newChartObject.xAxis = this._getXAxisOptions(
      this._getRefinedXAxisCategoriesNew(newChartObject.series),
      chartConfiguration.type
    );

    /**
     * Update colors by considering if series has data
     */
    const newColors: any[] = _.filter(
      _.map(
        newChartObject.series,
        seriesObject =>
          seriesObject.data[0] ? seriesObject.data[0].color : undefined
      ),
      color => color
    );

    if (newColors.length > 0) {
      newChartObject.colors = newColors;
    }

    return newChartObject;
  }

  private _updateSeriesWithAxisOptions(series: any[], multiAxisOptions: any[]) {
    return _.map(series, (seriesObject: any) => {
      const newSeriesObject = _.clone(seriesObject);
      const availableAxisOption: any = _.find(multiAxisOptions, [
        'id',
        newSeriesObject.id
      ]);
      if (availableAxisOption) {
        newSeriesObject.yAxis = availableAxisOption.axis === 'left' ? 0 : 1;
        newSeriesObject.type =
          availableAxisOption.type !== ''
            ? this._getAllowedChartType(availableAxisOption.type)
            : seriesObject.type;

        if (availableAxisOption.type === 'dotted') {
          newSeriesObject.lineWidth = 0;
          newSeriesObject.states = {
            hover: {
              enabled: false
            }
          };
        }

        /**
         *Also apply colors on chart
         */
        newSeriesObject.data = _.map(newSeriesObject.data, dataObject => {
          const newDataObject = _.clone(dataObject);
          if (availableAxisOption.color !== '') {
            newDataObject.color = availableAxisOption.color;
          }
          return newDataObject;
        });
      }
      return newSeriesObject;
    });
  }

  private _getRearrangedSeries(series: any[], chartType: string) {
    // todo find best way to rearrange charts
    // return _.indexOf(chartType, 'stacked') !== -1 || chartType === 'area' ? _.reverse(series) : series;
    return series;
  }

  private _getRefinedXAxisCategoriesNew(series: any[]) {
    let newCategories: any[] = [];
    // todo find a way to effectively merge categories from each data
    if (series) {
      const seriesDataObjects = _.map(
        series,
        (seriesObject: any) => seriesObject.data
      );

      if (seriesDataObjects) {
        const seriesCategoryNamesArray = _.map(
          seriesDataObjects,
          seriesData => {
            return _.map(seriesData, data => {
              const nameArray = data.name.split('_');
              const newCategoryArray = [];
              if (nameArray) {
                const reversedNameArray = _.reverse(nameArray);
                _.times(nameArray.length, (num: number) => {
                  if (num === 0) {
                    newCategoryArray.push({name: reversedNameArray[num]});
                  } else {
                    const parentCategory: any = _.find(newCategoryArray, [
                      'name',
                      reversedNameArray[num - 1]
                    ]);

                    if (parentCategory) {
                      const parentCategoryIndex = _.findIndex(
                        newCategoryArray,
                        parentCategory
                      );
                      let newChildrenCategories: any[] = parentCategory.categories
                        ? parentCategory.categories
                        : [];
                      newChildrenCategories = _.concat(
                        newChildrenCategories,
                        reversedNameArray[num]
                      );
                      parentCategory.categories = _.assign(
                        [],
                        newChildrenCategories
                      );

                      newCategoryArray[parentCategoryIndex] = parentCategory;
                    }
                  }
                });
              }
              return newCategoryArray[0];
            });
          }
        );

        if (seriesCategoryNamesArray) {
          const groupedCategoryNames = _.groupBy(
            seriesCategoryNamesArray[0],
            'name'
          );
          const categoryNameGroupKeys = _.map(seriesCategoryNamesArray[0], category => category.name);
          const sanitizedCategoryNames: any[] = [];
          _.forEach(categoryNameGroupKeys, (key: any) => {
            const categories = _.filter(
              _.map(groupedCategoryNames[key], (categoryObject: any) => {
                return categoryObject.categories
                  ? categoryObject.categories[0]
                  : null;
              }),
              (category: any) => category !== null
            );
            if (categories.length === 0) {
              sanitizedCategoryNames.push({name: key});
            } else {
              sanitizedCategoryNames.push({
                name: key,
                categories: categories
              });
            }
          });

          newCategories = _.assign([], sanitizedCategoryNames);
        }
      }
    }

    /**
     * Split categories array when applicable
     */

    return newCategories;
  }

  private _getRefinedXAxisCategories(series: any[]) {
    let newCategories: any[] = [];
    // todo find a way to effectively merge categories from each data
    if (series) {
      const seriesDataObjects = _.map(
        series,
        (seriesObject: any) => seriesObject.data
      );

      if (seriesDataObjects) {
        const seriesCategoryNamesArray = _.map(
          seriesDataObjects,
          seriesData => {
            return _.map(seriesData, data => {
              return data.name;
            });
          }
        );

        if (seriesCategoryNamesArray) {
          newCategories = _.assign([], seriesCategoryNamesArray[0]);
        }
      }
    }

    return newCategories;
  }

  private _getSortableSeries(series, sortOrder) {
    let newSeries = [...series];
    let seriesCategories = [];

    /**
     * Combine all available series for sorting
     */
    const combinedSeriesData = [
      ...this._getCombinedSeriesData(
        _.map(series, seriesObject => seriesObject.data)
      )
    ];

    if (sortOrder === 1) {
      seriesCategories = _.map(
        _.reverse(_.sortBy(combinedSeriesData, ['y'])),
        seriesData => seriesData.id
      );
      newSeries = _.map(newSeries, seriesObject => {
        const newSeriesObject: any = {...seriesObject};

        if (seriesCategories.length > 0) {
          newSeriesObject.data = [
            ..._.map(seriesCategories, seriesCategory =>
              _.find(seriesObject.data, ['id', seriesCategory])
            )
          ];
        }

        return newSeriesObject;
      });
    } else if (sortOrder === -1) {
      seriesCategories = _.map(
        _.sortBy(combinedSeriesData, ['y']),
        seriesData => seriesData.id
      );
      newSeries = _.map(series, seriesObject => {
        const newSeriesObject: any = {...seriesObject};

        if (seriesCategories.length > 0) {
          newSeriesObject.data = [
            ..._.map(seriesCategories, seriesCategory =>
              _.find(seriesObject.data, ['id', seriesCategory])
            )
          ];
        }
        return newSeriesObject;
      });
    }
    return newSeries;
  }

  private _getCombinedSeriesData(seriesData: any) {
    let combinedSeriesData = [];
    seriesData.forEach(seriesDataArray => {
      seriesDataArray.forEach(seriesDataObject => {
        const availableSeriesData = _.find(combinedSeriesData, [
          'id',
          seriesDataObject.id
        ]);
        if (!availableSeriesData) {
          combinedSeriesData = [...combinedSeriesData, seriesDataObject];
        } else {
          const seriesDataIndex = _.findIndex(
            combinedSeriesData,
            availableSeriesData
          );
          const newSeriesObject = {...seriesDataObject};
          newSeriesObject.y += availableSeriesData.y;
          combinedSeriesData = [
            ...combinedSeriesData.slice(0, seriesDataIndex),
            newSeriesObject,
            ...combinedSeriesData.slice(seriesDataIndex + 1)
          ];
        }
      });
    });

    return combinedSeriesData;
  }

  private _getChartSeriesNew(analyticsObject: any,
                             xAxisItems: any[],
                             yAxisItems: any[],
                             chartConfiguration: any) {
    return yAxisItems.map((yAxisItem, yAxisIndex) => {
      return {
        name: yAxisItem.name,
        id: yAxisItem.id,
        index: yAxisIndex,
        turboThreshold: 0,
        pointPlacement: chartConfiguration.type === 'radar' ? 'on' : undefined,
        data: this._getSeriesDataNew(
          analyticsObject,
          chartConfiguration,
          yAxisItem.id,
          xAxisItems
        ),
        type: this._getAllowedChartType(chartConfiguration.type)
      };
    });
  }

  private _getSeriesDataNew(analyticsObject: any,
                            chartConfiguration: any,
                            yAxisItemId: string,
                            xAxisItems: any[]) {
    const data: any[] = [];
    /**
     * Get index to locate data for y axis
     */
    const yAxisItemIndex = _.findIndex(
      analyticsObject.headers,
      _.find(analyticsObject.headers, ['name', chartConfiguration.yAxisType])
    );

    /**
     * Get index for value attribute to get the data
     */
    const dataIndex = _.findIndex(
      analyticsObject.headers,
      _.find(analyticsObject.headers, ['name', 'value'])
    );

    /**
     * Get index to locate data for x axis
     */
    const xAxisItemIndex = _.map(
      chartConfiguration.xAxisType,
      (xAxisType: any) => {
        return _.findIndex(
          analyticsObject.headers,
          _.find(analyticsObject.headers, ['name', xAxisType])
        );
      }
    ).join('_');

    if (xAxisItems) {
      xAxisItems.forEach(xAxisItem => {
        /**
         * Get the required data depending on xAxis and yAxis
         */
        const seriesValue = this._getSeriesValueNew(
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
      });
    }

    return data;
  }

  private _getSeriesValueNew(analyticsRows,
                             yAxisItemIndex,
                             yAxisItemId,
                             xAxisItemIndex,
                             xAxisItemId,
                             dataIndex) {
    let finalValue = 0;
    const seriesValues = _.map(analyticsRows, row => {
      let seriesValue: any = 0;
      let xAxisRowId = '';
      _.forEach(xAxisItemIndex.split('_'), (axisIndex: any) => {
        xAxisRowId += xAxisRowId !== '' ? '_' : '';
        xAxisRowId += row[axisIndex];
      });

      if (row[yAxisItemIndex] === yAxisItemId && xAxisRowId === xAxisItemId) {
        seriesValue += parseFloat(row[dataIndex]);
      }
      return seriesValue;
    }).filter(value => value !== 0);

    if (seriesValues) {
      // TODO find best way to identify ratios
      const isRatio = _.some(
        seriesValues,
        seriesValue => seriesValue.toString().split('.')[1]
      );

      const valueSum =
        seriesValues.length > 0
          ? seriesValues.reduce((sum, count) => sum + count)
          : 0;

      if (isRatio) {
        finalValue = parseFloat((valueSum / seriesValues.length).toFixed(2));
      } else {
        finalValue = valueSum;
      }
    }

    return finalValue !== 0 ? finalValue : null;
  }

  private _getDataLabelsOptions(chartConfiguration: any) {
    let dataLabels = null;

    switch (chartConfiguration.type) {
      case 'pie':
        dataLabels = {
          enabled: chartConfiguration.showData,
          format:
            '{point.name}<br/> <b>{point.y}</b> ( {point.percentage:.1f} % )'
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

  private _getAxisItemsNew(analyticsObject: any,
                           axisTypeArray: any[],
                           isCategory: boolean = false) {
    let items: any[] = [];
    const metadataNames = analyticsObject.metaData.names;
    const metadataDimensions = analyticsObject.metaData.dimensions;
    axisTypeArray.forEach((axisType, axisIndex) => {
      const itemKeys = metadataDimensions[axisType];
      if (itemKeys) {
        if (axisIndex > 0) {
          const availableItems = _.assign([], items);
          items = [];
          itemKeys.forEach(itemKey => {
            availableItems.forEach(item => {
              items.push({
                id: item.id + '_' + itemKey,
                name: item.name + '_' + metadataNames[itemKey].trim()
              });
            });
          });
        } else {
          items = _.map(itemKeys, itemKey => {
            return {
              id: itemKey,
              name: metadataNames[itemKey].trim()
            };
          });
        }
      }
    });

    // todo find best way to remove this hardcoding
    // if (isCategory && axisType === 'pe') {
    //   return _.reverse(items);
    // }
    return items;
  }

  private _getAxisItems(analyticsObject: any,
                        axisType: string,
                        isCategory: boolean = false) {
    let items: any[] = [];
    const metadataNames = analyticsObject.metaData.names;
    const metadataDimensions = analyticsObject.metaData.dimensions;
    const itemKeys = metadataDimensions[axisType];

    if (itemKeys) {
      items = _.map(itemKeys, itemKey => {
        return {
          id: itemKey,
          name: metadataNames[itemKey]
        };
      });
    }

    // todo find best way to remove this hardcoding
    // if (isCategory && axisType === 'pe') {
    //   return _.reverse(items);
    // }
    return items;
  }

  private _getChartTitleObject(chartConfiguration: any): any {
    if (chartConfiguration.hideTitle) {
      return null;
    }
    return {
      text: chartConfiguration.title,
      style: {
        fontWeight: '500',
        fontSize: '16px'
      }
    };
  }

  private _getChartSubtitleObject(chartConfiguration: any): any {
    // if (chartConfiguration.hideSubtitle) {
    //   return null;
    // }
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
      '#A9BE3B',
      '#558CC0',
      '#D34957',
      '#FF9F3A',
      '#968F8F',
      '#B7409F',
      '#FFDA64',
      '#4FBDAE',
      '#B78040',
      '#676767',
      '#6A33CF',
      '#4A7833',
      '#434348',
      '#7CB5EC',
      '#F7A35C',
      '#F15C80'
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

  private _getChartLabelOptions(chartConfiguration: any) {
    return {};
  }

  private _getTooltipOptions(chartConfiguration: any) {
    const tooltipChartType = this._getAllowedChartType(chartConfiguration.type);
    let tooltipObject: any = {};

    if (tooltipChartType) {
      switch (tooltipChartType) {
        case 'solidgauge':
          tooltipObject = {
            enabled: false
          };
          break;
        case 'pie':
          tooltipObject = {
            pointFormat:
              '{series.name}<br/> <b>{point.y}</b> ( {point.percentage:.1f} % )'
          };
          break;
        default:
          switch (chartConfiguration.type) {
            case 'stacked_column':
              tooltipObject = {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat:
                  '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
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

  private _getPlotOptions(chartConfiguration: any) {
    const plotOptionChartType = this._getAllowedChartType(
      chartConfiguration.type
    );

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
          plotOptions[
            plotOptionChartType !== '' ? plotOptionChartType : 'series'
            ] = {
            showInLegend: !chartConfiguration.hideLegend
          };

          /**
           * Set attributes for stacked charts
           */
          if (
            chartConfiguration.type === 'stacked_column' ||
            chartConfiguration.type === 'stacked_bar' ||
            chartConfiguration.type === 'area'
          ) {
            plotOptions[
              plotOptionChartType
              ].stacking = chartConfiguration.percentStackedValues
              ? 'percent'
              : 'normal';
          }

          if (chartConfiguration.type === 'dotted') {
            plotOptions['line'] = {
              lineWidth: 0,
              states: {
                hover: {
                  enabled: false
                }
              }
            };
          }

          break;
      }
    }
    return plotOptions;
  }

  private _getChartAttributeOptions(chartConfiguration: any) {
    const chartOptions: any = {
      renderTo: chartConfiguration.renderId,
      zoomType: 'xy',
      type: this._getAllowedChartType(chartConfiguration.type)
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

    switch (chartType) {
      case 'radar':
        paneOptions = _.assign(
          {},
          {
            size: '80%'
          }
        );
        break;
      default:
        paneOptions = _.assign(
          {},
          {
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
          }
        );
        break;
    }
    return paneOptions;
  }

  private _getLegendOptions(chartConfiguration: any) {
    return {
      align: chartConfiguration.legendAlign,
      reversed: chartConfiguration.reverseLegend,
      layout:
        chartConfiguration.legendAlign === 'right' ||
        chartConfiguration.legendAlign === 'left'
          ? 'vertical'
          : 'horizontal',
      y:
        chartConfiguration.legendAlign === 'top'
          ? 0
          : chartConfiguration.legendAlign === 'bottom' ? 25 : 0
    };
  }

  private _getXAxisOptions(xAxisCategories: any[], chartType) {
    let xAxisOptions = {};

    switch (chartType) {
      case 'radar':
        xAxisOptions = _.assign(
          {},
          {
            categories: xAxisCategories,
            tickmarkPlacement: 'on',
            lineWidth: 0
          }
        );
        break;
      default:
        xAxisOptions = _.assign(
          {},
          {
            categories: xAxisCategories,
            labels: {
              rotation:
                xAxisCategories.length <= 5
                  ? 0
                  : xAxisCategories.length >= 10 ? -45 : -45,
              style: {
                color: '#000000',
                fontWeight: 'normal',
                fontSize: '12px'
              }
            }
          }
        );
        break;
    }

    return xAxisOptions;
  }

  private _getYAxisOptions(chartConfiguration: any) {
    const yAxes: any[] = chartConfiguration.axes;
    let newYAxes: any[] = [];

    if (yAxes.length === 0) {
      newYAxes = _.assign(
        [],
        [
          {
            min: chartConfiguration.rangeAxisMinValue,
            max: chartConfiguration.rangeAxisMaxValue,
            title: {
              text: '',
              style: {
                color: '#000000',
                fontWeight: 'normal',
                fontSize: '14px'
              }
            }
          }
        ]
      );
    } else {
      newYAxes = _.map(yAxes, (yAxis: any, yAxisIndex: any) => {
        return {
          min: chartConfiguration.rangeAxisMinValue,
          max: chartConfiguration.rangeAxisMaxValue,
          title: {
            text: yAxis.name,
            style: {color: '#000000', fontWeight: 'normal', fontSize: '14px'}
          },
          opposite: yAxis.orientation === 'left' ? false : true
        };
      });
    }

    return _.map(newYAxes, (yAxis: any) => {
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
            style: {color: '#000000', fontWeight: 'normal', fontSize: '14px'}
          };
          yAxis['plotLines'] = [
            {
              color: '#000000',
              dashStyle: 'Solid',
              value: chartConfiguration.targetLineValue,
              width: 2,
              zIndex: 1000,
              label: {
                text: chartConfiguration.targetLineLabel
              }
            },
            {
              color: '#000000',
              dashStyle: 'Solid',
              value: chartConfiguration.baseLineValue,
              zIndex: 1000,
              width: 2,
              label: {
                text: chartConfiguration.baseLineLabel
              }
            }
          ];
          break;
      }
      return yAxis;
    });
  }

  private _getAllowedChartType(chartType: string): string {
    let newChartType = '';
    switch (chartType) {
      case 'radar':
        newChartType = 'line';
        break;
      case 'dotted':
        newChartType = 'line';
        break;
      default:
        const splitedChartType: any[] = chartType.split('_');
        newChartType =
          splitedChartType.length > 1
            ? splitedChartType[1]
            : splitedChartType[0];
        break;
    }
    return newChartType;
  }

  private _sanitizeAnalyticsBasedOnConfiguration(analyticsObject: any,
                                                 chartConfiguration: any) {
    let newAnalyticsObject = _.clone(analyticsObject);

    if (chartConfiguration.cumulativeValues) {
      newAnalyticsObject = _.assign(
        {},
        this._mapAnalyticsToCumulativeFormat(
          analyticsObject,
          chartConfiguration.xAxisType[0],
          chartConfiguration.yAxisType
        )
      );
    }

    return newAnalyticsObject;
  }

  private _mapAnalyticsToCumulativeFormat(analyticsObject: any,
                                          xAxisType,
                                          yAxisType) {
    const newAnalyticsObject = _.clone(analyticsObject);

    if (analyticsObject) {
      const yAxisDimensionArray =
        analyticsObject.metaData.dimensions[yAxisType];
      const xAxisDimensionArray = [..._.reverse(
        [...analyticsObject.metaData.dimensions[xAxisType]]
      )];
      const yAxisDimensionIndex = _.findIndex(
        analyticsObject.headers,
        _.find(analyticsObject.headers, ['name', yAxisType])
      );
      const xAxisDimensionIndex = _.findIndex(
        analyticsObject.headers,
        _.find(analyticsObject.headers, ['name', xAxisType])
      );
      const dataValueIndex = _.findIndex(
        analyticsObject.headers,
        _.find(analyticsObject.headers, ['name', 'value'])
      );
      const newRows: any[] = [];
      yAxisDimensionArray.forEach(yAxisDimensionValue => {
        let initialValue = 0;
        xAxisDimensionArray.forEach(xAxisDimensionValue => {
          analyticsObject.rows.forEach(row => {
            if (
              row[yAxisDimensionIndex] === yAxisDimensionValue &&
              row[xAxisDimensionIndex] === xAxisDimensionValue
            ) {
              initialValue += parseInt(row[dataValueIndex], 10);
              const newRow = _.clone(row);
              newRow[dataValueIndex] = initialValue;
              newRows.push(newRow);
            }
          });
        });
      });
      newAnalyticsObject.rows = _.assign([], newRows);
    }
    return newAnalyticsObject;
  }

  private _standardizeIncomingAnalytics(analyticsObject: any) {
    const sanitizedAnalyticsObject: any = {
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
            const newHeader: any = header;
            sanitizedAnalyticsObject.headers.push(newHeader);
          } catch (e) {
            console.warn('Invalid header object');
          }
        });
      }

      /**
       * Check metaData
       */
      if (analyticsObject.metaData) {
        try {
          const sanitizedMetadata: any = this._getSanitizedAnalyticsMetadata(
            analyticsObject.metaData
          );
          sanitizedAnalyticsObject.metaData = sanitizedMetadata;
        } catch (e) {
          console.warn('Invalid metadata object');
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
    const sanitizedMetadata: any = {
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
            metadataNames[metadataItemKey] =
              analyticMetadata.items[metadataItemKey].name;
          });
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
