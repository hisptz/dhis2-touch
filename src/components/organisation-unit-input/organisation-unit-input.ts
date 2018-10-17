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
import * as _ from 'lodash';
import { OrganisationUnitsProvider } from '../../providers/organisation-units/organisation-units';
import { ModalController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the OrganisationUnitInputComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'organisation-unit-input',
  templateUrl: 'organisation-unit-input.html'
})
export class OrganisationUnitInputComponent implements OnInit {
  @Input() dataElementId;
  @Input() categoryOptionComboId;
  @Input() data;
  @Output() onChange = new EventEmitter();
  icons: any = {};
  organisatiounitMapper: any;
  seletectOrganisatioUnit: { id: string; name: string };

  constructor(
    private organisationUnitProvider: OrganisationUnitsProvider,
    private userProvider: UserProvider,
    private modalCtrl: ModalController
  ) {
    this.organisatiounitMapper = {};
    this.icons.orgUnit = 'assets/icon/orgUnit.png';
    this.seletectOrganisatioUnit = { id: '', name: '' };
  }

  ngOnInit() {
    this.userProvider.getCurrentUser().subscribe(user => {
      this.organisationUnitProvider
        .getAllOrganisationUnits(user)
        .subscribe((organisationUnits: any) => {
          this.organisatiounitMapper = _.keyBy(organisationUnits, 'id');
          const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
          if (this.data && this.data[fieldId]) {
            const selectedId = this.data[fieldId].value;
            const organisationUnit = this.organisatiounitMapper[selectedId];
            if (
              organisationUnit &&
              organisationUnit.name &&
              organisationUnit.id
            ) {
              this.seletectOrganisatioUnit = {
                id: organisationUnit.id,
                name: organisationUnit.name
              };
            }
          }
        });
    });
  }

  openOrganisationUnitSelection() {
    const modal = this.modalCtrl.create('OrganisationUnitSelectionPage', {});
    modal.onDidDismiss((selectedOrgUnit: any) => {
      if (selectedOrgUnit && selectedOrgUnit.id) {
        this.seletectOrganisatioUnit = {
          id: selectedOrgUnit.id,
          name: selectedOrgUnit.name
        };
        const dataValue = selectedOrgUnit.id;
        this.updateValue(dataValue);
      }
    });
    modal.present();
  }

  clearValue() {
    this.seletectOrganisatioUnit = { id: '', name: '' };
    const dataValue = '';
    this.updateValue(dataValue);
  }

  updateValue(dataValue: string) {
    const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    if (
      this.data &&
      this.data[fieldId] &&
      dataValue != this.data[fieldId].value
    ) {
      this.onChange.emit({
        id: fieldId,
        value: dataValue,
        status: 'not-synced'
      });
    } else if (this.data && !this.data[fieldId]) {
      if (dataValue) {
        this.onChange.emit({
          id: fieldId,
          value: dataValue,
          status: 'not-synced'
        });
      }
    }
  }
}
