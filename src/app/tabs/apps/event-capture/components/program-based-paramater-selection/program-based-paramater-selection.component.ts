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
import { Option, CurrentEntrySelection, Program } from 'src/models';
import { DEFAULT_CURRENT_ENTRY_SELECTION } from 'src/constants';
import { OrganisationUnitSelectionPage } from 'src/app/modals/organisation-unit-selection/organisation-unit-selection.page';
import { OptionSetSelectionPage } from 'src/app/modals/option-set-selection/option-set-selection.page';
import { ProgramSelectionService } from 'src/app/services/program-selection.service';
import { ToasterMessagesService } from 'src/app/services/toaster-messages.service';

@Component({
  selector: 'app-program-based-paramater-selection',
  templateUrl: './program-based-paramater-selection.component.html',
  styleUrls: ['./program-based-paramater-selection.component.scss']
})
export class ProgramBasedParamaterSelectionComponent implements OnInit {
  @Input() currentEntrySelection: CurrentEntrySelection;
  @Input() allowMultipleOuSelection: boolean;
  @Input() authorities: string[];
  @Input() programIdsByUserRoles: string[];
  @Input() programType: string;

  @Output() currentSelectionChange = new EventEmitter();

  organisationUnitIcon: string;
  programIcon: string;
  organisationUnitLabel: string;
  programLabel: string;
  isFormReady: boolean;
  isProgramDimensionApplicable: boolean;
  programOptions: Option[];
  programCategoryCombo: any;
  selectedDataDimension: any[];
  selectedProgram: any;

  constructor(
    private modalController: ModalController,
    private programSelectionService: ProgramSelectionService,
    private toasterMessagesService: ToasterMessagesService
  ) {
    this.organisationUnitIcon = `assets/icon/orgUnit.png`;
    this.programIcon = 'assets/icon/program.png';
    this.isFormReady = false;
    this.isProgramDimensionApplicable = false;
    this.programCategoryCombo = {};
    this.selectedProgram = null;
  }

  ngOnInit() {
    this.allowMultipleOuSelection = this.allowMultipleOuSelection || false;
    this.currentEntrySelection =
      this.currentEntrySelection || DEFAULT_CURRENT_ENTRY_SELECTION;
    this.selectedDataDimension =
      this.currentEntrySelection.selectedDataDimension || [];
    this.setProgramParameterSelections();
  }

  async setProgramParameterSelections() {
    if (
      this.currentEntrySelection &&
      this.currentEntrySelection.selectedOrganisationUnit.name &&
      this.currentEntrySelection.selectedOrganisationUnit.name !== ''
    ) {
      await this.discoveringProgramList();
    } else {
      await this.updateProgramParameterSelections();
    }
  }

  async updateProgramParameterSelections() {
    await this.setOrganisationUnitLabel();
    await this.setProgramLabel();
    await this.setProgramCategoryLabel();
    const isFormReady = await this.isAllParameterSelected();
    setTimeout(() => {
      this.currentSelectionChange.emit({
        isFormReady,
        currentEntrySelection: isFormReady ? this.currentEntrySelection : null
      });
    }, 100);
  }

  async setOrganisationUnitLabel() {
    if (
      this.currentEntrySelection &&
      this.currentEntrySelection.selectedOrganisationUnit.name &&
      this.currentEntrySelection.selectedOrganisationUnit.name !== ''
    ) {
      this.organisationUnitLabel = this.currentEntrySelection.selectedOrganisationUnit.name;
    } else {
      this.organisationUnitLabel = 'Touch to select organisation unit';
    }
  }

  async setProgramLabel() {
    if (this.programType === 'WITHOUT_REGISTRATION') {
      if (
        this.currentEntrySelection &&
        this.currentEntrySelection.selectedProgramWithOutRegistration.name &&
        this.currentEntrySelection.selectedProgramWithOutRegistration.name !==
          ''
      ) {
        this.programLabel = this.currentEntrySelection.selectedProgramWithOutRegistration.name;
      } else {
        this.programLabel = 'Touch to select program';
      }
    }
    if (this.programType === 'WITH_REGISTRATION') {
      if (
        this.currentEntrySelection &&
        this.currentEntrySelection.selectedProgramWithRegistration.name &&
        this.currentEntrySelection.selectedProgramWithRegistration.name !== ''
      ) {
        this.programLabel = this.currentEntrySelection.selectedProgramWithRegistration.name;
      } else {
        this.programLabel = 'Touch to select program';
      }
    }
  }

