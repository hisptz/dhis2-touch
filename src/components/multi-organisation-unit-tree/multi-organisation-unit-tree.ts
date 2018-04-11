import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { OrganisationUnitsProvider } from '../../providers/organisation-units/organisation-units';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';

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
  @Output() activate = new EventEmitter();
  @Output() deactivate = new EventEmitter();

  seletectedOrganisationUnitIds: Array<string> = [];
  translationMapper: any;
  isOrganisationUnitsFetched: boolean = true;
  hasErrorOccurred: boolean = false;
  hasOrgUnitChildrenLoaded: boolean;

  constructor(
    private organisationUnitProvider: OrganisationUnitsProvider,
    private appTranslation: AppTranslationProvider
  ) {}

  ngOnInit() {
    this.translationMapper = {};
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
        this.setMetadata();
      },
      error => {
        this.setMetadata();
      }
    );
  }

  setMetadata() {
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
            let message = 'Failed to discover organisation unit children';
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
    if (
      this.isOrganisationUnitPreviousSelected(
        this.selectedOrgUnits,
        organisationUnit
      )
    ) {
      let index = this.seletectedOrganisationUnitIds.indexOf(
        organisationUnit.id
      );
      this.seletectedOrganisationUnitIds.splice(index, 1);
      let newSelectedOrganisationUnits = [];
      this.selectedOrgUnits.map((selectedOrgUnit: any) => {
        if (selectedOrgUnit.id != organisationUnit.id) {
          newSelectedOrganisationUnits.push(selectedOrgUnit);
        }
      });
      this.selectedOrgUnits = [];
      this.selectedOrgUnits = newSelectedOrganisationUnits;
      //deactivate ou
      this.onDeactivateOu(organisationUnit);
    } else {
      const seletectOrganisationUnit = {
        id: organisationUnit.id,
        name: organisationUnit.name,
        type: 'ORGANISATION_UNIT'
      };
      this.seletectedOrganisationUnitIds.push(organisationUnit.id);
      this.selectedOrgUnits.push(seletectOrganisationUnit);
      //activate ou
      this.onActivateOu(organisationUnit);
    }
  }

  onDeactivateOu(organisationUnit) {
    this.deactivate.emit(organisationUnit);
  }

  onActivateOu(organisationUnit) {
    this.activate.emit(organisationUnit);
  }

  isOrganisationUnitPreviousSelected(selectedOrgUnits, organisationUnit) {
    let result = false;
    selectedOrgUnits.map((selectedOrgUnit: any) => {
      if (selectedOrgUnit.id == organisationUnit.id) {
        result = true;
      }
    });
    return result;
  }

  trackByFn(index, item) {
    return item.id;
  }

  getValuesToTranslate() {
    return [
      'Discovering organisation units',
      'Failed to discover organisation unit children'
    ];
  }
}
