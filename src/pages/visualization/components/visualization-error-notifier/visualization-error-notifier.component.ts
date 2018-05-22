import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'visualization-error-notifier',
  templateUrl: './visualization-error-notifier.component.html'
})
export class VisualizationErrorNotifierComponent implements OnInit {

  @Input() errorMessage: any;
  constructor() { }

  ngOnInit() {
  }

}
