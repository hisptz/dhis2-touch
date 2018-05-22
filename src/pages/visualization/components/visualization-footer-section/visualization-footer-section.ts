import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Generated class for the VisualizationFooterSectionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'visualization-footer-section',
  templateUrl: 'visualization-footer-section.html'
})
export class VisualizationFooterSectionComponent {

  @Input() type: string;
  @Input() configId: string;
  @Input() hideTypeButtons: boolean;
  @Output() visualizationTypeChange: EventEmitter<{id: string, type: string}> = new EventEmitter<{id: string, type: string}>();

  constructor() {

  }

  onVisualizationTypeChange(type: string) {
    this.visualizationTypeChange.emit({id: this.configId, type: type});
  }

}
