import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import { VisualizationLayer } from '../../../../models/visualization-layer.model';

@Component({
  selector: 'reports',
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit {
  @Input() visualizationLayers: VisualizationLayer[];
  reports: any[];
  constructor() {
    this.reports = [];
  }

  ngOnInit() {
    if (this.visualizationLayers) {
      this.reports = _.flatten(_.filter(_.map(this.visualizationLayers,
        visualizationLayer => visualizationLayer.analytics && visualizationLayer.analytics.rows ?
          visualizationLayer.analytics.rows : null), report => report));
    }
  }
}
