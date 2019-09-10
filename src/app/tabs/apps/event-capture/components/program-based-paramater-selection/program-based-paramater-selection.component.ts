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
import { Option, CurrentEntrySelection } from 'src/models';
import { OrganisationUnitSelectionPage } from 'src/app/modals/organisation-unit-selection/organisation-unit-selection.page';
import { OptionSetSelectionPage } from 'src/app/modals/option-set-selection/option-set-selection.page';

@Component({
  selector: 'app-program-based-paramater-selection',
  templateUrl: './program-based-paramater-selection.component.html',
  styleUrls: ['./program-based-paramater-selection.component.scss']
})
export class ProgramBasedParamaterSelectionComponent implements OnInit {
  @Input() currentEntrySelection: CurrentEntrySelection;

  @Output() currentSelectionChange = new EventEmitter();

  organisationUnitIcon: string;
  programIcon: string;
  organisationUnitLabel: string;
  programLabel: string;
  isFormReady: boolean;
  isProgramDimensionApplicable: boolean;
  programOptions: Option[];

  constructor(private modalController: ModalController) {
    this.organisationUnitIcon = `assets/icon/orgUnit.png`;
    this.programIcon = 'assets/icon/program.png';
    this.isFormReady = false;
    this.isProgramDimensionApplicable = false;
  }

  ngOnInit() {
    this.organisationUnitLabel = 'Touch to select organisation unit';
    this.programLabel = 'Touch to select program';
  }

  async openOrganisationUnitModal() {
    const modal = await this.modalController.create({
      component: OrganisationUnitSelectionPage,
      componentProps: {
        allowMultipleSelection: false,
        selectedOrganisayionUnitIds: ['V5XvX1wr1kF']
      },
      cssClass: 'inset-modal'
    });
    modal.present();
    const response = await modal.onDidDismiss();
    if (response && response.data) {
      console.log({ data: response.data });
    }
  }

  async OpenProgramListSelectionModal() {
    const modal = await this.modalController.create({
      component: OptionSetSelectionPage,
      componentProps: {
        selectedValue: '',
        options: this.programOptions
      },
      cssClass: 'inset-modal'
    });
    modal.present();
    const response = await modal.onDidDismiss();
    if (response && response.data) {
      console.log({ data: response.data });
    }
  }
}
