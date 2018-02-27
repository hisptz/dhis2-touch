import { Component, OnInit, Input } from '@angular/core';

/**
 * Generated class for the MultiOrganisationUnitComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'multi-organisation-unit',
  templateUrl: 'multi-organisation-unit.html'
})
export class MultiOrganisationUnitComponent implements OnInit {
  @Input() organisationUnits;
  @Input() currentUser;

  toggledOuIds: Array<string>;

  constructor() {}

  ngOnInit() {
    this.toggledOuIds = [];
  }
}
