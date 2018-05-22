import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as HighchartsExporting from 'highcharts/modules/exporting';
import * as OfflineHighchartExporting from 'highcharts/modules/offline-exporting.js';
import * as HighchartsExportData from 'highcharts/modules/export-data';
import * as HighchartsMore from 'highcharts/highcharts-more.js';
import * as HighchartGauge from 'highcharts/modules/solid-gauge.js';
import * as HighchartDrilldown from 'highcharts/modules/drilldown.js';
import * as HighchartGroupedCategories from 'highcharts-grouped-categories/grouped-categories.js';
import * as HighchartNoDataToDisplay from 'highcharts/modules/no-data-to-display';

HighchartsExporting(Highcharts);
OfflineHighchartExporting(Highcharts);
HighchartsExportData(Highcharts);
HighchartsMore(Highcharts);
HighchartGauge(Highcharts);
HighchartDrilldown(Highcharts);
HighchartGroupedCategories(Highcharts);
HighchartNoDataToDisplay(Highcharts);
import { ChartService } from '../../services/chart.service';
import { ChartConfiguration } from '../../models/chart-configuration';
import { VisualizationExportService } from '../../../../services/visualization-export.service';
import { ChartType } from '../../models/chart-type';
import { CHART_TYPES } from '../../constants/chart-types';

@Component({
  selector: 'chart-item',
  templateUrl: './chart-item.component.html'
})
export class ChartItemComponent implements OnInit {

  @Input() chartConfiguration: ChartConfiguration;
  @Input() analyticsObject: any;
  @Input() chartHeight: string;
  showOptions: boolean;
  chartTypes: ChartType[];
  chart: any;
  currentChartType: string;
  renderId: string;

  constructor(private chartService: ChartService, private visualizationExportService: VisualizationExportService) {
    this.chartTypes = CHART_TYPES;
    this.showOptions = true;
  }


  ngOnInit() {
    this.currentChartType = this.chartConfiguration.type;
    this.renderId = this.chartConfiguration.renderId;
    this.drawChart(this.analyticsObject, this.chartConfiguration);
  }

  drawChart(analyticsObject, chartConfiguration): void {
    if (chartConfiguration && analyticsObject) {
      const chartObject: any = this.chartService.drawChart(analyticsObject, chartConfiguration);

      if (chartObject) {
        setTimeout(() => {
          this.chart = Highcharts.chart(chartObject);
        }, 20);
      }
    }
  }

  updateChartType(chartType: string, e) {
    e.stopPropagation();
    this.currentChartType = chartType;
    this.drawChart(this.analyticsObject, {
      ...this.chartConfiguration,
      type: chartType
    });
  }

  onFocus(parentEvent) {
    if (parentEvent.focused) {
      this.showOptions = true;
    } else {
      this.showOptions = false;
    }
  }

  downloadChart(filename, downloadFormat) {
    if (this.chart) {
      if (downloadFormat === 'PDF') {
        this.chart.exportChartLocal({'filename': filename, 'type': 'application/pdf'});
      } else if (downloadFormat === 'PNG') {
        this.chart.exportChartLocal({'filename': filename, 'type': 'image/png'});
      } else if (downloadFormat === 'JPEG') {
        this.chart.exportChartLocal({'filename': filename, 'type': 'image/jpeg'});
      } else if (downloadFormat === 'SVG') {
        this.chart.exportChartLocal({'filename': filename, 'type': 'image/svg+xml'});
      } else if (downloadFormat === 'CSV') {
        this.visualizationExportService.exportCSV(filename, '', this.chart.getCSV());
      } else if (downloadFormat === 'XLS') {
        this.visualizationExportService.exportXLS(filename, this.chart.getTable());
      }
    }
  }

}
