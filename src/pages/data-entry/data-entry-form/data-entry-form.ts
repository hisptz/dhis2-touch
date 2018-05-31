import { Component, OnInit, ViewChild } from '@angular/core';
import {
  IonicPage,
  ModalController,
  NavController,
  NavParams,
  Content
} from 'ionic-angular';
import { UserProvider } from '../../../providers/user/user';
import { AppProvider } from '../../../providers/app/app';
import { DataEntryFormProvider } from '../../../providers/data-entry-form/data-entry-form';
import { SettingsProvider } from '../../../providers/settings/settings';
import { DataValuesProvider } from '../../../providers/data-values/data-values';
import { DataSetCompletenessProvider } from '../../../providers/data-set-completeness/data-set-completeness';
import { AppTranslationProvider } from '../../../providers/app-translation/app-translation';
import * as _ from 'lodash';

/**
 * Generated class for the DataEntryFormPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-data-entry-form',
  templateUrl: 'data-entry-form.html'
})
export class DataEntryFormPage implements OnInit {
  entryFormParameter: any;

  isLoading: boolean;
  loadingMessage: string;
  currentUser: any;
  appSettings: any;
  indicators: Array<any>;
  sectionIds: Array<string>;
  dataSet: any;
  dataSetAttributeOptionCombo: any;
  entryFormSections: any;
  entryFormLayout: string;
  icons: any = {};
  pager: any = {};
  storageStatus: any;
  dataValuesObject: any;
  dataValuesSavingStatusClass: any;
  dataSetsCompletenessInfo: any;
  isDataSetCompleted: boolean;
  isDataSetCompletenessProcessRunning: boolean;
  translationMapper: any;
  dataEntryFormDesign: string;
  entryFormType: string;
  dataUpdateStatus: { [elementId: string]: string };
  @ViewChild(Content) content: Content;

  constructor(
    private navCtrl: NavController,
    private userProvider: UserProvider,
    private appProvider: AppProvider,
    private modalCtrl: ModalController,
    private dataSetCompletenessProvider: DataSetCompletenessProvider,
    private dataEntryFormProvider: DataEntryFormProvider,
    private settingsProvider: SettingsProvider,
    private dataValuesProvider: DataValuesProvider,
    private navParams: NavParams,
    private appTranslation: AppTranslationProvider
  ) {
    this.dataEntryFormDesign = '';
    this.entryFormType = 'SECTION';
    this.icons['menu'] = 'assets/icon/menu.png';
    this.storageStatus = {
      online: 0,
      offline: 0
    };
    this.dataSetsCompletenessInfo = {};
    this.isDataSetCompleted = false;
    this.dataValuesObject = {};
    this.dataValuesSavingStatusClass = {};
    this.isLoading = true;
    this.translationMapper = {};
  }

  ngOnInit() {
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
    this.entryFormParameter = this.navParams.get('parameter');
    this.userProvider.getCurrentUser().subscribe(
      user => {
        this.currentUser = user;
        this.settingsProvider
          .getSettingsForTheApp(user)
          .subscribe((appSettings: any) => {
            this.appSettings = appSettings;
            if (
              appSettings &&
              appSettings.entryForm &&
              appSettings.entryForm.formLayout
            ) {
              this.entryFormLayout = appSettings.entryForm.formLayout;
            } else {
              this.entryFormLayout = 'listLayout';
            }
            this.loadingDataSetInformation(this.entryFormParameter.dataSet.id);
          });
      },
      error => {
        console.log(JSON.stringify(error));
        this.isLoading = false;
        this.appProvider.setNormalNotification(
          'Failed to discover current user information'
        );
      }
    );
  }

  goBack() {
    this.navCtrl.pop();
  }

  loadingDataSetInformation(dataSetId) {
    let key = 'Discovering entry form information';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.dataEntryFormProvider
      .loadingDataSetInformation(dataSetId, this.currentUser)
      .subscribe(
        (dataSetInformation: any) => {
          this.dataSet = dataSetInformation.dataSet;
          this.sectionIds = dataSetInformation.sectionIds;
          key = 'Discovering indicators';
          this.loadingMessage = this.translationMapper[key]
            ? this.translationMapper[key]
            : key;
          this.dataEntryFormProvider
            .getEntryFormIndicators(
              dataSetInformation.indicatorIds,
              this.currentUser
            )
            .subscribe(
              (indicators: any) => {
                this.indicators = indicators;
                this.loadingEntryForm(this.dataSet, this.sectionIds);
              },
              error => {
                this.isLoading = false;
                this.loadingMessage = '';
                this.appProvider.setNormalNotification(
                  'Failed to discover indicators'
                );
              }
            );
        },
        error => {
          this.isLoading = false;
          this.loadingMessage = '';
          this.appProvider.setNormalNotification(
            'Failed to discover entry form information'
          );
        }
      );
  }

  loadingEntryForm(dataSet, sectionIds) {
    let key = 'Preparing entry form';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.dataEntryFormProvider
      .getEntryForm(
        sectionIds,
        dataSet.id,
        dataSet.formType,
        this.appSettings,
        this.currentUser
      )
      .subscribe(
        (entryFormResponse: any) => {
          if (
            dataSet.formType == 'CUSTOM' &&
            this.appSettings &&
            this.appSettings.entryForm &&
            this.appSettings.entryForm.formLayout &&
            this.appSettings.entryForm.formLayout == 'customLayout'
          ) {
            this.dataEntryFormDesign = entryFormResponse.entryForm;
            this.entryFormSections = entryFormResponse.entryFormSections;
            this.entryFormType = 'CUSTOM';
          } else {
            this.entryFormSections = entryFormResponse;
            this.pager['page'] = 1;
            this.pager['total'] = entryFormResponse.length;
            this.entryFormType = 'SECTION';
          }
          let dataSetId = this.dataSet.id;
          let period = this.entryFormParameter.period.iso;
          let orgUnitId = this.entryFormParameter.orgUnit.id;
          let dataDimension = this.entryFormParameter.dataDimension;
          this.dataSetAttributeOptionCombo = this.dataValuesProvider.getDataValuesSetAttributeOptionCombo(
            dataDimension,
            this.dataSet.categoryCombo.categoryOptionCombos
          );
          this.loadingLocalData(dataSetId, period, orgUnitId, dataDimension);
        },
        error => {
          console.log(JSON.stringify(error));
          this.isLoading = false;
          this.loadingMessage = '';
          this.appProvider.setNormalNotification('');
        }
      );
  }

  loadingLocalData(dataSetId, period, orgUnitId, dataDimension) {
    let key = 'Discovering available local data';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.dataValuesProvider
      .getAllEntryFormDataValuesFromStorage(
        dataSetId,
        period,
        orgUnitId,
        this.entryFormSections,
        dataDimension,
        this.currentUser
      )
      .subscribe(
        (entryFormDataValues: any) => {
          entryFormDataValues.map((dataValue: any) => {
            this.dataValuesObject[dataValue.id] = dataValue;
            dataValue.status == 'synced'
              ? this.storageStatus.online++
              : this.storageStatus.offline++;
          });
          //this.loadingDataSetCompleteness();
          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
          this.appProvider.setNormalNotification(
            'Failed to discover available local data'
          );
        }
      );
  }

  onDataSetCompletenessInformattionLoaded(dataSetCompletenessInfo) {
    this.dataSetsCompletenessInfo = dataSetCompletenessInfo;
    if (dataSetCompletenessInfo && dataSetCompletenessInfo.complete) {
      this.isDataSetCompleted = true;
    }
  }

  onMergingWithOnlineData(dataValues) {
    //this.isLoading = true;
    this.loadingMessage = '';
    let newDataValue = [];
    const dataSetId = this.dataSet.id;
    const period = this.entryFormParameter.period.iso;
    const orgUnitId = this.entryFormParameter.orgUnit.id;
    const orgUnitName = this.entryFormParameter.orgUnit.name;
    const dataDimension = this.entryFormParameter.dataDimension;
    const status = dataValues[0].status;
    _.map(dataValues, dataValue => {
      const dataValueId = dataValue.id;
      const fieldIdArray = dataValueId.split('-');
      newDataValue.push({
        orgUnit: orgUnitName,
        dataElement: fieldIdArray[0],
        categoryOptionCombo: fieldIdArray[1],
        value: dataValue.value,
        period: this.entryFormParameter.period.name
      });
      this.dataValuesObject[dataValueId] = dataValue;
    });
    this.dataValuesProvider
      .saveDataValues(
        newDataValue,
        dataSetId,
        period,
        orgUnitId,
        dataDimension,
        status,
        this.currentUser
      )
      .subscribe(
        () => {
          _.map(dataValues, dataValue => {
            this.dataValuesSavingStatusClass[dataValue.id] =
              'input-field-container-success';
            this.dataValuesObject[dataValue.id] = dataValue;
          });
          this.storageStatus.offline = 0;
          this.storageStatus.online = 0;
          _.map(_.keys(this.dataValuesObject), key => {
            const dataValue = this.dataValuesObject[key];
            if (dataValue.status === 'synced') {
              this.storageStatus.online += 1;
            } else {
              this.storageStatus.offline += 1;
            }
          });
          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
        }
      );
  }

  openSectionList() {
    let modal = this.modalCtrl.create('DataEntrySectionSelectionPage', {
      pager: this.pager,
      sections: this.getEntryFormSections(this.entryFormSections)
    });
    modal.onDidDismiss((pager: any) => {
      if (pager && pager.page) {
        this.pager = pager;
        //scroll form to the top
        setTimeout(() => {
          this.content.scrollToTop(1300);
        }, 200);
      }
    });
    modal.present();
  }

  viewUserCompletenessInformation(dataSetsCompletenessInfo) {
    let username =
      dataSetsCompletenessInfo && dataSetsCompletenessInfo.storedBy
        ? dataSetsCompletenessInfo.storedBy
        : '';
    let modal = this.modalCtrl.create('EntryFormCompletenessPage', {
      username: username,
      currentUser: this.currentUser
    });
    modal.present();
  }

  viewEntryFormIndicators(indicators) {
    if (indicators && indicators.length > 0) {
      let modal = this.modalCtrl.create('DataEntryIndicatorsPage', {
        indicators: indicators,
        dataValuesObject: this.dataValuesObject,
        dataSet: { id: this.dataSet.id, name: this.dataSet.name }
      });
      modal.onDidDismiss(() => {});
      modal.present();
    } else {
      this.appProvider.setNormalNotification('There are no indicators to view');
    }
  }

  changePagination(page) {
    page = parseInt(page);
    if (page > 0 && page <= this.pager.total) {
      this.isLoading = true;
      this.pager.page = page;
      this.isLoading = false;
      //scroll form to the top
      setTimeout(() => {
        this.content.scrollToTop(1300);
      }, 200);
    }
  }

  updateData(updateDataValue) {
    let dataValueId = updateDataValue.id;
    let dataSetId = this.dataSet.id;
    let period = this.entryFormParameter.period.iso;
    let orgUnitId = this.entryFormParameter.orgUnit.id;
    let orgUnitName = this.entryFormParameter.orgUnit.name;
    let dataDimension = this.entryFormParameter.dataDimension;
    let newDataValue = [];
    let fieldIdArray = dataValueId.split('-');
    newDataValue.push({
      orgUnit: orgUnitName,
      dataElement: fieldIdArray[0],
      categoryOptionCombo: fieldIdArray[1],
      value: updateDataValue.value,
      period: this.entryFormParameter.period.name
    });
    this.dataValuesProvider
      .saveDataValues(
        newDataValue,
        dataSetId,
        period,
        orgUnitId,
        dataDimension,
        updateDataValue.status,
        this.currentUser
      )
      .subscribe(
        () => {
          if (
            this.dataValuesObject[dataValueId] &&
            this.dataValuesObject[dataValueId].status == 'synced'
          ) {
            this.storageStatus.online--;
            this.storageStatus.offline++;
          } else if (!this.dataValuesObject[dataValueId]) {
            this.storageStatus.offline++;
          }
          this.dataValuesSavingStatusClass[dataValueId] =
            'input-field-container-success';
          this.dataValuesObject[dataValueId] = updateDataValue;

          // Update dataValue update status
          this.dataUpdateStatus = { [updateDataValue.domElementId]: 'OK' };
        },
        error => {
          this.dataValuesSavingStatusClass[dataValueId] =
            'input-field-container-failed';

          // Update dataValue update status
          this.dataUpdateStatus = { [updateDataValue.domElementId]: 'FAIL' };
        }
      );
  }

  // updateSyncStatus(dataValuesObject) {
  //   this.storageStatus.online = 0;
  //   this.storageStatus.offline = 0;
  //   _.map(_.keys(dataValuesObject), key => {
  //     if(this.dataValuesObject[dataValueId].status == 'synced'){

  //     }else{

  //     }
  //   });
  // }

  getEntryFormSections(entryFormSections) {
    let sections = [];
    entryFormSections.forEach((entryFormSection: any) => {
      sections.push({
        id: entryFormSection.id,
        name: entryFormSection.name
      });
    });
    return sections;
  }

  //@todo support offline completeness and un completeness of form
  updateDataSetCompleteness() {
    this.content.scrollToBottom(1000);
    this.isDataSetCompletenessProcessRunning = true;
    let dataSetId = this.dataSet.id;
    let period = this.entryFormParameter.period.iso;
    let orgUnitId = this.entryFormParameter.orgUnit.id;
    let dataDimension = this.entryFormParameter.dataDimension;
    if (this.isDataSetCompleted) {
      this.dataSetCompletenessProvider
        .unDoCompleteOnDataSetRegistrations(
          dataSetId,
          period,
          orgUnitId,
          dataDimension,
          this.currentUser
        )
        .subscribe(
          () => {
            this.dataSetsCompletenessInfo = {};
            this.isDataSetCompletenessProcessRunning = false;
            this.isDataSetCompleted = false;
            this.content.scrollToBottom(1000);
          },
          error => {
            this.isDataSetCompletenessProcessRunning = false;
            console.log(JSON.stringify(error));
            this.appProvider.setNormalNotification(
              'Failed to un complete entry form'
            );
          }
        );
    } else {
      this.dataSetCompletenessProvider
        .completeOnDataSetRegistrations(
          dataSetId,
          period,
          orgUnitId,
          dataDimension,
          this.currentUser
        )
        .subscribe(
          () => {
            this.dataSetCompletenessProvider
              .getDataSetCompletenessInfo(
                dataSetId,
                period,
                orgUnitId,
                dataDimension,
                this.currentUser
              )
              .subscribe(
                (dataSetCompletenessInfo: any) => {
                  this.dataSetsCompletenessInfo = dataSetCompletenessInfo;
                  if (
                    dataSetCompletenessInfo &&
                    dataSetCompletenessInfo.complete
                  ) {
                    this.isDataSetCompleted = true;
                    this.content.scrollToBottom(1000);
                  }
                  this.isDataSetCompletenessProcessRunning = false;
                  this.uploadDataValuesOnComplete(
                    period,
                    orgUnitId,
                    dataDimension
                  );
                },
                error => {
                  console.log(JSON.stringify(error));
                  this.isDataSetCompletenessProcessRunning = false;
                  this.appProvider.setNormalNotification(
                    'Failed to discover entry form completeness information'
                  );
                }
              );
          },
          error => {
            this.isDataSetCompletenessProcessRunning = false;
            console.log(JSON.stringify(error));
            this.appProvider.setNormalNotification(
              'Failed to complete entry form'
            );
          }
        );
    }
  }

  uploadDataValuesOnComplete(period, orgUnitId, dataDimension) {
    let dataValues = [];
    if (this.dataValuesObject) {
      Object.keys(this.dataValuesObject).forEach((fieldId: any) => {
        let fieldIdArray = fieldId.split('-');
        if (this.dataValuesObject[fieldId]) {
          let dataValue = this.dataValuesObject[fieldId];
          if (dataValue.status != 'synced') {
            dataValues.push({
              de: fieldIdArray[0],
              co: fieldIdArray[1],
              pe: period,
              ou: orgUnitId,
              cc: dataDimension.cc,
              cp: dataDimension.cp,
              value: dataValue.value
            });
          }
        }
      });
    }
    if (dataValues.length > 0) {
      this.loadingMessage = 'Uploading data';
      let formattedDataValues = this.dataValuesProvider.getFormattedDataValueForUpload(
        dataValues
      );
      this.dataValuesProvider
        .uploadDataValues(
          formattedDataValues,
          formattedDataValues,
          this.currentUser
        )
        .subscribe(
          () => {
            this.storageStatus.offline = 0;
            this.storageStatus.online += dataValues.length;
            console.log('Success uploading data');
          },
          error => {
            console.log('Failed to upload data');
          }
        );
    }
  }

  trackByFn(index, item) {
    return item.id;
  }

  getValuesToTranslate() {
    return [
      'The is no field associated with this entry form, Please contact our help desk',
      'Discovering current user information',
      'Discovering entry form information',
      'Discovering indicators',
      'Preparing entry form',
      'Discovering data from the server',
      'Saving data from server',
      'Discovering available local data',
      'Discovering entry form completeness information',
      'There are no indicators to view',
      'Uploading data'
    ];
  }
}
