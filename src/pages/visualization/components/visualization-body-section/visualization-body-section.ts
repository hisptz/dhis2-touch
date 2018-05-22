import { Component, Input } from '@angular/core';
import { VisualizationConfig } from '../../models/visualization-config.model';
import { VisualizationUiConfig } from '../../models/visualization-ui-config.model';
import { VisualizationLayer } from '../../models/visualization-layer.model';

@Component({
  selector: 'visualization-body-section',
  templateUrl: 'visualization-body-section.html'
})
export class VisualizationBodySectionComponent {

  @Input() id: string;
  @Input() visualizationLayers: VisualizationLayer[];
  @Input() visualizationConfig: VisualizationConfig;
  @Input() visualizationUiConfig: VisualizationUiConfig;
  constructor() {

  }

}
