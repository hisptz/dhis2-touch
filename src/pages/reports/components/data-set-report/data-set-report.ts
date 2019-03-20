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
import { Component, Input, OnInit } from '@angular/core';
import { AppProvider } from '../../../../providers/app/app';
import { DataSetReportProvider } from '../../../../providers/data-set-report/data-set-report';

import { SettingsProvider } from '../../../../providers/settings/settings';
import { DataEntryFormProvider } from '../../../../providers/data-entry-form/data-entry-form';

/**
 * Generated class for the DataSetReportComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'data-set-report',
  templateUrl: 'data-set-report.html'
})
export class DataSetReportComponent implements OnInit {
  @Input()
  dataSetId;
  @Input()
  selectedPeriod;
  @Input()
  selectedOrganisationUnit;
  @Input()
  currentUser;

  isLoading: boolean;
  loadingMessage: string;
  dataSet: any;
  sectionIds: any;
  appSettings: any;
  entryFormSections: any;
  dataElementDataValuesMapper: any;
  dataSetReportAggregateValues: any;
  entryFormType: string;
  dataEntryFormDesign: string;

  constructor(
    private appProvider: AppProvider,
    private settingsProvider: SettingsProvider,
    private dataEntryFormProvider: DataEntryFormProvider,
    private dataSetReportProvider: DataSetReportProvider
  ) {
    this.dataSetReportAggregateValues = {};
    this.isLoading = true;
    this.dataElementDataValuesMapper = {};
    this.dataEntryFormDesign = '';
  }

  ngOnInit() {
    this.loadingDataSetInformation();
  }

  loadingDataSetInformation() {
    if (this.currentUser) {
      this.settingsProvider
        .getSettingsForTheApp(this.currentUser)
        .subscribe((appSettings: any) => {
          this.appSettings = appSettings;
          this.loadingMessage = 'Discovering data set report information';
          this.dataEntryFormProvider
            .loadingDataSetInformation(this.dataSetId, this.currentUser)
            .subscribe(
              (dataSetInformation: any) => {
                this.dataSet = dataSetInformation.dataSet;
                this.sectionIds = dataSetInformation.sectionIds;
                this.loadingMessage = 'Preparing data set report';
                this.dataEntryFormProvider
                  .getEntryForm(
                    this.sectionIds,
                    this.dataSet.id,
                    this.dataSet.formType,
                    this.appSettings,
                    this.currentUser
                  )
                  .subscribe(
                    (entryFormResponse: any) => {
                      if (
                        this.dataSet.formType == 'CUSTOM' &&
                        this.appSettings &&
                        this.appSettings.entryForm &&
                        this.appSettings.entryForm.formLayout &&
                        this.appSettings.entryForm.formLayout == 'customLayout'
                      ) {
                        this.dataEntryFormDesign = entryFormResponse.entryForm;
                        this.entryFormSections =
                          entryFormResponse.entryFormSections;
                        this.entryFormType = 'CUSTOM';
                      } else {
                        this.entryFormSections = entryFormResponse;
                        this.entryFormType = 'SECTION';
                      }
                      const dataElements = [];
                      this.entryFormSections.map((section: any) => {
                        section.dataElements.map((dataElement: any) => {
                          dataElements.push(dataElement);
                          this.dataElementDataValuesMapper[dataElement.id] = [];
                        });
                      });
                      this.dataSetReportProvider
                        .getReportValues(
                          this.selectedOrganisationUnit,
                          this.dataSetId,
                          this.selectedPeriod.iso,
                          this.currentUser
                        )
                        .subscribe(
                          (dataValuesResponse: any) => {
                            dataValuesResponse.map((dataValue: any) => {
                              this.dataElementDataValuesMapper[
                                dataValue.de
                              ].push(dataValue);
                            });
                            if (dataElements.length > 0) {
                              dataElements.map(dataElement => {
                                const data = this.dataElementDataValuesMapper[
                                  dataElement.id
                                ];
                                this.setReportValues(data, dataElement);
                              });
                            }
                            this.isLoading = false;
                          },
                          error => {
                            this.isLoading = false;
                          }
                        );
                    },
                    error => {
                      this.isLoading = false;
                      this.loadingMessage = '';
                      this.appProvider.setNormalNotification(
                        'Failed to prepare data set report'
                      );
                    }
                  );
              },
              error => {
                this.isLoading = false;
                this.loadingMessage = '';
                this.appProvider.setNormalNotification(
                  'Failed to discover data set report information'
                );
              }
            );
        });
    }
  }
  setReportValues(dataValues, dataElement) {
    let validAggregatedTypes = [
      'INTEGER_NEGATIVE',
      'INTEGER_POSITIVE',
      'INTEGER',
      'NUMBER',
      'INTEGER_ZERO_OR_POSITIVE'
    ];
    let categoryComboValues = {};
    dataValues.map((dataValue: any) => {
      if (!categoryComboValues[dataValue.co]) {
        categoryComboValues[dataValue.co] = [];
      }
      categoryComboValues[dataValue.co].push(dataValue.value);
    });
    if (
      dataElement &&
      dataElement.categoryCombo &&
      dataElement.categoryCombo.categoryOptionCombos
    ) {
      dataElement.categoryCombo.categoryOptionCombos.map(
        (categoryOptionCombo: any) => {
          let id = dataElement.id + '-' + categoryOptionCombo.id;
          let values = categoryComboValues[categoryOptionCombo.id];
          if (validAggregatedTypes.indexOf(dataElement.valueType) > -1) {
            this.dataSetReportAggregateValues[id] = this.getAggregatedValue(
              values,
              dataElement.aggregationType
            );
          } else {
            this.dataSetReportAggregateValues[id] =
              values && values.length > 0 ? values[0] : '';
          }
        }
      );
    }
  }

  getAggregatedValue(values, aggregationType) {
    let aggregatedValue = 0;
    if (values && values.length > 0) {
      if (aggregationType == 'SUM') {
        values.map(value => {
          aggregatedValue += parseFloat(value);
        });
      } else if (aggregationType == 'AVERAGE') {
        let sum = 0;
        values.map(value => {
          sum += parseFloat(value);
        });
        aggregatedValue = sum / values.length;
      } else {
        console.log('aggregationType : ' + aggregationType);
        //@todo calculate based on aggregation types for other apart of SUM, AVERAGE,
        //assume using operations
        values.forEach(value => {
          aggregatedValue += parseFloat(value);
        });
      }
    }
    return aggregatedValue;
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }
}