  async setProgramCategoryLabel() {
    const dataDimension = await this.getDataDimension();
    this.currentEntrySelection = {
      ...this.currentEntrySelection,
      selectedDataDimension: this.selectedDataDimension,
      dataDimension
    };
  }

  async isAllParameterSelected() {
    let isAllParameterSelected = false;
    const isEmptySelectedDimension = _.filter(
      this.selectedDataDimension,
      (item: any) => {
        return _.isEmpty(item);
      }
    );
    if (
      this.selectedProgram &&
      this.selectedProgram.categoryCombo &&
      this.selectedProgram.categoryCombo.name
    ) {
      const { categoryCombo } = this.selectedProgram;
      const { name } = categoryCombo;
      isAllParameterSelected =
        name === 'default'
          ? true
          : isEmptySelectedDimension.length === 0 &&
            this.selectedDataDimension.length > 0
          ? true
          : isAllParameterSelected;
    }
    return isAllParameterSelected;
  }

  async getDataDimension() {
    let attributeCos = '';
    let attributeCc = '';
    if (this.selectedProgram && this.selectedProgram.categoryCombo) {
      const { categoryCombo } = this.selectedProgram;
      attributeCc = categoryCombo && categoryCombo.id ? categoryCombo.id : '';
      if (this.selectedDataDimension.length > 0) {
        attributeCos = _.join(
          _.map(
            _.filter(this.selectedDataDimension, (item: any) => {
              return !_.isEmpty(item);
            }),
            (item: any) => item.id
          ),
          ';'
        );
      }
    }
    return { attributeCos, attributeCc };
  }

  async openOrganisationUnitModal() {
    const organisationUnitId = this.currentEntrySelection
      .selectedOrganisationUnit.id;
    const modal = await this.modalController.create({
      component: OrganisationUnitSelectionPage,
      componentProps: {
        allowMultipleSelection: this.allowMultipleOuSelection,
        selectedOrganisayionUnitIds: [organisationUnitId]
      }
    });
    modal.present();
    const response = await modal.onDidDismiss();
    if (response && response.data) {
      const { id, name } = response.data;
      this.setCurrentOrganisationUnit(id, name);
      await this.discoveringProgramList();
    }
  }

  async openProgramListSelectionModal() {
    const programId =
      this.programType === 'WITHOUT_REGISTRATION'
        ? this.currentEntrySelection.selectedProgramWithOutRegistration.id
        : this.currentEntrySelection.selectedProgramWithRegistration.id;
    const modal = await this.modalController.create({
      component: OptionSetSelectionPage,
      componentProps: {
        selectedValue: programId,
        options: this.programOptions,
        isDisabled: true
      }
    });
    modal.present();
    const response = await modal.onDidDismiss();
    if (response && response.data) {
      const { id, name } = response.data;
      this.setCurrentProgram(id, name);
      await this.discoveringProgramList();
    }
  }

  async openDataDimensionSelection(category: any) {
    const currentIndex = _.indexOf(
      this.programCategoryCombo.categories,
      category
    );
    const selectedValue =
      currentIndex > -1 &&
      this.selectedDataDimension &&
      this.selectedDataDimension[currentIndex]
        ? this.selectedDataDimension[currentIndex].id
        : '';
    const modal = await this.modalController.create({
      component: OptionSetSelectionPage,
      componentProps: {
        selectedValue,
        options: _.map(category.categoryOptions, (categoryOption: any) => {
          const { id } = categoryOption;
          return { ...categoryOption, code: id };
        })
      }
    });
    modal.present();
    const response = await modal.onDidDismiss();
    if (response && response.data) {
      const { id, name } = response.data;
      const selectedDataDimension = { id, name };
      this.setSelectedCategoryOption(selectedDataDimension, category);
    }
  }

