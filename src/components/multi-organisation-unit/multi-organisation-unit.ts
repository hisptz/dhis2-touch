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

  selectedOrgUnits: any;
  hasOrgUnitChildrenOpened: any;

  toggledOuIds: Array<string>;

  constructor() {}

  ngOnInit() {
    this.hasOrgUnitChildrenOpened = {};
    this.toggledOuIds = [];
    this.selectedOrgUnits = [
      {
        id: 'YuQRtpLP10I',
        name: '',
        type: 'ORGANISATION_UNIT'
      },
      {
        id: 'g8upMTyEZGZ',
        name: '',
        type: 'ORGANISATION_UNIT'
      },
      {
        id: 'DiszpKrYNg8',
        name: '',
        type: 'ORGANISATION_UNIT'
      }
    ];
  }
}
