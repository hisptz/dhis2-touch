import { Component,OnInit, Input } from '@angular/core';
import {Visualization} from "../../model/visualization";

/**
 * Generated class for the ResourcesComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'resources',
  templateUrl: 'resources.html'
})
export class ResourcesComponent implements OnInit {

  @Input() visualizationObject: Visualization;
  private _resources: any[];
  constructor() { }

  ngOnInit() {
    this._resources = this.visualizationObject.layers[0].settings.resources;
  }


  get resources(): any[] {
    return this._resources;
  }

  set resources(value: any[]) {
    this._resources = value;
  }
}
