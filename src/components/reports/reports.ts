import { Component,Input, OnInit } from '@angular/core';
import {Visualization} from "../../model/visualization";

/**
 * Generated class for the ReportsComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'reports',
  templateUrl: 'reports.html'
})
export class ReportsComponent implements OnInit {

  @Input() visualizationObject: Visualization;
  private _reports: any[];
  constructor() { }

  ngOnInit() {
    this._reports = this.visualizationObject.layers[0].settings.reports;
  }


  get reports(): any[] {
    return this._reports;
  }

  set reports(value: any[]) {
    this._reports = value;
  }
}
