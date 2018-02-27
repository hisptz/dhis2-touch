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

  toggledOuIds: Array<string>;

  constructor() {}

  ngOnInit() {
    this.toggledOuIds = [];
    this.selectedOrgUnits = [
      {
        id: 'l0ccv2yzfF3',
        name: 'Kunike',
        type: 'ORGANISATION_UNIT'
      },
      {
        name: 'Adonkia CHP',
        type: 'ORGANISATION_UNIT',
        id: 'Rp268JB6Ne4'
      },
      {
        name: 'Afro Arab Clinic',
        type: 'ORGANISATION_UNIT',
        id: 'cDw53Ej8rju'
      },
      {
        name: 'Agape CHP',
        type: 'ORGANISATION_UNIT',
        id: 'GvFqTavdpGE'
      }
    ];
  }
}
