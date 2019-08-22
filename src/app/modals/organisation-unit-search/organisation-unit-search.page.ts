/*
 *
 * Copyright 2019 HISP Tanzania
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
 * @since 2019
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../store';
import { AppColorObject, OrganisationUnit } from 'src/models';
import { OrganisationUnitService } from 'src/app/services/organisation-unit.service';
import { ToasterMessagesService } from 'src/app/services/toaster-messages.service';

@Component({
  selector: 'app-organisation-unit-search',
  templateUrl: './organisation-unit-search.page.html',
  styleUrls: ['./organisation-unit-search.page.scss']
})
export class OrganisationUnitSearchPage implements OnInit {
  cancelIcon: string;
  colorSettings$: Observable<AppColorObject>;
  selectedOrganisayionUnitIds: string[];
  organisationUnitList: any[];
  organisationUnits: Array<OrganisationUnit[]>;
  currentIndex: number;

  constructor(
    private modalController: ModalController,
    private navParms: NavParams,
    private store: Store<State>,
    private organisationUnitService: OrganisationUnitService,
    private toasterMessagesService: ToasterMessagesService
  ) {
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
    this.cancelIcon = 'assets/icon/cancel.png';
    this.organisationUnitList = [];
    this.organisationUnits = [];
    this.currentIndex = 0;
  }

  ngOnInit() {
    this.selectedOrganisayionUnitIds = this.navParms.get(
      'selectedOrganisayionUnitIds'
    );
    this.discoveringAndSetHierarchy();
  }

  async discoveringAndSetHierarchy() {
    try {
      const allOrganisationUnit = this.navParms.get('organisationUnitList');
      this.organisationUnitList = _.sortBy(
        _.map(allOrganisationUnit, (organisationUnit: OrganisationUnit) => {
          const { name, ancestors } = organisationUnit;
          const lastAncestors: OrganisationUnit = _.last(ancestors);
          const organisationUnitPathName =
            lastAncestors && lastAncestors.name
              ? `${lastAncestors.name}/${name}`
              : `${name}`;
          return { ...organisationUnit, name: organisationUnitPathName };
        }),
        'name'
      );
      this.setOrganisationUnitSelections(this.organisationUnitList);
    } catch (error) {
      const message = `Error ${JSON.stringify(error)}`;
      console.log({ message });
      this.toasterMessagesService.showToasterMessage(message);
    }
  }

  getFilteredList(data: { target: { value: string } }) {
    const value = data.target.value || '';
    const organisationUnits: OrganisationUnit[] = _.filter(
      this.organisationUnitList,
      (organisationUnit: OrganisationUnit) => {
        const { name } = organisationUnit;
        return name.toLowerCase().includes(value.toLowerCase());
      }
    );
    this.setOrganisationUnitSelections(organisationUnits);
  }

  setOrganisationUnitSelections(data: OrganisationUnit[]) {
    this.currentIndex = 0;
    const pageSize = 250;
    this.organisationUnits = _.chunk(data, pageSize);
  }

  previousPage() {
    this.currentIndex--;
  }

  nextPage() {
    this.currentIndex++;
  }

  clearValue() {
    const orgaganisationUnit: OrganisationUnit = {
      id: '',
      name: '',
      ancestors: [],
      children: [],
      parent: null
    };
    this.closeModal(orgaganisationUnit);
  }

  async setSelectedOrganisationUnit(data: OrganisationUnit) {
    const { id } = data;
    const selectedOrganisationUnit = _.find(
      this.navParms.get('organisationUnitList'),
      (organisationUnit: OrganisationUnit) => {
        return organisationUnit.id === id;
      }
    );
    this.closeModal(selectedOrganisationUnit);
  }

  async closeModal(data?: OrganisationUnit) {
    await this.modalController.dismiss(data);
  }

  trackByFn(index: any, organisationUnit: OrganisationUnit) {
    return organisationUnit && organisationUnit.id
      ? organisationUnit.id
      : index;
  }
}
