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
import {
  Option,
  CurrentEntrySelection,
  DataSet,
  AgggregatePeriod
} from 'src/models';
import { DEFAULT_CURRENT_ENTRY_SELECTION } from 'src/constants';
import { OrganisationUnitSelectionPage } from 'src/app/modals/organisation-unit-selection/organisation-unit-selection.page';
import { OptionSetSelectionPage } from 'src/app/modals/option-set-selection/option-set-selection.page';
import { PeriodSelectionPage } from 'src/app/modals/period-selection/period-selection.page';
import { ToasterMessagesService } from 'src/app/services/toaster-messages.service';
import { DataSetSelectionService } from 'src/app/services/data-set-selection.service';
import { getCategoryComboCategories } from 'src/helpers';

@Component({
  selector: 'app-aggegate-parameter-selection',
  templateUrl: './aggegate-parameter-selection.component.html',
  styleUrls: ['./aggegate-parameter-selection.component.scss']
})
export class AggegateParameterSelectionComponent implements OnInit {
  @Input() currentEntrySelection: CurrentEntrySelection;
  @Input() allowMultipleOuSelection: boolean;
  @Input() authorities: string[];
  @Input() dataSetIdsByUserRoles: string[];
  @Input() calendarId: string;

  @Output() currentSelectionChange = new EventEmitter();

  dataSetIcon: string;
  organisationUnitIcon: string;
  periodIcon: string;
  organisationUnitLabel: string;
  dataSetLabel: string;
  periodLabel: string;
  selectedDataDimension: any;
  selectedDataSet: any;
  dataSetCategoryCombo: any;
  dataSetOptions: Option[];
  isDataSetDimensionApplicable: boolean;
  currentPeriodOffset: number;
  previousDataSetId: string;

  constructor(
    private modalController: ModalController,
    private toasterMessagesService: ToasterMessagesService,
    private dataSetSelectionService: DataSetSelectionService
  ) {
    this.organisationUnitIcon = 'assets/icon/orgUnit.png';
    this.dataSetIcon = 'assets/icon/form.png';
    this.periodIcon = 'assets/icon/period.png';
    this.dataSetCategoryCombo = {};
    this.dataSetOptions = [];
    this.isDataSetDimensionApplicable = false;
  }

  ngOnInit() {
    this.allowMultipleOuSelection = this.allowMultipleOuSelection || false;
    this.currentEntrySelection =
      this.currentEntrySelection || DEFAULT_CURRENT_ENTRY_SELECTION;
    this.selectedDataDimension =
      this.currentEntrySelection.selectedDataDimension || [];
    this.previousDataSetId =
      this.currentEntrySelection.selectedDataSet.id || '';
    this.currentPeriodOffset =
      this.currentEntrySelection.selectedPeriod.currentPeriodOffset || 0;
    this.setDataSetParameterSelections();
  }

  async setDataSetParameterSelections() {
    if (
      this.currentEntrySelection &&
      this.currentEntrySelection.selectedOrganisationUnit.name &&
      this.currentEntrySelection.selectedOrganisationUnit.name !== ''
    ) {
      await this.discoveringDataSetList();
    } else {
      await this.updateDataSetParameterSelections();
    }
  }

  async updateDataSetParameterSelections() {
    await this.setOrganisationUnitLabel();
    await this.setDataSetLabel();
    await this.setPeriodLabel();
    await this.setDataSetCategory();
    const isFormReady = await this.isAllParameterSelected();
    setTimeout(() => {
      this.currentSelectionChange.emit({
        isFormReady,
        currentEntrySelection: isFormReady ? this.currentEntrySelection : null
      });
    }, 100);
  }

  async setOrganisationUnitLabel() {
    this.organisationUnitLabel =
      this.currentEntrySelection &&
      this.currentEntrySelection.selectedOrganisationUnit.name &&
      this.currentEntrySelection.selectedOrganisationUnit.name !== ''
        ? this.currentEntrySelection.selectedOrganisationUnit.name
        : 'Touch to select organisation unit';
  }

  async setDataSetLabel() {
    this.dataSetLabel =
      this.currentEntrySelection &&
      this.currentEntrySelection.selectedDataSet.name &&
      this.currentEntrySelection.selectedDataSet.name !== ''
        ? this.currentEntrySelection.selectedDataSet.name
        : 'Touch to select program';
  }

  async setPeriodLabel() {
    this.periodLabel =
      this.currentEntrySelection &&
      this.currentEntrySelection.selectedPeriod.name &&
      this.currentEntrySelection.selectedPeriod.name !== ''
        ? this.currentEntrySelection.selectedPeriod.name
        : 'Touch to select period';
  }

