import { Component, Input, OnInit } from "@angular/core";
import * as _ from "lodash";

@Component({
  selector: "app-visualization-card-loader",
  templateUrl: "./visualization-card-loader.component.html"
})
export class VisualizationCardLoaderComponent implements OnInit {
  @Input() visualizationType: string;
  @Input() height: string;
  @Input() name: string;
  tableCellCounts: any[];
  chartBars: any[];
  constructor() {
    this.tableCellCounts = _.range(20);
    this.chartBars = ['70', '30', '80', '10', '30', '60']
    this.height = '400px'
  }

  ngOnInit() {}
}
