import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VisualizationUiConfig } from '../../models/visualization-ui-config.model';
import { VisualizationLayer } from '../../models/visualization-layer.model';
import { VisualizationDataSelection } from '../../models/visualization-data-selection.model';

/**
 * Generated class for the VisualizationHeaderSectionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'visualization-header-section',
  templateUrl: 'visualization-header-section.html'
})
export class VisualizationHeaderSectionComponent {

  @Input() id: string;
  @Input() uiConfigId: string;
  @Input() showFilters: boolean;
  @Input() fullScreen: boolean;
  @Input() visualizationLayer: VisualizationLayer;
  @Output() visualizationLayerUpdate: EventEmitter<VisualizationLayer> = new EventEmitter<VisualizationLayer>()

  @Output() fullScreenAction: EventEmitter<any> = new EventEmitter<any>();

  constructor() {

  }

  onFullScreenAction(fullScreenState: boolean) {
    this.fullScreenAction.emit({fullScreen: fullScreenState, uiConfigId: this.uiConfigId});
  }

  onFilterUpdateAction(dataSelections: VisualizationDataSelection[]) {
    this.visualizationLayerUpdate.emit({
      ...this.visualizationLayer,
      dataSelections
    })
  }

}
