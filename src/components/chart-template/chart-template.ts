import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as HighCharts from 'highcharts';

/**
 * Generated class for the ChartTemplateComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'chart-template',
  templateUrl: 'chart-template.html'
})
export class ChartTemplateComponent implements OnInit{


  @Input() renderId: string;
  @Input() chartHeight: string;
  @Input() chartObject: any;
  @Output() onChartRenderFailure: EventEmitter<string> = new EventEmitter<string>();
  chart: any;

  constructor() {
  }

  ngOnInit(){
    if (this.chartObject) {
      setTimeout(() => {
        if (this.chartObject.series) {
          this.chart = HighCharts.chart(this.chartObject);
        } else {
          this.onChartRenderFailure.emit('Required properties for rendering  are missing')
        }
      }, 20)
    }

  }

  download(filename, downloadFormat) {
    if (this.chart) {
      if (downloadFormat === 'pdf') {
        this.chart.exportChartLocal({'filename': filename, 'type': 'application/pdf'})
      } else if (downloadFormat === 'png') {
        this.chart.exportChartLocal({'filename': filename, 'type': 'image/png'})
      }
    }
  }

}
