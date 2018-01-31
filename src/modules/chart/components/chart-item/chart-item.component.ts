import {Component, Input, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import * as HighchartsExporting from 'highcharts/modules/exporting';
import * as OfflineHighchartExporting from 'highcharts/modules/offline-exporting.js';
import * as HighchartsMore from 'highcharts/highcharts-more.js';
import * as HighchartGauge from 'highcharts/modules/solid-gauge.js';
import * as HighchartDrilldown from 'highcharts/modules/drilldown.js';
import * as HighchartGroupedCategories from 'highcharts-grouped-categories/grouped-categories.js';
import * as HighchartNoDataToDisplay from 'highcharts/modules/no-data-to-display';

HighchartsExporting(Highcharts);
OfflineHighchartExporting(Highcharts);
HighchartsMore(Highcharts);
HighchartGauge(Highcharts);
HighchartDrilldown(Highcharts);
HighchartGroupedCategories(Highcharts);
HighchartNoDataToDisplay(Highcharts);
import {ChartService} from '../../services/chart.service';
import {ChartConfiguration} from '../../models/chart-configuration';
import * as fromConstants from './constants';
import * as fromModels from './models';

@Component({
  selector: 'app-chart-item',
  templateUrl: './chart-item.component.html'
})
export class ChartItemComponent implements OnInit {

  @Input() chartConfiguration: ChartConfiguration;
  @Input() analyticsObject: any;
  @Input() chartHeight: string;
  showOptions: boolean;
  chartTypes: fromModels.ChartType[];
  chart: any;
  currentChartType: string;
  renderId: string;

  constructor(private chartService: ChartService) {
    this.chartTypes = fromConstants.CHART_TYPES;
    this.showOptions = false;
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

}
