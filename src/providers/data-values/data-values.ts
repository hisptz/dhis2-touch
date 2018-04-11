import { Injectable } from '@angular/core';
import { HttpClientProvider } from '../http-client/http-client';
import { SqlLiteProvider } from '../sql-lite/sql-lite';
import { NetworkAvailabilityProvider } from '../network-availability/network-availability';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the DataValuesProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DataValuesProvider {
  resourceName: string;

  constructor(
    private httpClient: HttpClientProvider,
    private sqlLite: SqlLiteProvider,
    private network: NetworkAvailabilityProvider
  ) {
    this.resourceName = 'dataValues';
  }

  /**
   *
   * @param dataSetId
   * @param period
   * @param orgUnitId
   * @param attributeOptionCombo
   * @param currentUser
   * @returns {Observable<any>}
   */
  getDataValueSetFromServer(
    dataSetId,
    period,
    orgUnitId,
    attributeOptionCombo,
    currentUser
  ): Observable<any> {
    let parameter =
      'dataSet=' + dataSetId + '&period=' + period + '&orgUnit=' + orgUnitId;
    let networkStatus = this.network.getNetWorkStatus();
    return new Observable(observer => {
      if (networkStatus.isAvailable) {
        this.httpClient
          .get('/api/25/dataValueSets.json?' + parameter, true, currentUser)
          .subscribe(
            (response: any) => {
              observer.next(
                this.getFilteredDataValuesByDataSetAttributeOptionCombo(
                  response,
                  attributeOptionCombo
                )
              );
              observer.complete();
            },
            error => {
              observer.error(error);
            }
          );
      } else {
        observer.next([]);
        observer.complete();
      }
    });
  }

  /**
   *
   * @param status
   * @param currentUser
   * @returns {Observable<any>}
   */
  getDataValuesByStatus(status, currentUser): Observable<any> {
    let attributeArray = [];
    attributeArray.push(status);
    return new Observable(observer => {
      this.sqlLite
        .getDataFromTableByAttributes(
          this.resourceName,
          'syncStatus',
          attributeArray,
          currentUser.currentDatabase
        )
        .subscribe(
          (dataValues: any) => {
            observer.next(dataValues);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  /**
   * convert data values to parameter for uploading
   * @param dataValues
   * @returns {Array}
   */
  getFormattedDataValueForUpload(dataValues) {
    let formattedDataValues = [];
    dataValues.forEach((dataValue: any) => {
      let formParameter = 'de=' + dataValue.de + '&pe=' + dataValue.pe + '&ou=';
      formParameter +=
        dataValue.ou + '&co=' + dataValue.co + '&value=' + dataValue.value;
      if (dataValue.cp != '0' && dataValue.cp != '') {
        formParameter =
          formParameter + '&cc=' + dataValue.cc + '&cp=' + dataValue.cp;
      }
      formattedDataValues.push(formParameter);
    });
    return formattedDataValues;
  }

  /**
   *
   * @param formattedDataValues
   * @param dataValues
   * @param currentUser
   * @returns {Observable<any>}
   */
  uploadDataValues(
    formattedDataValues,
    dataValues,
    currentUser
  ): Observable<any> {
    let syncedDataValues = [];
    let importSummaries = {
      success: 0,
      fail: 0,
      errorMessages: []
    };
    return new Observable(observer => {
      formattedDataValues.forEach((formattedDataValue: any, index: any) => {
        this.httpClient
          .post('/api/25/dataValues?' + formattedDataValue, {}, currentUser)
          .subscribe(
            () => {
              let syncedDataValue = dataValues[index];
              importSummaries.success++;
              syncedDataValue['syncStatus'] = 'synced';
              syncedDataValues.push(syncedDataValue);
              if (
                formattedDataValues.length ==
                importSummaries.success + importSummaries.fail
              ) {
                if (syncedDataValues.length > 0) {
                  this.sqlLite
                    .insertBulkDataOnTable(
                      this.resourceName,
                      syncedDataValues,
                      currentUser.currentDatabase
                    )
                    .subscribe(
                      () => {
                        observer.next(importSummaries);
                        observer.complete();
                      },
                      error => {
                        observer.error(error);
                      }
                    );
                } else {
                  observer.next(importSummaries);
                  observer.complete();
                }
              }
            },
            error => {
              importSummaries.fail++;
              if (importSummaries.errorMessages.indexOf(error) == -1) {
                importSummaries.errorMessages.push(error.error);
              }
              if (
                formattedDataValues.length ==
                importSummaries.success + importSummaries.fail
              ) {
                if (syncedDataValues.length > 0) {
                  this.sqlLite
                    .insertBulkDataOnTable(
                      this.resourceName,
                      syncedDataValues,
                      currentUser.currentDatabase
                    )
                    .subscribe(
                      () => {
                        observer.next(importSummaries);
                        observer.complete();
                      },
                      error => {
                        observer.error(error);
                      }
                    );
                } else {
                  observer.next(importSummaries);
                  observer.complete();
                }
              }
            }
          );
      });
    });
  }

  /**
   *
   * @param dataSetId
   * @param period
   * @param orgUnitId
   * @param entryFormSections
   * @param dataDimension
   * @param currentUser
   * @returns {Observable<any>}
   */
  getAllEntryFormDataValuesFromStorage(
    dataSetId,
    period,
    orgUnitId,
    entryFormSections,
    dataDimension,
    currentUser
  ): Observable<any> {
    let ids = [];
    let entryFormDataValuesFromStorage = [];
    entryFormSections.forEach((section: any) => {
      section.dataElements.forEach((dataElement: any) => {
        dataElement.categoryCombo.categoryOptionCombos.forEach(
          (categoryOptionCombo: any) => {
            ids.push(
              dataSetId +
                '-' +
                dataElement.id +
                '-' +
                categoryOptionCombo.id +
                '-' +
                period +
                '-' +
                orgUnitId
            );
          }
        );
      });
    });
    return new Observable(observer => {
      this.sqlLite
        .getDataFromTableByAttributes(
          this.resourceName,
          'id',
          ids,
          currentUser.currentDatabase
        )
        .subscribe(
          (dataValues: any) => {
            dataValues.forEach((dataValue: any) => {
              if (
                (dataDimension.cp == dataValue.cp ||
                  dataValue.cp == '' ||
                  dataValue.cp == '0') &&
                dataDimension.cc == dataValue.cc
              ) {
                entryFormDataValuesFromStorage.push({
                  id: dataValue.de + '-' + dataValue.co,
                  value: dataValue.value,
                  status: dataValue.syncStatus
                });
              }
            });
            observer.next(entryFormDataValuesFromStorage);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  /**
   *
   * @param dataDimension
   * @param categoryOptionCombos
   * @returns {string}
   */
  getDataValuesSetAttributeOptionCombo(dataDimension, categoryOptionCombos) {
    let attributeOptionCombo = '';
    if (dataDimension && dataDimension.cp && dataDimension.cp != '') {
      let categoriesOptionsArray = dataDimension.cp.split(';');
      for (let i = 0; i < categoryOptionCombos.length; i++) {
        let hasAttributeOptionCombo = true;
        let categoryOptionCombo = categoryOptionCombos[i];
        categoryOptionCombo.categoryOptions.forEach((categoryOption: any) => {
          if (categoriesOptionsArray.indexOf(categoryOption.id) == -1) {
            hasAttributeOptionCombo = false;
          }
        });
        if (hasAttributeOptionCombo) {
          attributeOptionCombo = categoryOptionCombo.id;
          break;
        }
      }
    } else {
      attributeOptionCombo = categoryOptionCombos[0].id;
    }
    return attributeOptionCombo;
  }

  /**
   * @param dataValuesResponse
   * @param attributeOptionCombo
   * @returns {Array}
   */
  getFilteredDataValuesByDataSetAttributeOptionCombo(
    dataValuesResponse,
    attributeOptionCombo
  ) {
    let FilteredDataValues = [];
    if (dataValuesResponse.dataValues) {
      dataValuesResponse.dataValues.forEach((dataValue: any) => {
        if (dataValue.attributeOptionCombo == attributeOptionCombo) {
          FilteredDataValues.push({
            categoryOptionCombo: dataValue.categoryOptionCombo,
            dataElement: dataValue.dataElement,
            value: dataValue.value
          });
        }
      });
    }
    return FilteredDataValues;
  }

  /**
   *
   * @param dataValues
   * @param dataSetId
   * @param period
   * @param orgUnitId
   * @param dataDimension
   * @param syncStatus
   * @param currentUser
   * @returns {Observable<any>}
   */
  saveDataValues(
    dataValues,
    dataSetId,
    period,
    orgUnitId,
    dataDimension,
    syncStatus,
    currentUser
  ): Observable<any> {
    return new Observable(observer => {
      if (dataValues.length > 0) {
        let bulkData = [];
        for (let dataValue of dataValues) {
          bulkData.push({
            id:
              dataSetId +
              '-' +
              dataValue.dataElement +
              '-' +
              dataValue.categoryOptionCombo +
              '-' +
              period +
              '-' +
              orgUnitId,
            de: dataValue.dataElement,
            co: dataValue.categoryOptionCombo,
            pe: period,
            ou: orgUnitId,
            cc: dataDimension.cc,
            cp: dataDimension.cp,
            value: dataValue.value,
            syncStatus: syncStatus,
            dataSetId: dataSetId,
            period: dataValue.period,
            orgUnit: dataValue.orgUnit
          });
        }
        this.sqlLite
          .insertBulkDataOnTable(
            this.resourceName,
            bulkData,
            currentUser.currentDatabase
          )
          .subscribe(
            () => {
              observer.next();
              observer.complete();
            },
            error => {
              observer.error(error);
            }
          );
      } else {
        observer.next();
        observer.complete();
      }
    });
  }

  /**
   * deleteDataValuesByIds
   * @param dataValueIds
   * @param currentUser
   * @returns {Promise<T>}
   */
  deleteDataValueByIds(dataValueIds, currentUser): Observable<any> {
    let successCount = 0;
    let failCount = 0;
    return new Observable(observer => {
      for (let dataValueId of dataValueIds) {
        this.sqlLite
          .deleteFromTableByAttribute(
            this.resourceName,
            'id',
            dataValueId,
            currentUser.currentDatabase
          )
          .subscribe(
            () => {
              successCount = successCount + 1;
              if (successCount + failCount == dataValueIds.length) {
                observer.next();
                observer.complete();
              }
            },
            error => {
              failCount = failCount + 1;
              if (successCount + failCount == dataValueIds.length) {
                observer.next();
                observer.complete();
              }
            }
          );
      }
    });
  }

  /**
   *
   * @param currentUser
   * @returns {Observable<any>}
   */
  getAllDataValues(currentUser): Observable<any> {
    return new Observable(observer => {
      this.sqlLite
        .getAllDataFromTable(this.resourceName, currentUser.currentDatabase)
        .subscribe(
          (dataValues: any) => {
            observer.next(dataValues);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  /**
   *
   * @param currentUser
   * @returns {Observable<any>}
   */
  deleteAllDataValues(currentUser): Observable<any> {
    return new Observable(observer => {
      this.sqlLite
        .dropTable(this.resourceName, currentUser.currentDatabase)
        .subscribe(
          () => {
            observer.next();
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }
}
