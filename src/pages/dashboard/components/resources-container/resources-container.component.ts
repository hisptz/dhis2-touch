import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-resources-container',
  templateUrl: './resources-container.component.html'
})
export class ResourcesContainerComponent implements OnInit {
  @Input() visualizationLayers: any[];
  resourceList: any[];
  constructor() {}

  ngOnInit() {
    if (this.visualizationLayers) {
      this.resourceList = _.flatten(
        _.map(
          this.visualizationLayers,
          (layer: any) =>
            layer.settings
              ? _.map(layer.settings.resources, (resource: any) => {
                  return {
                    id: resource.id,
                    displayObject: {
                      value: resource.displayName,
                      href: 'documents/' + resource.id + '/data'
                    }
                  };
                })
              : []
        )
      );
    }
  }
}