  async setDataSetCategory() {
    const dataDimension = await this.getDataDimension();
    this.currentEntrySelection = {
      ...this.currentEntrySelection,
      selectedDataDimension: this.isDataSetDimensionApplicable
        ? this.selectedDataDimension
        : [],
      dataDimension
    };
  }

  async getDataDimension() {
    let attributeCos = '';
    let attributeCc = '';
    if (this.selectedDataSet && this.selectedDataSet.categoryCombo) {
      const { categoryCombo } = this.selectedDataSet;
      attributeCc = categoryCombo && categoryCombo.id ? categoryCombo.id : '';
      if (
        this.selectedDataDimension.length > 0 &&
        this.isDataSetDimensionApplicable
      ) {
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

  async isAllParameterSelected() {
    let isAllParameterSelected = false;
    const isEmptySelectedDimension = _.filter(
      this.selectedDataDimension,
      (item: any) => {
        return _.isEmpty(item);
      }
    );
    if (
      this.selectedDataSet &&
      this.selectedDataSet.categoryCombo &&
      this.selectedDataSet.categoryCombo.name
    ) {
      const { categoryCombo } = this.selectedDataSet;
      const { name } = categoryCombo;
      isAllParameterSelected =
        name === 'default'
          ? true
          : isEmptySelectedDimension.length === 0 &&
            this.selectedDataDimension.length > 0
          ? true
          : isAllParameterSelected;
    }
    return (
      isAllParameterSelected &&
      this.currentEntrySelection &&
      this.currentEntrySelection.selectedPeriod &&
      this.currentEntrySelection.selectedPeriod.id !== ''
    );
  }

  async discoveringDataSetList() {
    try {
      const organisationUnitId = this.currentEntrySelection
        .selectedOrganisationUnit.id;
      const dataSetId = this.currentEntrySelection.selectedDataSet.id;
      const dataSets: any[] = await this.dataSetSelectionService.getDataSetListBySelectedOrganisationUnitAndRoles(
        organisationUnitId,
        this.dataSetIdsByUserRoles,
        this.authorities
      );
      await this.resetCurrentPeriodOffset(dataSets, dataSetId);
      await this.resetCurrentDataSetAndDataSetList(dataSets, dataSetId);
      if (this.currentEntrySelection.selectedDataSet.id !== '') {
        this.selectedDataSet = _.find(dataSets, (dataSet: DataSet) => {
          return dataSet.id === this.currentEntrySelection.selectedDataSet.id;
        });
        if (this.selectedDataSet && this.selectedDataSet.categoryCombo) {
          await this.setDataSetCategoryCombos(
            this.selectedDataSet,
            organisationUnitId
          );
        }
      }
      this.dataSetOptions = _.map(dataSets, (dataSet: DataSet) => {
        const { id, name } = dataSet;
        return { id, name, code: id };
      });
      setTimeout(() => {
        this.updateDataSetParameterSelections();
      }, 100);
    } catch (error) {
      const message = `Error : ${JSON.stringify(error)}`;
      this.toasterMessagesService.showToasterMessage(message);
    }
  }

  async setDataSetCategoryCombos(
    selectedDataSet: DataSet,
    organisationUnitId: string
  ) {
    this.isDataSetDimensionApplicable = false;
    const { categoryCombo } = selectedDataSet;
    const { id, name, categories } = categoryCombo;
    this.dataSetCategoryCombo = {};
    if (name !== 'default') {
      this.dataSetCategoryCombo['id'] = id;
      this.dataSetCategoryCombo['name'] = name;
      const categoriesResponse = await getCategoryComboCategories(
        organisationUnitId,
        categories
      );
      this.dataSetCategoryCombo['categories'] = categoriesResponse;
      this.isDataSetDimensionApplicable = true;
      for (const category of categoriesResponse) {
        if (
          category &&
          category.categoryOptions &&
          category.categoryOptions.length === 0
        ) {
          this.isDataSetDimensionApplicable = false;
        }
      }
    }
    this.selectedDataDimension =
      this.currentEntrySelection.dataDimension.attributeCc === id
        ? []
        : this.currentEntrySelection.selectedDataDimension;
    await this.updateDataSetParameterSelections();
  }

  async resetCurrentPeriodOffset(dataSets: any[], dataSetId: string) {
    const previousDataSetObj: any = _.find(dataSets, (dataSet: DataSet) => {
      return dataSet.id === this.previousDataSetId;
    });
    const currentDataSetObj: any = _.find(dataSets, (dataSet: DataSet) => {
      return dataSet.id === dataSetId;
    });
    let currentPeriodOffset = 0;
    if (currentDataSetObj && previousDataSetObj) {
      if (
        previousDataSetObj.hasOwnProperty('periodType') &&
        previousDataSetObj.hasOwnProperty('openFuturePeriods') &&
        currentDataSetObj.hasOwnProperty('periodType') &&
        currentDataSetObj.hasOwnProperty('openFuturePeriods') &&
        previousDataSetObj.periodType === currentDataSetObj.periodType &&
        previousDataSetObj.openFuturePeriods ===
          currentDataSetObj.openFuturePeriods
      ) {
        currentPeriodOffset = this.currentPeriodOffset;
      } else if (this.previousDataSetId !== dataSetId) {
        this.currentEntrySelection.selectedPeriod =
          DEFAULT_CURRENT_ENTRY_SELECTION.selectedPeriod;
      }
    }
    this.currentPeriodOffset = currentPeriodOffset;
  }

  async resetCurrentDataSetAndDataSetList(dataSets: any[], dataSetId: string) {
    const dataSetObj: any = _.find(dataSets, (dataSet: DataSet) => {
      return dataSet.id === dataSetId;
    });
    if (dataSetObj && dataSetObj.id) {
      const { id, name } = dataSetObj;
      this.setCurrentDataSet(id, name);
    } else if (dataSets && dataSets.length > 0) {
      const dataSet = dataSets[0];
      const { id, name } = dataSet;
      this.setCurrentDataSet(id, name);
    } else {
      this.setCurrentDataSet('', '');
    }
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
      await this.setOrganisationUnitLabel();
      await this.discoveringDataSetList();
    }
  }

  async openDataSetModal() {
    const dataSetId = this.currentEntrySelection.selectedDataSet.id;
    this.previousDataSetId = dataSetId;
    const modal = await this.modalController.create({
      component: OptionSetSelectionPage,
      componentProps: {
        selectedValue: dataSetId,
        options: this.dataSetOptions,
        isDisabled: true
      }
    });
    modal.present();
    const response = await modal.onDidDismiss();
    if (response && response.data) {
      const { id, name } = response.data;
      this.setCurrentDataSet(id, name);
      await this.discoveringDataSetList();
    }
  }

  async openPeriodModal() {
    const { openFuturePeriods, periodType } = this.selectedDataSet;
    const periodIso = this.currentEntrySelection.selectedPeriod.iso;
    const modal = await this.modalController.create({
      component: PeriodSelectionPage,
      componentProps: {
        selectedValue: periodIso,
        calendarId: this.calendarId,
        currentPeriodOffset: this.currentPeriodOffset,
        openFuturePeriods,
        periodType
      }
    });
    modal.present();
    const response = await modal.onDidDismiss();
    if (response && response.data) {
      const { selectedPeriod, currentPeriodOffset } = response.data;
      await this.setCurrentPeriod(selectedPeriod, currentPeriodOffset);
      await this.updateDataSetParameterSelections();
    }
  }

  async openDataDimensionSelection(category: any) {
    const currentIndex = _.indexOf(
      this.dataSetCategoryCombo.categories,
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

  async setCurrentOrganisationUnit(id: string, name: string) {
    this.currentEntrySelection.selectedOrganisationUnit = {
      ...this.currentEntrySelection.selectedOrganisationUnit,
      id,
      name
    };
  }

  async setCurrentDataSet(id: string, name: string) {
    this.currentEntrySelection.selectedDataSet = {
      ...this.currentEntrySelection.selectedDataSet,
      id,
      name
    };
  }

  async setCurrentPeriod(
    selectedPeriod: AgggregatePeriod,
    currentPeriodOffset: number
  ) {
    this.currentPeriodOffset = currentPeriodOffset || this.currentPeriodOffset;
    selectedPeriod =
      selectedPeriod || this.currentEntrySelection.selectedPeriod;
    selectedPeriod = { ...selectedPeriod, currentPeriodOffset };
    this.currentEntrySelection = {
      ...this.currentEntrySelection,
      selectedPeriod
    };
  }

  async setSelectedCategoryOption(selectedDataDimension: any, category: any) {
    const currentIndex = _.indexOf(
      this.dataSetCategoryCombo.categories,
      category
    );
    this.selectedDataDimension[currentIndex] = selectedDataDimension;
    this.updateDataSetParameterSelections();
  }
}
