import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-visualization-types-section",
  templateUrl: "./visualization-types-section.component.html"
})
export class VisualizationTypesSectionComponent implements OnInit {
  @Input() currentVisualization: string;
  @Output()
  visualizationTypeChange: EventEmitter<string> = new EventEmitter<
    string
  >();
  @Output() onToggleInterpretation = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  onVisualizationSelect(e, type) {
    e.stopPropagation();
    this.visualizationTypeChange.emit(type);
  }

  toggleInterpretaion(e) {
    e.stopPropagation();
    this.onToggleInterpretation.emit();
  }
}
