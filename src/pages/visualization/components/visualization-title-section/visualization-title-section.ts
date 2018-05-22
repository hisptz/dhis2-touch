import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VisualizationIcons } from '../../models/visualization-icons.model';
import { VISUALIZATION_ICONS } from '../../constants/visualization-icons.constant';

/**
 * Generated class for the VisualizationTitleSectionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'visualization-title-section',
  templateUrl: 'visualization-title-section.html'
})
export class VisualizationTitleSectionComponent {

  @Input() id: string;
  @Input() uiConfigId: string;
  @Input() showBody: boolean;
  @Input() fullScreen: boolean;
  @Input() name: string;
  @Input() type: string;
  @Output() toggleVisualization: EventEmitter<{id: string, showBody: boolean}> = new EventEmitter<{id: string, showBody: boolean}>();
  visualizationIcons: VisualizationIcons;

  constructor() {
    this.visualizationIcons = VISUALIZATION_ICONS;
  }

  onToggleVisualization(e) {
    e.stopPropagation();
    this.toggleVisualization.emit({id: this.uiConfigId, showBody: !this.showBody});
  }

}
