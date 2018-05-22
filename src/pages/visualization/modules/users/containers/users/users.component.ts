import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import { VisualizationLayer } from '../../../../models/visualization-layer.model';

@Component({
  selector: 'users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  @Input() visualizationLayers: VisualizationLayer[];
  users: any[];
  constructor() {
    this.users = [];
  }

  ngOnInit() {
    if (this.visualizationLayers) {
      this.users = _.flatten(_.filter(_.map(this.visualizationLayers,
        visualizationLayer => visualizationLayer.analytics && visualizationLayer.analytics.rows ?
          visualizationLayer.analytics.rows : null), user => user));
    }
  }
}
