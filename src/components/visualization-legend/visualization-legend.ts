import { Component } from '@angular/core';
import {LegendSetServiceProvider} from "../../providers/legend-set-service/legend-set-service";
import * as _ from 'lodash';
import {LegendSet} from '../../model/legend-set';
import {TILE_LAYERS} from '../../constants/tile-layers';
import {MapLayerEvent} from '../../constants/layer-event';

/**
 * Generated class for the VisualizationLegendComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'visualization-legend',
  templateUrl: 'visualization-legend.html'
})
export class VisualizationLegendComponent {

  constructor(private legend: LegendSetServiceProvider) {}

}
