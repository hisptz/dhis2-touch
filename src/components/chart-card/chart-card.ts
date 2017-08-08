import { Component,OnInit,Input } from '@angular/core';

import * as HighCharts from 'highcharts';

/**
 * Generated class for the ChartCardComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'chart-card',
  templateUrl: 'chart-card.html'
})
export class ChartCardComponent implements OnInit{

  @Input() chartObject;
  @Input() dashboardItemId;

  isLoading : boolean = true;

  chart : any;


  constructor() {
  }

  ngOnInit(){
    this.isLoading = true;
    if(this.dashboardItemId && this.chartObject){
      this.chartObject.chart.renderTo = this.dashboardItemId;
      setTimeout(()=>{
        this.chart = HighCharts.chart(this.chartObject);
        this.isLoading = false;
      },500);
    }
  }

}
