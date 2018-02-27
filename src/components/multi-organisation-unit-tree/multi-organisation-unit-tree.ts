import { Component, Input, OnInit } from '@angular/core';
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
export class MultiOrganisationUnitTreeComponent implements OnInit {
  @Input() toggledOuIds;
  @Input() organisationUnit;
  @Input() selectedOrgUnits;
  @Input() currentUser;

  constructor(private organisationUnitProvider: OrganisationUnitsProvider) {}

  ngOnInit() {
    if (this.selectedOrgUnits && this.selectedOrgUnits.length > 0) {
      let ids = [];
      this.selectedOrgUnits.map((ou: any) => {
        ids.push(ou.id);
      });
      this.organisationUnitProvider
        .getOrganisationUnitsByIds(ids, this.currentUser)
        .subscribe((selectedOrganisationUnits: any) => {
          selectedOrganisationUnits.map((selectedOrganisationUnit: any) => {
            let parentCopy = selectedOrganisationUnit.path
              .substring(1, selectedOrganisationUnit.path.length)
              .split('/');
            if (parentCopy.indexOf(this.organisationUnit.id) > -1) {
              selectedOrganisationUnit.ancestors.forEach((ancestor: any) => {
                if (ancestor.id == this.organisationUnit.id) {
                  console.log('expand');
                  this.expandTree(ancestor);
                }
              });
            }
          });
        });
    }
  }

  toggleTree(organisationUnit) {
    let ouIndex = this.toggledOuIds.indexOf(organisationUnit.id);
    if (ouIndex > -1) {
      this.toggledOuIds.splice(ouIndex, 1);
    } else {
      this.expandTree(organisationUnit);
    }
  }

  expandTree(organisationUnit) {
    if (this.toggledOuIds.indexOf(organisationUnit.id) == -1) {
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
              this.toggledOuIds.push(organisationUnit.id);
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
