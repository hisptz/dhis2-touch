import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

/**
 * Generated class for the SelectedOrgUnitSectionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'selected-org-unit-section',
  templateUrl: './selected-org-unit-section.html'
})
export class SelectedOrgUnitSectionComponent implements OnChanges {
  @Input() selectedOrgUnits: any[];
  @Input() orgUnitShowLimit: number;


  constructor() {
    this.orgUnitShowLimit = 3;
  }

  ngOnChanges(changes: SimpleChanges) {
  }


}