  setCurrentOrganisationUnit(id: string, name: string) {
    this.currentEntrySelection.selectedOrganisationUnit = {
      ...this.currentEntrySelection.selectedOrganisationUnit,
      id,
      name
    };
  }

  setSelectedCategoryOption(selectedDataDimension: any, category: any) {
    const currentIndex = _.indexOf(
      this.programCategoryCombo.categories,
      category
    );
    this.selectedDataDimension[currentIndex] = selectedDataDimension;
    this.updateProgramParameterSelections();
  }

  setCurrentProgram(id: string, name: string) {
    if (this.programType === 'WITHOUT_REGISTRATION') {
      this.currentEntrySelection.selectedProgramWithOutRegistration = {
        ...this.currentEntrySelection.selectedProgramWithOutRegistration,
        id,
        name
      };
    }
    if (this.programType === 'WITH_REGISTRATION') {
      this.currentEntrySelection.selectedProgramWithRegistration = {
        ...this.currentEntrySelection.selectedProgramWithRegistration,
        id,
        name
      };
    }
  }

  async discoveringProgramList() {
    try {
      const organisationUnitId = this.currentEntrySelection
        .selectedOrganisationUnit.id;
      const programId =
        this.programType === 'WITHOUT_REGISTRATION'
          ? this.currentEntrySelection.selectedProgramWithOutRegistration.id
          : this.currentEntrySelection.selectedProgramWithRegistration.id;
      const programs: any[] = await this.programSelectionService.getProgramListBySelectedOrganisationUnitAndRoles(
        organisationUnitId,
        this.programType,
        this.programIdsByUserRoles,
        this.authorities
      );
      this.resetCurrentProgramAndProgramList(programs, programId);
      if (programId !== '') {
        this.selectedProgram = _.find(programs, (program: Program) => {
          return program.id === programId;
        });
        if (this.selectedProgram && this.selectedProgram.categoryCombo) {
          await this.setProgramCategoryCombos(
            this.selectedProgram,
            organisationUnitId
          );
        }
      }
      this.programOptions = _.map(programs, (program: any) => {
        const { id, code, name } = program;
        return { id, name, code };
      });
      setTimeout(() => {
        this.updateProgramParameterSelections();
      }, 100);
    } catch (error) {
      const message = `Error : ${JSON.stringify(error)}`;
      this.toasterMessagesService.showToasterMessage(message);
    }
  }

  resetCurrentProgramAndProgramList(programs: any[], programId: string) {
    const programObj: any = _.find(programs, (program: Program) => {
      return program.id === programId;
    });
    if (programObj && programObj.id) {
      const { id, name } = programObj;
      this.setCurrentProgram(id, name);
    } else if (programs && programs.length > 0) {
      const program = programs[0];
      const { id, name } = program;
      this.setCurrentProgram(id, name);
    } else {
      this.setCurrentProgram('', '');
    }
  }

  async setProgramCategoryCombos(
    selectedProgram: Program,
    organisationUnitId: string
  ) {
    this.isProgramDimensionApplicable = false;
    const { categoryCombo } = selectedProgram;
    const { id, name, categories } = categoryCombo;
    this.programCategoryCombo = {};
    if (name !== 'default') {
      this.programCategoryCombo['id'] = id;
      this.programCategoryCombo['name'] = name;
      const categoriesResponse = await this.programSelectionService.getProgramCategoryComboCategories(
        organisationUnitId,
        categories
      );
      this.programCategoryCombo['categories'] = categoriesResponse;
      this.isProgramDimensionApplicable = true;
      for (const category of categoriesResponse) {
        if (
          category &&
          category.categoryOptions &&
          category.categoryOptions.length === 0
        ) {
          this.isProgramDimensionApplicable = false;
        }
      }
    }
    this.selectedDataDimension =
      this.currentEntrySelection.dataDimension.attributeCc === id
        ? []
        : this.currentEntrySelection.selectedDataDimension;
    this.updateProgramParameterSelections();
  }

  trackByFn(index: any, item: any) {
    return item && item.id ? item.id : index;
  }
}
