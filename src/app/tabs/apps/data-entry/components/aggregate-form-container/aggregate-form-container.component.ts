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
import {
  CurrentEntrySelection,
  AppColorObject,
  DataSet,
  Indicator,
  DataEntryFormSection,
  AppSetting,
  DataSetOperand,
  ValidationRule
} from 'src/models';
import { DataEntryFormService } from '../../services/data-entry-form.service';
import { ToasterMessagesService } from 'src/app/services/toaster-messages.service';
import { IndicatorService } from 'src/app/services/indicator.service';
import { SettingService } from 'src/app/services/setting.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-aggregate-form-container',
  templateUrl: './aggregate-form-container.component.html',
  styleUrls: ['./aggregate-form-container.component.scss']
})
export class AggregateFormContainerComponent implements OnInit {
  @Input() currentEntrySelection: CurrentEntrySelection;
  @Input() isPeriodLocked: boolean;
  @Input() colorSettings: AppColorObject;

  @Output() entryFormStatusChange = new EventEmitter();

  isLoading: boolean;
  dataSet: DataSet;
  indicators: Indicator[];
  dataEntryFormSection: DataEntryFormSection[];
  dataEntryFormDesign: string;
  appSettings: AppSetting;
  compulsoryDataElementOperands: DataSetOperand[];
  validationRules: ValidationRule[];

  constructor(
    private dataEntryFormService: DataEntryFormService,
    private toasterMessagesService: ToasterMessagesService,
    private indicatorService: IndicatorService,
    private settingService: SettingService,
    private userService: UserService
  ) {
    this.isLoading = true;
    this.indicators = [];
  }

  ngOnInit() {
    const dataSetId = this.currentEntrySelection.selectedDataSet.id;

    this.discoveringAndSetAppSetting(dataSetId);
  }

  async discoveringAndSetAppSetting(dataSetId: string) {
    const currentUser = await this.userService.getCurrentUser();
    this.appSettings = await this.settingService.getCurrentSettingsForTheApp(
      currentUser
    );
    this.discoveringDataSetInformation(dataSetId);
  }

  async discoveringDataSetInformation(dataSetId: string) {
    const dataSetInformation = await this.dataEntryFormService.discoveringDataSetInformation(
      dataSetId
    );
    const { data, error } = dataSetInformation;
    if (!error) {
      const { dataSet, sectionIds, indicatorIds } = data;
      this.dataSet = dataSet;
      this.discoveringAndSetIndicators(indicatorIds);
      this.discoveringAndSetEntryFormMetadata(
        dataSet,
        sectionIds,
        this.appSettings
      );
    } else {
      const message = `Error : ${error}`;
      this.toasterMessagesService.showToasterMessage(message);
    }
  }

  async discoveringAndSetIndicators(indicatorIds: string[]) {
    const indicators = await this.indicatorService.getAggregateIndicators(
      indicatorIds
    );
    this.indicators = indicators;
  }

  async discoveringAndSetEntryFormMetadata(
    dataSet: DataSet,
    sectionIds: string[],
    appSettings: AppSetting
  ) {
    const entryFormResponse = await this.dataEntryFormService.getEntryFormMetadata(
      dataSet,
      sectionIds,
      appSettings
    );
    const {
      validationRules,
      dataEntryFormSection,
      dataEntryFormDesign
    } = entryFormResponse;
    this.dataEntryFormSection = dataEntryFormSection;
    this.dataEntryFormDesign = dataEntryFormDesign;
    this.validationRules = validationRules;
    this.discoveringAndSetComponsaryEntryFields(dataSet.id || '');
  }

  async discoveringAndSetComponsaryEntryFields(dataSetId: string) {
    this.compulsoryDataElementOperands = await this.dataEntryFormService.getDataSetOperandsByDataSetId(
      dataSetId
    );
    this.isLoading = false;
  }

  async discoverigAndSetOfflineDataValues() {}
}
