import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfigurationService } from '../../services/chart-configuration.service';
import { ChartItemComponent } from '../chart-item/chart-item.component';
import { VisualizationLayer } from '../../../../models/visualization-layer.model';

@Component({
  selector: 'chart-list',
  templateUrl: './chart-list.component.html',
})
export class ChartListComponent implements OnInit {
  @Input() visualizationLayers: VisualizationLayer[] = [];
  @Input() visualizationId: string;
  @Input() chartHeight: string;
  chartLayers: Array<{chartConfiguration: any; analyticsObject: any}> = [];

  @ViewChild(ChartItemComponent) chartItem: ChartItemComponent;

  constructor(private chartConfig: ChartConfigurationService) {
  }

  ngOnInit() {
    if (this.visualizationLayers.length > 0) {
      this.chartLayers = this.visualizationLayers.map((layer: VisualizationLayer, layerIndex: number) => {

        return {
          chartConfiguration: this.chartConfig.getChartConfiguration(
            layer.config,
            this.visualizationId + '_' + layerIndex,
            layer.layout
          ),
          analyticsObject: layer.analytics
        };
      });
    }
  }

  onParentEvent(parentEvent) {
    if (this.chartItem) {
      this.chartItem.onFocus(parentEvent);
    }
  }

  onDownloadEvent(filename, downloadFormat) {
    if (this.chartItem) {
      this.chartItem.downloadChart(filename, downloadFormat);
    }
  }
}
