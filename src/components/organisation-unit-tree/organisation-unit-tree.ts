/*
 *
 * Copyright 2015 HISP Tanzania
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 *
 * @since 2015
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { OrganisationUnitsProvider } from '../../providers/organisation-units/organisation-units';
import { AppProvider } from '../../providers/app/app';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';

/**
 * Generated class for the OrganisationUnitTreeComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'organisation-unit-tree',
  templateUrl: 'organisation-unit-tree.html'
})
export class OrganisationUnitTreeComponent implements OnInit {
  @Input() currentUser;
  @Input() organisationUnit;
  @Input() hasOrgUnitChildrenOpened;
  @Input() currentSelectedOrgUnitName;
  @Input() ouIdsWithAssigments;
  @Output() selectedOrganisationUnit = new EventEmitter();

  isOrganisationUnitsFetched: boolean = true;
  hasErrorOccurred: boolean = false;
  hasOrgUnitChildrenLoaded: boolean;
  translationMapper: any;

  constructor(
    private organisationUnitProvider: OrganisationUnitsProvider,
    private appProvider: AppProvider,
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
    let lastSelectedOrgUnit = this.organisationUnitProvider.lastSelectedOrgUnit;
    let parentCopy = lastSelectedOrgUnit.path
      .substring(1, lastSelectedOrgUnit.path.length)
      .split('/');
    if (parentCopy.indexOf(this.organisationUnit.id) > -1) {
      lastSelectedOrgUnit.ancestors.forEach((ancestor: any) => {
        if (ancestor.id == this.organisationUnit.id) {
          this.toggleOrganisationUnit(ancestor);
        }
      });
    }
  }

  toggleOrganisationUnit(organisationUnit) {
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
            this.appProvider.setNormalNotification(message);
            this.isOrganisationUnitsFetched = true;
            this.hasOrgUnitChildrenLoaded = true;
            this.hasErrorOccurred = true;
          }
        );
    }
  }

  setSelectedOrganisationUnit(selectedOrganisationUnit) {
    this.selectedOrganisationUnit.emit(selectedOrganisationUnit);
  }

  getOrganisationUnitsChildrenIds(organisationUnit) {
    let childrenIds = [];
    for (let children of organisationUnit.children) {
      childrenIds.push(children.id);
    }
    return childrenIds;
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }

  getValuesToTranslate() {
    return [
      'Discovering organisation units',
      'Failed to discover organisation unit children'
    ];
  }
}
