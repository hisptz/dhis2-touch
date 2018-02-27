import { Component, OnInit, Input } from '@angular/core';
import { OrganisationUnitsProvider } from '../../providers/organisation-units/organisation-units';

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
  @Input() toggledOuIds: Array<string>;
  isLoading: boolean;
  loadingMessage: string;

  constructor(private organisationUnitProvider: OrganisationUnitsProvider) {}

  ngOnInit() {
    if (this.organisationUnits && this.organisationUnits.length > 0) {
    }
  }
  toggleTree(organisationUnit, toggledOuIndex?) {
    let ouIndex = this.toggledOuIds.indexOf(organisationUnit.id);
    if (ouIndex > -1) {
      this.toggledOuIds.splice(ouIndex, 1);
    } else {
      this.toggledOuIds.push(organisationUnit.id);
      let childrenOrganisationUnitIds = this.getOrganisationUnitsChildrenIds(
        organisationUnit
      );
      this.organisationUnitProvider
        .getOrganisationUnitsByIds(
          childrenOrganisationUnitIds,
          this.currentUser
        )
        .subscribe(
          (childrenOrganisationUnits: any) => {
            if (
              this.organisationUnits[toggledOuIndex] &&
              this.organisationUnits[toggledOuIndex].children
            ) {
              this.organisationUnits[
                toggledOuIndex
              ].children = childrenOrganisationUnits;
            } else {
              console.log('Index not found');
            }
          },
          error => {
            console.log(JSON.stringify(error));
            let message = 'Fail to discover organisation unit children';
          }
        );
    }
  }

  getOrganisationUnitsChildrenIds(organisationUnit) {
    let childrenIds = [];
    for (let children of organisationUnit.children) {
      childrenIds.push(children.id);
    }
    return childrenIds;
  }

  selectOrganisationUnit(organisationUnit) {
    console.log(organisationUnit.name);
  }
}
