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
import { Component, OnInit, Input } from '@angular/core';
import { AppProvider } from '../../../../providers/app/app';
import { UserProvider } from '../../../../providers/user/user';
import { CurrentUser } from '../../../../models';
import { DataEntryFormProvider } from '../../../../providers/data-entry-form/data-entry-form';
import { DataValuesProvider } from '../../../../providers/data-values/data-values';
import * as _ from 'lodash';

@Component({
  selector: 'aggregate-data-downloader',
  templateUrl: 'aggregate-data-downloader.html'
})
export class AggregateDataDownloaderComponent implements OnInit {
  @Input() colorSettings;

  isFormReady: boolean;
  isLoading: boolean;
  dataSetIdsByUserRoles: Array<any>;
  currentUser: CurrentUser;

  selectedOrgUnit: any;
  selectedDataSet: any;
  selectedPeriod: any;
  dataDimension: any;

  showLoader: boolean;
  progressTrackerPacentage: number;
  progressTrackerMessage: string;
  downloadStatus: string;

  constructor(
    private userProvider: UserProvider,
    private appProvider: AppProvider,
    private dataEntryFormProvider: DataEntryFormProvider,
    private dataValuesProvider: DataValuesProvider
  ) {
    this.isLoading = true;
    this.showLoader = false;
    this.progressTrackerPacentage = 0;
    this.progressTrackerMessage = '';
    this.downloadStatus = '';
  }

  ngOnInit() {
    this.userProvider.getCurrentUser().subscribe(
      (currentUser: any) => {
        this.currentUser = currentUser;
        this.userProvider.getUserData().subscribe((userData: any) => {
          this.dataSetIdsByUserRoles = userData.dataSets;
          this.isLoading = false;
        });
      },
      () => {
        this.isLoading = false;
        this.appProvider.setNormalNotification(
          'Failed to discover current user information'
        );
      }
    );
  }
  onAggregateParameterSelection(data) {
    const {
      selectedOrgUnit,
      selectedDataSet,
      selectedPeriod,
      dataDimension,
      isFormReady
    } = data;
    this.isFormReady = isFormReady;
    this.selectedDataSet = selectedDataSet;
    this.selectedOrgUnit = selectedOrgUnit;
    this.selectedPeriod = selectedPeriod;
    this.dataDimension = dataDimension;
  }

  downloadingAggegateData() {
    this.progressTrackerPacentage = 0;
    this.showLoader = true;
    this.downloadStatus = '';
    const dataSetId = this.selectedDataSet.id;
    const period = this.selectedPeriod.iso;
    const orgUnitId = this.selectedOrgUnit.id;
    const orgUnitName = this.selectedOrgUnit.name;
    this.progressTrackerMessage = 'Discovering data';
    this.appProvider.setTopNotification(`Discovering aggregate data`);
    this.dataEntryFormProvider
      .loadingDataSetInformation(dataSetId, this.currentUser)
      .subscribe(
        dataSetInformation => {
          const { dataSet } = dataSetInformation;
          if (dataSet && dataSet.id) {
            const dataSetAttributeOptionCombo = this.dataValuesProvider.getDataValuesSetAttributeOptionCombo(
              this.dataDimension,
              dataSet.categoryCombo.categoryOptionCombos
            );
            this.dataValuesProvider
              .getDataValueSetFromServer(
                dataSetId,
                period,
                orgUnitId,
                dataSetAttributeOptionCombo,
                this.currentUser
              )
              .subscribe(
                dataValues => {
                  this.downloadStatus = `${
                    dataValues.length
                  } aggregate data has been discovered`;
                  this.appProvider.setTopNotification(this.downloadStatus);
                  if (dataValues.length > 0) {
                    this.progressTrackerPacentage = 50;
                    this.progressTrackerMessage = 'Saving data';
                    const formattedDataValues = _.map(dataValues, dataValue => {
                      return {
                        orgUnit: orgUnitName,
                        dataElement: dataValue.dataElement,
                        categoryOptionCombo: dataValue.categoryOptionCombo,
                        value: dataValue.value,
                        period: this.selectedPeriod.name
                      };
                    });
                    this.savingDataValues(formattedDataValues);
                  } else {
                    this.showLoader = false;
                  }
                },
                error => {
                  this.showLoader = false;
                  console.log(JSON.stringify(error));
                  this.appProvider.setNormalNotification(
                    `Failed to discover aggregate data data`
                  );
                }
              );
          }
        },
        error => {
          this.showLoader = false;
          console.log(JSON.stringify(error));
          this.appProvider.setNormalNotification(
            `Failed to discover aggregate data data`
          );
        }
      );
  }

  savingDataValues(dataValues) {
    const dataSetId = this.selectedDataSet.id;
    const period = this.selectedPeriod.iso;
    const orgUnitId = this.selectedOrgUnit.id;
    const status = 'synced';
    this.dataValuesProvider
      .saveDataValues(
        dataValues,
        dataSetId,
        period,
        orgUnitId,
        this.dataDimension,
        status,
        this.currentUser
      )
      .subscribe(
        () => {
          this.progressTrackerPacentage = 100;
          setTimeout(() => {
            this.showLoader = false;
          }, 100);
          this.appProvider.setTopNotification(
            `Discovered aggregate data has been saved successfully`
          );
        },
        error => {
          this.showLoader = false;
          console.log(JSON.stringify(error));
          this.appProvider.setNormalNotification(
            `Failed to save aggregate data data`
          );
        }
      );
  }
}
