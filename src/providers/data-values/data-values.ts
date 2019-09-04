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
import { Injectable } from '@angular/core';
import { HttpClientProvider } from '../http-client/http-client';
import { SqlLiteProvider } from '../sql-lite/sql-lite';
import { NetworkAvailabilityProvider } from '../network-availability/network-availability';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { CurrentUser } from '../../models';

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

  getDataValueSetFromServer(
    dataSetId: string,
    period: string,
    orgUnitId: string,
    attributeOptionCombo: string,
    currentUser: CurrentUser
  ): Observable<any> {
    let parameter =
      'dataSet=' + dataSetId + '&period=' + period + '&orgUnit=' + orgUnitId;
    let networkStatus = this.network.getNetWorkStatus();
    return new Observable(observer => {
      if (networkStatus.isAvailable) {
        this.httpClient
          .get('/api/dataValueSets.json?' + parameter, true, currentUser)
          .subscribe(
            (response: any) => {
              const dataValues = this.getFilteredDataValuesByDataSetAttributeOptionCombo(
                response,
                attributeOptionCombo
              );
              observer.next(dataValues);
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

  getDataValuesByStatus(
    status: string,
    currentUser: CurrentUser
  ): Observable<any> {
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

  getFormattedDataValueForUpload(dataValues: any[]) {
    return _.flatMapDeep(
      _.map(dataValues, dataValue => {
        const { de, pe, ou, co, cp, cc } = dataValue;
        let value = dataValue.value;
        let formParameter = `de=${de}&pe=${pe}&ou=${ou}&co=${co}`;
        if (isNaN(cp) && cp != '') {
          formParameter += `&cc=${cc}&cp=${cp}`;
        }
        if (!isNaN(value)) {
          if (new Number(value).toString() === '0') {
            value = '';
          }
        }
        formParameter += `&value=${value}`;
        return formParameter;
      })
    );
  }

  uploadDataValues(
    formattedDataValues: string[],
    dataValues: any[],
    currentUser: CurrentUser
  ): Observable<any> {
    let syncedDataValues = [];
    let importSummaries = {
      success: 0,
      fail: 0,
      errorMessages: []
    };
    return new Observable(observer => {
      formattedDataValues.forEach((formattedDataValue: any, index: any) => {
        const url = `/api/dataValues?${formattedDataValue}`;
        this.httpClient.post(url, {}, currentUser).subscribe(
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

  getAllEntryFormDataValuesFromStorage(
    dataSetId: string,
    period: string,
    orgUnitId: string,
    entryFormSections: any[],
    dataDimension: any,
    currentUser: CurrentUser
  ): Observable<any> {
    let entryFormDataValuesFromStorage = [];
    const ids = _.flatMapDeep(
      _.map(entryFormSections, (section: any) => {
        const { dataElements } = section;
        return _.map(dataElements, dataElement => {
          const { categoryCombo } = dataElement;
          const { categoryOptionCombos } = categoryCombo;
          return _.map(categoryOptionCombos, categoryOptionCombo => {
            const id = `${dataSetId}-${dataElement.id}-${categoryOptionCombo.id}-${period}-${orgUnitId}`;
            return id;
          });
        });
      })
    );
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
            dataValues.map((dataValue: any) => {
              if (
                (dataDimension.cp === dataValue.cp ||
                  dataValue.cp === '' ||
                  !isNaN(dataValue.cp)) &&
                dataDimension.cc === dataValue.cc
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

  getDataValuesSetAttributeOptionCombo(
    dataDimension: any,
    categoryOptionCombos: any
  ) {
    let attributeOptionCombo = '';
    if (dataDimension && dataDimension.cp && dataDimension.cp != '') {
      let categoriesOptionsArray = dataDimension.cp.split(';');
      for (let i = 0; i < categoryOptionCombos.length; i++) {
        let hasAttributeOptionCombo = true;
        let categoryOptionCombo = categoryOptionCombos[i];
        categoryOptionCombo.categoryOptions.map((categoryOption: any) => {
          if (categoriesOptionsArray.indexOf(categoryOption.id) === -1) {
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

  getFilteredDataValuesByDataSetAttributeOptionCombo(
    dataValuesResponse: any,
    attributeOptionCombo: string
  ) {
    const dataValues =
      dataValuesResponse && dataValuesResponse.dataValues
        ? dataValuesResponse.dataValues
        : [];
    return _.flatMap(
      _.map(
        _.filter(dataValues, (dataValue: any) => {
          return (
            dataValue && dataValue.attributeOptionCombo === attributeOptionCombo
          );
        }),
        (dataValue: any) => {
          const { categoryOptionCombo, dataElement, value } = dataValue;
          return { categoryOptionCombo, dataElement, value };
        }
      )
    );
  }

  saveDataValues(
    dataValues: any[],
    dataSetId: string,
    period: string,
    orgUnitId: string,
    dataDimension: any,
    syncStatus: string,
    currentUser: CurrentUser
  ): Observable<any> {
    return new Observable(observer => {
      if (dataValues.length > 0) {
        const bulkData = _.map(dataValues, dataValue => {
          const id = `${dataSetId}-${dataValue.dataElement}-${dataValue.categoryOptionCombo}-${period}-${orgUnitId}`;
          return {
            id,
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
          };
        });
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

  deleteDataValueByIds(
    dataValueIds: string[],
    currentUser: CurrentUser
  ): Observable<any> {
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

  getAllDataValues(currentUser: CurrentUser): Observable<any> {
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
