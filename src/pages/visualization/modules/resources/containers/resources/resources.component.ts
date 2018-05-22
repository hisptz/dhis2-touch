import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import { VisualizationLayer } from '../../../../models/visualization-layer.model';

@Component({
  selector: 'resources',
  templateUrl: './resources.component.html',
})
export class ResourcesComponent implements OnInit {
  @Input() visualizationLayers: VisualizationLayer[];
  resources: any[];

  constructor() {
    this.resources = [];
  }

  ngOnInit() {
    if (this.visualizationLayers) {
      this.resources = _.flatten(_.filter(_.map(this.visualizationLayers,
        visualizationLayer => visualizationLayer.analytics && visualizationLayer.analytics.rows ?
          visualizationLayer.analytics.rows : null), resource => resource));
    }
  }
}
