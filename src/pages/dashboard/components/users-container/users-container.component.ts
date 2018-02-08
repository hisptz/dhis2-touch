import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-users-container',
  templateUrl: './users-container.component.html',
})
export class UsersContainerComponent implements OnInit {
  @Input() visualizationLayers: any[];
  userList: any[];
  constructor() {}

  ngOnInit() {
    if (this.visualizationLayers) {
      this.userList = _.flatten(
        _.map(
          this.visualizationLayers,
          (layer: any) => (layer.settings ? layer.settings.users : [])
        )
      );
    }
  }
}
