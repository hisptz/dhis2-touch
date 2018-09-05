import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-visualization-resize-section',
  templateUrl: './visualization-resize-section.component.html',
})
export class VisualizationResizeSectionComponent implements OnInit {

  @Input() id: string;
  @Input() showResizeButton: boolean;
  @Input() fullScreen: boolean;
  @Input() visualizationShape: string;

  @Output() toggleFullScreen: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit() {
  }

  onToggleFullScreen(e) {
    e.stopPropagation();
    this.toggleFullScreen.emit(this.fullScreen)
    // this.store.dispatch(new visualizationActions.ToggleFullScreenAction(this.visualizationId));
  }

  resizeCard(e?) {
    if (e) {
      e.stopPropagation();
    }
    // this.store.dispatch(new visualizationActions.ResizeAction({
    //   visualizationId: this.visualizationId,
    //   shape: visualizationHelpers.getVisualizationShape(this.visualizationShape)
    // }));
  }

}
