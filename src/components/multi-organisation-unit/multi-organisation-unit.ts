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
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserProvider } from '../../providers/user/user';
import { AppProvider } from '../../providers/app/app';
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
  @Input()
  selectedOrgUnits;
  @Output()
  activateOrganisationUnit = new EventEmitter();
  @Output()
  deactivateOrganisationUnit = new EventEmitter();
  hasOrgUnitChildrenOpened: any;
  toggledOuIds: string[];
  isLoading: boolean;
  loadingMessage: string;
  emptyMessage: string;
  currentUser: any;
  translationMapper: any;
  organisationUnits: any;

  constructor(
    private userProvider: UserProvider,
    private appProvider: AppProvider,
    private organisationUnitProvider: OrganisationUnitsProvider
  ) {}

  ngOnInit() {
    this.hasOrgUnitChildrenOpened = {};
    this.translationMapper = {};
    this.organisationUnits = [];
    this.toggledOuIds = [];
    this.isLoading = true;
    this.userProvider.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.loadingOrganisationUnits();
    });
  }

  loadingOrganisationUnits() {
    let key = 'Discovering assigned organisation units';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.hasOrgUnitChildrenOpened = {};
    this.organisationUnitProvider
      .getOrganisationUnits(this.currentUser)
      .subscribe(
        (organisationUnits: any) => {
          if (organisationUnits && organisationUnits.length > 0) {
            this.organisationUnits = organisationUnits;
            this.isLoading = false;
          } else {
            this.isLoading = false;
            key =
              'Currently there is on assigned organisation unit on local storage, Please metadata on sync app';
            this.emptyMessage = this.translationMapper[key]
              ? this.translationMapper[key]
              : key;
            this.appProvider.setNormalNotification(key);
          }
        },
        error => {
          console.log(JSON.stringify(error));
          this.isLoading = false;
          key = 'Failed to discover organisation units';
          this.emptyMessage = this.translationMapper[key]
            ? this.translationMapper[key]
            : key;
          this.appProvider.setNormalNotification(key);
        }
      );
  }
  onDeactivateOu(organisationUnit) {
    const data = {
      node: {
        data: organisationUnit
      }
    };
    this.deactivateOrganisationUnit.emit(data);
  }

  onActivateOu(organisationUnit) {
    const data = {
      node: {
        data: organisationUnit
      }
    };

    this.activateOrganisationUnit.emit(data);
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }
}
