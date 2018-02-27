import { Component, Input } from '@angular/core';
import { OrganisationUnitsProvider } from '../../providers/organisation-units/organisation-units';

/**
 * Generated class for the MultiOrganisationUnitTreeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'multi-organisation-unit-tree',
  templateUrl: 'multi-organisation-unit-tree.html'
})
export class MultiOrganisationUnitTreeComponent {
  @Input() toggledOuIds;
  @Input() organisationUnit;
  @Input() currentUser;

  constructor(private organisationUnitProvider: OrganisationUnitsProvider) {}

  toggleTree(organisationUnit) {
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
            if (this.organisationUnit && this.organisationUnit.children) {
              this.organisationUnit.children = childrenOrganisationUnits;
            }
          },
          error => {
            console.log(JSON.stringify(error));
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
