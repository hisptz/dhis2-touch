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
  @Input() hasOrgUnitChildrenOpened;
  seletectedOrganisationUnitIds: Array<string> = [];

  isOrganisationUnitsFetched: boolean = true;
  hasErrorOccurred: boolean = false;
  hasOrgUnitChildrenLoaded: boolean;

  constructor(private organisationUnitProvider: OrganisationUnitsProvider) {}

  ngOnInit() {
    if (this.selectedOrgUnits && this.selectedOrgUnits.length > 0) {
      let ids = [];
      this.selectedOrgUnits.map((selectedOrgUnit: any) => {
        if (
          Object.keys(this.hasOrgUnitChildrenOpened).indexOf(
            selectedOrgUnit.id
          ) == -1
        ) {
          ids.push(selectedOrgUnit.id);
        }
        this.seletectedOrganisationUnitIds.push(selectedOrgUnit.id);
      });
      if (ids.length > 0) {
        this.organisationUnitProvider
          .getOrganisationUnitsByIds(ids, this.currentUser)
          .subscribe((selectedOrganisationUnits: any) => {
            selectedOrganisationUnits.map((selectedOrganisationUnit: any) => {
              let parentCopy = selectedOrganisationUnit.path
                .substring(1, selectedOrganisationUnit.path.length)
                .split('/');
              if (parentCopy.indexOf(this.organisationUnit.id) > -1) {
                selectedOrganisationUnit.ancestors.forEach((ancestor: any) => {
                  if (
                    ancestor.id == this.organisationUnit.id &&
                    Object.keys(this.hasOrgUnitChildrenOpened).indexOf(
                      ancestor.id
                    ) == -1
                  ) {
                    this.toggleTree(ancestor);
                  } else {
                    this.isOrganisationUnitsFetched = true;
                    this.hasOrgUnitChildrenLoaded = true;
                    this.hasErrorOccurred = false;
                  }
                });
              }
            });
          });
      }
    }
  }

  toggleTree(organisationUnit) {
    if (this.hasOrgUnitChildrenOpened[organisationUnit.id]) {
      this.hasOrgUnitChildrenOpened[organisationUnit.id] = !this
        .hasOrgUnitChildrenOpened[organisationUnit.id];
    } else if (
      Object.keys(this.hasOrgUnitChildrenOpened).indexOf(organisationUnit.id) >
      -1
    ) {
      this.hasOrgUnitChildrenOpened[organisationUnit.id] = !this
        .hasOrgUnitChildrenOpened[organisationUnit.id];
      this.isOrganisationUnitsFetched = true;
      this.hasOrgUnitChildrenLoaded = true;
      this.hasErrorOccurred = false;
    } else {
      this.isOrganisationUnitsFetched = false;
      this.hasOrgUnitChildrenLoaded = false;
      this.hasOrgUnitChildrenOpened[organisationUnit.id] = true;
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
            this.organisationUnit.children = childrenOrganisationUnits;
            this.isOrganisationUnitsFetched = true;
            this.hasOrgUnitChildrenLoaded = true;
            this.hasErrorOccurred = false;
          },
          error => {
            console.log(JSON.stringify(error));
            let message = 'Fail to discover organisation unit children';
            this.isOrganisationUnitsFetched = true;
            this.hasOrgUnitChildrenLoaded = true;
            this.hasErrorOccurred = true;
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
