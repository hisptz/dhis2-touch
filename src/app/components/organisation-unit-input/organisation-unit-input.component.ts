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
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as _ from 'lodash';
import { OrganisationUnitService } from 'src/app/services/organisation-unit.service';
import { OrganisationUnitSelectionPage } from 'src/app/modals/organisation-unit-selection/organisation-unit-selection.page';
import { ToasterMessagesService } from 'src/app/services/toaster-messages.service';

@Component({
  selector: 'app-organisation-unit-input',
  templateUrl: './organisation-unit-input.component.html',
  styleUrls: ['./organisation-unit-input.component.scss']
})
export class OrganisationUnitInputComponent implements OnInit {
  @Input() dataElementId: string;
  @Input() categoryOptionComboId: string;
  @Input() data: any;
  @Input() lockingFieldStatus: boolean;

  @Output() organisationUnitChange = new EventEmitter();

  organisationUnitLabel: string;
  organisationUnitId: string;

  constructor(
    private modalController: ModalController,
    private organisationUnitService: OrganisationUnitService,
    private toasterMessagesService: ToasterMessagesService
  ) {
    this.organisationUnitLabel = '';
    this.organisationUnitId = '';
  }

  ngOnInit() {
    const id = `${this.dataElementId}-${this.categoryOptionComboId}`;
    this.data = this.data || {};
    if (this.data && this.data[id]) {
      this.organisationUnitId = this.data[id].value;
      this.discoveringSelectedOrganisationUnit(this.organisationUnitId);
    }
  }

  async discoveringSelectedOrganisationUnit(organisationUnitId: string) {
    try {
      const organisatinUnits = await this.organisationUnitService.getOrganiisationUnitByIds(
        [organisationUnitId]
      );
      this.organisationUnitLabel =
        organisatinUnits && organisatinUnits.length > 0
          ? organisatinUnits[0].name
          : '';
    } catch (error) {
      const message = `Error ${JSON.stringify(error)}`;
      console.log({ message });
      this.toasterMessagesService.showToasterMessage(message);
    }
  }

  clearValue() {
    const value = '';
    this.organisationUnitLabel = value;
    this.organisationUnitId = value;
    this.updateValue(value);
  }

  async openOrganisationUnitSetSelectionModal() {
    const modal = await this.modalController.create({
      component: OrganisationUnitSelectionPage,
      componentProps: {
        selectedOrganisayionUnitIds: [this.organisationUnitId]
      }
    });
    modal.present();
    const response = await modal.onDidDismiss();
    if (response && response.data) {
      const { data } = response;
      const { id, name } = data;
      this.organisationUnitLabel = name;
      this.organisationUnitId = id;
      this.updateValue(id);
    }
  }

  updateValue(value: string) {
    const id = `${this.dataElementId}-${this.categoryOptionComboId}`;
    const status = 'not-sync';
    if (
      this.data &&
      (!this.data[id] || (this.data[id] && value !== this.data[id].value))
    ) {
      this.organisationUnitChange.emit({ id, value, status });
    }
  }
}
