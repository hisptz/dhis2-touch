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
import { PeriodSelectionProvider } from '../../../../providers/period-selection/period-selection';
import { ModalController } from 'ionic-angular';
import { OrganisationUnitsProvider } from '../../../../providers/organisation-units/organisation-units';
import { UserProvider } from '../../../../providers/user/user';
import { AppProvider } from '../../../../providers/app/app';
import { DataSetsProvider } from '../../../../providers/data-sets/data-sets';
import { SmsCommandProvider } from '../../../../providers/sms-command/sms-command';
import { SmsCommand } from '../../../../models/sms-command';
import { AppTranslationProvider } from '../../../../providers/app-translation/app-translation';

/**
 * Generated class for the UploadDataViaSmsComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'upload-data-via-sms',
  templateUrl: 'upload-data-via-sms.html'
})
export class UploadDataViaSmsComponent implements OnInit {
  @Input() colorSettings: any;

  selectedOrgUnit: any;
  selectedDataSet: any;
  selectedPeriod: any;
  currentUser: any;
  isLoading: boolean;
  loadingMessage: string;
  isFormReady: boolean;
  isDataSetDimensionApplicable: boolean;
  isDataSetDimensionApplicableCategories: string;
  organisationUnitLabel: string;
  dataSetLabel: string;
  periodLabel: string;
  dataSetIdsByUserRoles: Array<any>;
  dataSets: Array<any>;
  dataSetCategoryCombo: any;
  selectedDataDimension: Array<any>;
  currentPeriodOffset: number;
  icons: any = {};
  sendDataViaSmsObject: any = {
    orgUnit: {},
    dataSet: {},
    period: {},
    dataDimension: {},
    mobileNumber: '',
    isLoading: false,
    loadingMessage: ''
  };
  translationMapper: any;

  constructor(
    private modalCtrl: ModalController,
    private userProvider: UserProvider,
    private appProvider: AppProvider,
    private smsCommand: SmsCommandProvider,
    private dataSetProvider: DataSetsProvider,
    private periodSelection: PeriodSelectionProvider,
    private organisationUnitsProvider: OrganisationUnitsProvider,
    private appTranslation: AppTranslationProvider
  ) {}

  ngOnInit() {
    this.icons.orgUnit = 'assets/icon/orgUnit.png';
    this.icons.dataSet = 'assets/icon/form.png';
    this.icons.period = 'assets/icon/period.png';
    this.isLoading = true;
    this.currentPeriodOffset = 0;
    this.isDataSetDimensionApplicable = false;
    this.translationMapper = {};
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
        this.loadingCurrentUserInformation();
      },
      error => {
        this.loadingCurrentUserInformation();
      }
    );
  }

  loadingCurrentUserInformation() {
    let key = 'Discovering current user information';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.userProvider.getCurrentUser().subscribe(
      (currentUser: any) => {
        this.currentUser = currentUser;
        this.userProvider.getUserData().subscribe((userData: any) => {
          this.dataSetIdsByUserRoles = userData.dataSets;
          this.organisationUnitsProvider
            .getLastSelectedOrganisationUnitUnit(currentUser)
            .subscribe(lastSelectedOrgUnit => {
              this.selectedOrgUnit = lastSelectedOrgUnit;
              this.updateDataEntryFormSelections();
              this.loadingEntryForm();
            });
          this.updateDataEntryFormSelections();
        });
      },
      error => {
        this.isLoading = false;
        this.loadingMessage = '';
        this.appProvider.setNormalNotification(
          'Failed to discover current user information'
        );
      }
    );
  }

  updateDataEntryFormSelections() {
    if (this.organisationUnitsProvider.lastSelectedOrgUnit) {
      this.selectedOrgUnit = this.organisationUnitsProvider.lastSelectedOrgUnit;
      this.organisationUnitLabel = this.selectedOrgUnit.name;
    } else {
      this.organisationUnitLabel = 'Touch to select organisation unit';
    }
    if (this.selectedDataSet && this.selectedDataSet.name) {
      this.dataSetLabel = this.selectedDataSet.name;
    } else {
      this.dataSetLabel = 'Touch to select entry form';
      this.selectedPeriod = null;
    }

    if (this.selectedPeriod && this.selectedPeriod.name) {
      this.periodLabel = this.selectedPeriod.name;
    } else {
      this.periodLabel = 'Touch to select period';
    }
    this.isFormReady = this.isAllFormParameterSelected();
    this.isLoading = false;
    this.loadingMessage = '';
  }

  openOrganisationUnitTree() {
    let modal = this.modalCtrl.create('OrganisationUnitSelectionPage', {
      filterType: 'dataSets'
    });
    modal.onDidDismiss((selectedOrgUnit: any) => {
      if (selectedOrgUnit && selectedOrgUnit.id) {
        this.selectedOrgUnit = selectedOrgUnit;
        this.updateDataEntryFormSelections();
        this.loadingEntryForm();
      }
    });
    modal.present();
  }

  loadingEntryForm() {
    this.dataSetProvider
      .getAssignedDataSets(
        this.selectedOrgUnit.id,
        this.dataSetIdsByUserRoles,
        this.currentUser
      )
      .subscribe(
        (dataSets: any) => {
          this.dataSets = dataSets;
          this.selectedDataSet = this.dataSetProvider.lastSelectedDataSet;
          if (dataSets.length == 0) {
            this.selectedPeriod = {};
            this.selectedDataSet = {};
          } else {
            this.currentPeriodOffset = 0;
            if (this.selectedDataSet && this.selectedDataSet.categoryCombo) {
              this.updateDataSetCategoryCombo(
                this.selectedDataSet.categoryCombo
              );
            }
            this.loadPeriodSelection();
          }
          this.updateDataEntryFormSelections();
        },
        error => {
          this.appProvider.setNormalNotification(
            'Failed to discover entry form'
          );
        }
      );
  }

  openEntryFormList() {
    if (this.dataSets && this.dataSets.length > 0) {
      let modal = this.modalCtrl.create('DataSetSelectionPage', {
        dataSetsList: this.dataSets,
        currentDataSet: {
          id: this.selectedDataSet.id || '',
          name: this.selectedDataSet.name || ''
        }
      });
      modal.onDidDismiss((selectedDataSet: any) => {
        if (
          selectedDataSet &&
          selectedDataSet.id &&
          selectedDataSet.id != this.selectedDataSet.id
        ) {
          this.selectedDataSet = selectedDataSet;
          this.dataSetProvider.setLastSelectedDataSet(selectedDataSet);
          this.currentPeriodOffset = 0;
          this.updateDataEntryFormSelections();
          this.loadPeriodSelection();
          if (this.selectedDataSet && this.selectedDataSet.categoryCombo) {
            this.updateDataSetCategoryCombo(this.selectedDataSet.categoryCombo);
          }
        }
      });
      modal.present();
    } else {
      this.appProvider.setNormalNotification(
        'There are no entry form to select on selected organisation unit'
      );
    }
  }

  loadPeriodSelection() {
    if (this.selectedDataSet && this.selectedDataSet.id) {
      let periodType = this.selectedDataSet.periodType;
      let openFuturePeriods = parseInt(this.selectedDataSet.openFuturePeriods);
      let periods = this.periodSelection.getPeriods(
        periodType,
        openFuturePeriods,
        this.currentPeriodOffset
      );
      if (periods && periods.length > 0) {
        this.selectedPeriod = periods[0];
      } else {
        this.selectedPeriod = {};
      }
    }
    this.updateDataEntryFormSelections();
  }

  openPeriodList() {
    if (this.selectedDataSet && this.selectedDataSet.id) {
      let modal = this.modalCtrl.create('PeriodSelectionPage', {
        periodType: this.selectedDataSet.periodType,
        currentPeriodOffset: this.currentPeriodOffset,
        openFuturePeriods: this.selectedDataSet.openFuturePeriods,
        currentPeriod: this.selectedPeriod
      });

      modal.onDidDismiss((data: any) => {
        if (data && data.selectedPeriod) {
          this.selectedPeriod = data.selectedPeriod;
          this.currentPeriodOffset = data.currentPeriodOffset;
          this.updateDataEntryFormSelections();
        }
      });
      modal.present();
    } else {
      this.appProvider.setNormalNotification('Please select entry form first');
    }
  }

  openDataDimensionSelection(category) {
    if (
      category.categoryOptions &&
      category.categoryOptions &&
      category.categoryOptions.length > 0
    ) {
      let currentIndex = this.dataSetCategoryCombo.categories.indexOf(category);
      let modal = this.modalCtrl.create('DataDimensionSelectionPage', {
        categoryOptions: category.categoryOptions,
        title: category.name,
        currentSelection: this.selectedDataDimension[currentIndex]
          ? this.selectedDataDimension[currentIndex]
          : {}
      });
      modal.onDidDismiss((selectedDataDimension: any) => {
        if (selectedDataDimension && selectedDataDimension.id) {
          this.selectedDataDimension[currentIndex] = selectedDataDimension;
          this.updateDataEntryFormSelections();
        }
      });
      modal.present();
    } else {
      let message =
        'There is no option for seleted category that associated with selected organisation unit';
      this.appProvider.setNormalNotification(message);
    }
  }

  updateDataSetCategoryCombo(categoryCombo) {
    let dataSetCategoryCombo = {};
    if (categoryCombo.name != 'default') {
      dataSetCategoryCombo['id'] = categoryCombo.id;
      dataSetCategoryCombo['name'] = categoryCombo.name;
      let categories = this.dataSetProvider.getDataSetCategoryComboCategories(
        this.selectedOrgUnit.id,
        this.selectedDataSet.categoryCombo.categories
      );
      dataSetCategoryCombo['categories'] = categories;
      this.isDataSetDimensionApplicable = true;

      this.isDataSetDimensionApplicableCategories = 'All';
      categories.forEach((category: any) => {
        if (category.categoryOptions && category.categoryOptions.length == 0) {
          this.isDataSetDimensionApplicable = false;
        }
      });
      this.isDataSetDimensionApplicableCategories = this.translationMapper[
        'All disaggregation are restricted from entry in selected organisation unit, please choose a different form or contact your support desk'
      ];
    }
    this.selectedDataDimension = [];
    this.dataSetCategoryCombo = dataSetCategoryCombo;
    this.updateDataEntryFormSelections();
  }

  getDataDimensions() {
    let cc = this.selectedDataSet.categoryCombo.id;
    let cp = '';
    this.selectedDataDimension.forEach((dimension: any, index: any) => {
      if (index == 0) {
        cp += dimension.id;
      } else {
        cp += ';' + dimension.id;
      }
    });
    return { cc: cc, cp: cp };
  }

  isAllFormParameterSelected() {
    let isFormReady = true;
    if (
      this.selectedPeriod &&
      this.selectedPeriod.name &&
      this.selectedDataSet &&
      this.selectedDataSet.categoryCombo.name != 'default'
    ) {
      if (
        this.selectedDataDimension &&
        this.selectedDataDimension.length > 0 &&
        this.selectedDataDimension.length ==
          this.dataSetCategoryCombo.categories.length
      ) {
        let count = 0;
        this.selectedDataDimension.forEach((dimension: any) => {
          count++;
        });
        if (count != this.selectedDataDimension.length) {
          isFormReady = false;
        }
      } else {
        isFormReady = false;
      }
    } else if (this.periodLabel == 'Touch to select period') {
      isFormReady = false;
    }
    return isFormReady;
  }

  sendDataViaSms() {
    this.sendDataViaSmsObject.orgUnit = {
      id: this.selectedOrgUnit.id,
      name: this.selectedOrgUnit.name
    };
    this.sendDataViaSmsObject.dataSet = {
      id: this.selectedDataSet.id,
      name: this.selectedDataSet.name
    };
    this.sendDataViaSmsObject.period = {
      iso: this.selectedPeriod.iso,
      name: this.selectedPeriod.name
    };
    if (this.isAllFormParameterSelected()) {
      this.sendDataViaSmsObject.dataDimension = this.getDataDimensions();
    }
    this.sendDataViaSmsObject.isLoading = true;
    let key = 'Discovering SMS Configuration';
    this.sendDataViaSmsObject.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.smsCommand
      .getSmsCommandForDataSet(this.selectedDataSet.id, this.currentUser)
      .subscribe(
        (smsCommandConfiguration: SmsCommand) => {
          key = 'Preparing entry form fields';
          this.sendDataViaSmsObject.loadingMessage = this.translationMapper[key]
            ? this.translationMapper[key]
            : key;
          this.dataSetProvider
            .getAllDataSetElementsMapper(this.currentUser)
            .subscribe(
              (dataSetElementMapper: any) => {
                if (dataSetElementMapper[this.selectedDataSet.id]) {
                  let dataElements =
                    dataSetElementMapper[this.selectedDataSet.id];
                  key = 'Preparing data';
                  this.sendDataViaSmsObject.loadingMessage = this
                    .translationMapper[key]
                    ? this.translationMapper[key]
                    : key;
                  this.smsCommand
                    .getEntryFormDataValuesObjectFromStorage(
                      this.selectedDataSet.id,
                      this.selectedPeriod.iso,
                      this.selectedOrgUnit.id,
                      dataElements,
                      this.currentUser,
                      this.sendDataViaSmsObject.dataDimension
                    )
                    .subscribe(
                      (entryFormDataValuesObject: any) => {
                        if (Object.keys(entryFormDataValuesObject).length > 0) {
                          key = 'Preparing SMS';
                          this.sendDataViaSmsObject.loadingMessage = this
                            .translationMapper[key]
                            ? this.translationMapper[key]
                            : key;
                          this.smsCommand
                            .getSmsForReportingData(
                              smsCommandConfiguration,
                              entryFormDataValuesObject,
                              this.selectedPeriod
                            )
                            .subscribe(
                              (reportingSms: any) => {
                                let message = 'Sending';
                                if (reportingSms.length == 1) {
                                  message += ' SMS';
                                } else {
                                  message += ' SMSes';
                                }
                                message = this.translationMapper[message];
                                message += ' (' + reportingSms.length + ')';
                                this.sendDataViaSmsObject.loadingMessage = message;
                                this.smsCommand
                                  .sendSmsForReportingData(
                                    this.sendDataViaSmsObject.mobileNumber,
                                    reportingSms
                                  )
                                  .subscribe(
                                    () => {
                                      this.sendDataViaSmsObject.isLoading = false;
                                      this.sendDataViaSmsObject.loadingMessage =
                                        '';
                                      this.appProvider.setNormalNotification(
                                        'SMS has been sent'
                                      );
                                    },
                                    error => {
                                      this.sendDataViaSmsObject.isLoading = false;
                                      this.sendDataViaSmsObject.loadingMessage =
                                        '';
                                      this.appProvider.setNormalNotification(
                                        'Failed to send some of SMS, Please go into your SMS inbox and resend them manually'
                                      );
                                      console.log(JSON.stringify(error));
                                    }
                                  );
                              },
                              error => {
                                this.sendDataViaSmsObject.isLoading = false;
                                this.sendDataViaSmsObject.loadingMessage = '';
                                this.appProvider.setNormalNotification(
                                  'Failed to preparing SMS'
                                );
                                console.log(JSON.stringify(error));
                              }
                            );
                        } else {
                          this.sendDataViaSmsObject.isLoading = false;
                          this.sendDataViaSmsObject.loadingMessage = '';
                          this.appProvider.setNormalNotification(
                            'There is no data to be sent via SMS'
                          );
                        }
                      },
                      error => {
                        this.sendDataViaSmsObject.isLoading = false;
                        this.sendDataViaSmsObject.loadingMessage = '';
                        console.log(JSON.stringify(error));
                        this.appProvider.setNormalNotification(
                          'Failed to discover data values'
                        );
                      }
                    );
                } else {
                  this.sendDataViaSmsObject.isLoading = false;
                  this.sendDataViaSmsObject.loadingMessage = '';
                  this.appProvider.setNormalNotification(
                    'Selected entry form has no field set, please contact your help desk'
                  );
                }
              },
              error => {
                this.sendDataViaSmsObject.isLoading = false;
                this.sendDataViaSmsObject.loadingMessage = '';
                console.log(JSON.stringify(error));
              }
            );
        },
        error => {
          console.log(JSON.stringify(error));
          this.sendDataViaSmsObject.isLoading = false;
          this.sendDataViaSmsObject.loadingMessage = '';
          this.appProvider.setNormalNotification(
            'Failed to discover SMS configurations'
          );
        }
      );
  }

  getValuesToTranslate() {
    return [
      'All disaggregation are restricted from entry in selected organisation unit, please choose a different form or contact your support desk',
      'Discovering current user information',
      'Mobile Number',
      'Touch to select option',
      'Touch to select organisation unit',
      'Touch to select entry form',
      'Touch to select period',
      'Upload data',
      'Discovering SMS Configuration',
      'Preparing entry form fields',
      'Preparing data',
      'Preparing SMS',
      'Sending SMS',
      'Sending SMSes'
    ];
  }
}
