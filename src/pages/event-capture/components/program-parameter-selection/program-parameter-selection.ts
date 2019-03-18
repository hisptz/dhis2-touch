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
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { OrganisationUnitsProvider } from '../../../../providers/organisation-units/organisation-units';
import { ProgramsProvider } from '../../../../providers/programs/programs';
import { AppProvider } from '../../../../providers/app/app';
import { CurrentUser } from '../../../../models';

@Component({
  selector: 'program-parameter-selection',
  templateUrl: 'program-parameter-selection.html'
})
export class ProgramParameterSelectionComponent implements OnInit {
  @Input() currentUser: CurrentUser;
  @Input() programIdsByUserRoles: Array<string>;
  @Input() programType: string;
  @Input() selectedDataDimension: any;

  @Output() programParameterSelection = new EventEmitter();

  organisationUnitLabel: string;
  programLabel: string;
  isFormReady: boolean = false;
  isProgramDimensionApplicable: boolean;
  programDimensionNotApplicableMessage: string;
  programCategoryCombo: any;
  programs: Array<any>;
  icons: any = {};

  selectedOrgUnit: any;
  selectedProgram: any;
  dataDimension: any;

  constructor(
    private modalCtrl: ModalController,
    private organisationUnitsProvider: OrganisationUnitsProvider,
    private programsProvider: ProgramsProvider,
    private appProvider: AppProvider
  ) {
    this.icons = {
      orgUnit: 'assets/icon/orgUnit.png',
      program: 'assets/icon/program.png'
    };
    this.isProgramDimensionApplicable = false;
  }

  ngOnInit() {
    if (this.programType && this.currentUser && this.programIdsByUserRoles) {
      this.organisationUnitsProvider
        .getLastSelectedOrganisationUnitUnit(this.currentUser)
        .subscribe((lastSelectedOrgUnit: any) => {
          if (lastSelectedOrgUnit && lastSelectedOrgUnit.id) {
            this.selectedOrgUnit = lastSelectedOrgUnit;
            this.loadingPrograms();
          }
          this.updateProgramParameterSelections();
        });
    }
  }

  updateProgramParameterSelections() {
    if (this.organisationUnitsProvider.lastSelectedOrgUnit) {
      this.selectedOrgUnit = this.organisationUnitsProvider.lastSelectedOrgUnit;
      this.organisationUnitLabel = this.selectedOrgUnit.name;
    } else {
      this.organisationUnitLabel = 'Touch to select organisation unit';
    }
    if (this.selectedProgram && this.selectedProgram.name) {
      this.programLabel = this.selectedProgram.name;
    } else {
      this.programLabel = 'Touch to select program';
    }
    const isFormReady = this.isAllParameterSelected();
    let parameter = {
      selectedOrgUnit: null,
      selectedProgram: null,
      dataDimension: null,
      selectedDataDimension: this.selectedDataDimension,
      isFormReady
    };
    if (isFormReady) {
      parameter.selectedOrgUnit = {
        id: this.selectedOrgUnit.id,
        name: this.selectedOrgUnit.name
      };
      parameter.selectedProgram = {
        id: this.selectedProgram.id,
        name: this.selectedProgram.name
      };
      parameter.dataDimension = this.getDataDimensions();
      parameter.isFormReady = isFormReady;
    }
    this.programParameterSelection.emit(parameter);
  }

  isAllParameterSelected() {
    let isFormReady = true;
    if (
      this.selectedProgram &&
      this.selectedProgram.name &&
      this.selectedProgram.categoryCombo.name &&
      this.selectedProgram.categoryCombo.name != 'default'
    ) {
      if (
        this.selectedDataDimension &&
        this.selectedDataDimension.length > 0 &&
        this.programCategoryCombo &&
        this.programCategoryCombo.categories &&
        this.selectedDataDimension.length ==
          this.programCategoryCombo.categories.length
      ) {
        let count = 0;
        this.selectedDataDimension.forEach(() => {
          count++;
        });
        if (count != this.selectedDataDimension.length) {
          isFormReady = false;
        }
      } else {
        isFormReady = false;
      }
    } else if (!this.selectedProgram) {
      isFormReady = false;
    }
    return isFormReady;
  }

  loadingPrograms() {
    this.programsProvider
      .getProgramsAssignedOnOrgUnitAndUserRoles(
        this.selectedOrgUnit.id,
        this.programType,
        this.programIdsByUserRoles,
        this.currentUser
      )
      .subscribe(
        (programs: any) => {
          this.programs = programs;
          this.selectedProgram = this.programsProvider.lastSelectedProgram;
          this.updateProgramParameterSelections();
          if (this.selectedProgram && this.selectedProgram.categoryCombo) {
            this.updateDataSetCategoryCombo(this.selectedProgram.categoryCombo);
          }
        },
        error => {
          console.log(JSON.stringify(error));
          this.appProvider.setNormalNotification(
            'Failed to discover assigned programs'
          );
        }
      );
  }

  updateDataSetCategoryCombo(categoryCombo) {
    if (categoryCombo) {
      let programCategoryCombo = {};
      this.isProgramDimensionApplicable = false;
      if (categoryCombo.name != 'default') {
        programCategoryCombo['id'] = categoryCombo.id;
        programCategoryCombo['name'] = categoryCombo.name;
        let categories = this.programsProvider.getProgramCategoryComboCategories(
          this.selectedOrgUnit.id,
          categoryCombo.categories
        );
        programCategoryCombo['categories'] = categories;
        this.isProgramDimensionApplicable = true;
        categories.map((category: any) => {
          if (
            category.categoryOptions &&
            category.categoryOptions.length == 0
          ) {
            this.isProgramDimensionApplicable = false;
          }
        });
        this.programDimensionNotApplicableMessage =
          'All of selected category disaggregation are restricted from entry in selcted organisation unit, choose a different form or contact your support desk';
      }
      this.selectedDataDimension = this.selectedDataDimension
        ? this.selectedDataDimension
        : [];
      this.programCategoryCombo = programCategoryCombo;
      this.updateProgramParameterSelections();
    }
  }

  openOrganisationUnitTree() {
    let modal = this.modalCtrl.create('OrganisationUnitSelectionPage', {
      filterType: this.programType
    });
    modal.onDidDismiss((selectedOrgUnit: any) => {
      if (selectedOrgUnit && selectedOrgUnit.id) {
        this.selectedOrgUnit = selectedOrgUnit;
        this.updateProgramParameterSelections();
        this.loadingPrograms();
      }
    });
    modal.present();
  }

  openProgramList() {
    if (this.programs && this.programs.length > 0) {
      let modal = this.modalCtrl.create('ProgramSelection', {
        currentProgram: this.selectedProgram,
        programsList: this.programs
      });
      modal.onDidDismiss((selectedProgram: any) => {
        if (selectedProgram && selectedProgram.id) {
          this.selectedProgram = selectedProgram;
          this.programsProvider.setLastSelectedProgram(selectedProgram);
          this.updateProgramParameterSelections();
          this.updateDataSetCategoryCombo(this.selectedProgram.categoryCombo);
        }
      });
      modal.present();
    } else {
      this.appProvider.setNormalNotification('There are no program to select');
    }
  }

  openDataDimensionSelection(category) {
    if (
      category.categoryOptions &&
      category.categoryOptions &&
      category.categoryOptions.length > 0
    ) {
      const currentIndex = this.programCategoryCombo.categories.indexOf(
        category
      );
      const modal = this.modalCtrl.create('DataDimensionSelectionPage', {
        categoryOptions: category.categoryOptions,
        title: category.name,
        currentSelection: this.selectedDataDimension[currentIndex]
          ? this.selectedDataDimension[currentIndex]
          : {}
      });
      modal.onDidDismiss((selectedDataDimension: any) => {
        if (selectedDataDimension && selectedDataDimension.id) {
          this.selectedDataDimension[currentIndex] = selectedDataDimension;
          this.updateProgramParameterSelections();
        }
      });
      modal.present();
    } else {
      const message =
        'There is no option for selected category that associated with selected organisation unit';
      this.appProvider.setNormalNotification(message);
    }
  }

  getDataDimensions() {
    if (this.selectedProgram && this.selectedProgram.categoryCombo) {
      const attributeCc = this.selectedProgram.categoryCombo.id;
      let attributeCos = '';
      if (this.selectedDataDimension) {
        this.selectedDataDimension.map((dimension: any, index: any) => {
          if (index == 0) {
            attributeCos += dimension.id;
          } else {
            attributeCos += ';' + dimension.id;
          }
        });
      }
      return { attributeCc: attributeCc, attributeCos: attributeCos };
    } else {
      return {};
    }
  }
}
