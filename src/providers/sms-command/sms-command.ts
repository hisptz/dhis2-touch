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
 */
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { SqlLiteProvider } from '../sql-lite/sql-lite';
import { HttpClientProvider } from '../http-client/http-client';
import { DataSetsProvider } from '../data-sets/data-sets';
import { DataSet } from '../../models/dataSet';
import { SmsCommand } from '../../models/smsCommand';
import { SMS } from '@ionic-native/sms';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

/*
  Generated class for the SmsCommandProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SmsCommandProvider {
  resourceName: string;

  constructor(
    private SqlLite: SqlLiteProvider,
    private dataSetProvider: DataSetsProvider,
    private sms: SMS,
    private HttpClient: HttpClientProvider
  ) {
    this.resourceName = 'smsCommand';
  }

  /**
   *
   * @param user
   * @returns {Observable<any>}
   */
  getSmsCommandFromServer(user): Observable<any> {
    return new Observable(observer => {
      let smsCommandUrl = '/api/dataStore/sms/commands';
      this.HttpClient.get(smsCommandUrl, false, user).subscribe(
        (response: any) => {
          response = JSON.parse(response.data);
          observer.next(response);
          observer.complete();
        },
        () => {
          observer.next([]);
          observer.complete();
        }
      );
    });
  }

  /**
   *
   * @param smsCommands
   * @param databaseName
   * @returns {Observable<any>}
   */
  savingSmsCommand(smsCommands, databaseName: string): Observable<any> {
    return new Observable(observer => {
      if (smsCommands.length == 0) {
        observer.next();
        observer.complete();
      } else {
        smsCommands.forEach((smsCommand: any) => {
          smsCommand['id'] = smsCommand.dataSetId;
        });
        this.SqlLite.insertBulkDataOnTable(
          this.resourceName,
          smsCommands,
          databaseName
        ).subscribe(
          () => {
            observer.next();
            observer.complete();
          },
          error => {
            observer.error(error);
            observer.complete();
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
  checkAndGenerateSmsCommands(currentUser): Observable<any> {
    return new Observable(observer => {
      this.dataSetProvider
        .getAllDataSetsSMSCodeGeneration(currentUser)
        .subscribe(
          (dataSets: Array<DataSet>) => {
            let smsCommands: Array<SmsCommand> = this.getGenerateSmsCommands(
              dataSets
            );
            this.savingSmsCommand(
              smsCommands,
              currentUser.currentDatabase
            ).subscribe(() => {});
            let smsCommandUrl = '/api/dataStore/sms/commands';
            this.HttpClient.post(
              smsCommandUrl,
              smsCommands,
              currentUser
            ).subscribe(
              () => {
                observer.next();
                observer.complete();
              },
              error => {
                this.HttpClient.put(
                  smsCommandUrl,
                  smsCommands,
                  currentUser
                ).subscribe(
                  data => {
                    observer.next(data);
                    observer.complete();
                  },
                  errro => {
                    observer.error(error);
                  }
                );
              }
            );
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
  getAllSmsCommands(currentUser): Observable<any> {
    return new Observable(observer => {
      this.SqlLite.getAllDataFromTable(
        this.resourceName,
        currentUser.currentDatabase
      ).subscribe(
        (smsCommands: any) => {
          observer.next(smsCommands);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  getSmsCommandMapper(currentUser): Observable<any> {
    return new Observable(observer => {
      this.getAllSmsCommands(currentUser).subscribe(
        (smsCommands: any) => {
          let smsCommandMapper = {};
          smsCommands.map((smsCommand: any) => {
            smsCommandMapper[smsCommand.commandName] = smsCommand;
          });
          observer.next(smsCommandMapper);
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
   * @param {Array<DataSet>} dataSets
   * @returns {Array<SmsCommand>}
   */
  getGenerateSmsCommands(dataSets: Array<DataSet>) {
    let smsCommands: Array<SmsCommand> = [];
    let optionCombos = [];
    let new_format =
      'abcdefghijklmnopqrstuvwxyzABCDEFGJHIJLMNOPQRSTUVWXYZ0123456789';
    let dataSetCounter = 0;
    dataSets.map((dataSet: DataSet) => {
      let smsCodeIndex = 0;
      let dataElements = [];
      let smsCodes = [];
      if (dataSet.dataElements) {
        dataElements = dataSet.dataElements;
      } else {
        dataSet.dataSetElements.map((dataSetElement: any) => {
          if (dataSetElement && dataSetElement.dataElement) {
            dataElements.push(dataSetElement.dataElement);
          }
        });
      }
      dataElements.map((dataElementData: any) => {
        let dataElement = {};
        dataElement['id'] = dataElementData.id;
        let categoryCombo = dataElementData.categoryCombo;
        optionCombos = categoryCombo['categoryOptionCombos'];
        optionCombos.map((optionCombo: any) => {
          let smsCode = this.getCodeCharacter(smsCodeIndex, new_format);
          smsCodes = _.concat(smsCodes, {
            categoryOptionCombos: optionCombo.id,
            dataElement: dataElement,
            smsCode: smsCode
          });
          smsCodeIndex++;
        });
      });
      smsCommands = _.concat(smsCommands, {
        dataSetId: dataSet.id,
        commandName: this.getCodeCharacter(dataSetCounter, new_format),
        separator: ':',
        parserType: 'KEY_VALUE_PARSER',
        smsCode: smsCodes
      });
      dataSetCounter++;
    });
    return smsCommands;
  }

  /**
   *
   * @param value
   * @param valueToConvert
   * @returns {string}
   */
  getCodeCharacter(value, valueToConvert) {
    let new_base = valueToConvert.length;
    let new_value = '';
    while (value > 0) {
      let remainder = value % new_base;
      new_value = valueToConvert.charAt(remainder) + new_value;
      value = (value - (value % new_base)) / new_base;
    }
    return new_value || valueToConvert.charAt(0);
  }

  /**
   *
   * @param dataSetId
   * @param currentUser
   * @returns {Observable<any>}
   */
  getSmsCommandForDataSet(dataSetId, currentUser): Observable<any> {
    let ids = [];
    ids.push(dataSetId);
    return new Observable(observer => {
      this.SqlLite.getDataFromTableByAttributes(
        this.resourceName,
        'id',
        ids,
        currentUser.currentDatabase
      ).subscribe(
        (smsCommands: any) => {
          if (smsCommands.length > 0) {
            observer.next(smsCommands[0]);
            observer.complete();
          } else {
            observer.error();
          }
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  /**
   *
   * @param dataSetId
   * @param period
   * @param orgUnitId
   * @param dataElements
   * @param currentUser
   * @returns {Observable<any>}
   */
  getEntryFormDataValuesObjectFromStorage(
    dataSetId,
    period,
    orgUnitId,
    dataElements,
    currentUser,
    dataDimension?
  ): Observable<any> {
    let ids = [];
    let entryFormDataValuesObjectFromStorage = {};
    dataElements.forEach((dataElement: any) => {
      dataElement.categoryCombo.categoryOptionCombos.forEach(
        (categoryOptionCombo: any) => {
          ids = _.concat(
            ids,
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
    return new Observable(observer => {
      this.SqlLite.getDataFromTableByAttributes(
        'dataValues',
        'id',
        ids,
        currentUser.currentDatabase
      ).subscribe(
        (dataValues: any) => {
          dataValues.map((dataValue: any) => {
            let id = dataValue.de + '-' + dataValue.co;
            entryFormDataValuesObjectFromStorage[id] = dataValue.value;
          });
          observer.next(entryFormDataValuesObjectFromStorage);
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
   * @param smsCommand
   * @param entryFormDataValuesObject
   * @param selectedPeriod
   * @returns {Observable<any>}
   */
  getSmsForReportingData(
    smsCommand,
    entryFormDataValuesObject,
    selectedPeriod
  ): Observable<any> {
    return new Observable(observer => {
      let sms = [];
      const smsLimit = 135;
      let smsForReportingData =
        smsCommand.commandName + ' ' + selectedPeriod.iso + ' ';
      let firstValuesFound = false;
      smsCommand.smsCode.map((smsCodeObject: any) => {
        const id =
          smsCodeObject.dataElement.id +
          '-' +
          smsCodeObject.categoryOptionCombos;
        if (entryFormDataValuesObject[id]) {
          let value = entryFormDataValuesObject[id];
          if (!firstValuesFound) {
            firstValuesFound = true;
          } else if (
            (
              smsForReportingData +
              smsCodeObject.smsCode +
              smsCommand.separator +
              value
            ).length > smsLimit
          ) {
            sms = _.concat(sms, smsForReportingData);
            firstValuesFound = false;
            smsForReportingData =
              smsCommand.commandName + ' ' + selectedPeriod.iso + ' ';
          } else {
            smsForReportingData = smsForReportingData + '|';
          }
          smsForReportingData =
            smsForReportingData +
            smsCodeObject.smsCode +
            smsCommand.separator +
            value;
        }
      });
      sms.push(smsForReportingData);
      observer.next(sms);
      observer.complete();
    });
  }

  /**
   *
   * @param phoneNumber
   * @param messages
   * @returns {Observable<any>}
   */
  sendSmsForReportingData(phoneNumber, messages): Observable<any> {
    return new Observable(observer => {
      this.sendSms(phoneNumber, messages, 0).subscribe(
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

  /**
   *
   * @param phoneNumber
   * @param messages
   * @param messageIndex
   * @returns {Observable<any>}
   */
  sendSms(phoneNumber, messages, messageIndex): Observable<any> {
    let options = {
      replaceLineBreaks: false,
      android: {
        intent: ''
      }
    };
    return new Observable(observer => {
      this.sms.send(phoneNumber, messages[messageIndex], options).then(
        success => {
          messageIndex = messageIndex + 1;
          if (messageIndex < messages.length) {
            this.sendSms(phoneNumber, messages, messageIndex).subscribe(
              () => {
                observer.next();
                observer.complete();
              },
              error => {
                observer.error(error);
              }
            );
          } else {
            observer.next(success);
            observer.complete();
          }
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  /**
   * get dataElements of a given data set
   * @param dataSet
   * @returns {Array}
   */
  getEntryFormDataElements(dataSet) {
    let dataElements = [];
    if (dataSet.dataElements && dataSet.dataElements.length > 0) {
      dataElements = dataSet.dataElements;
    } else if (dataSet.dataSetElements && dataSet.dataSetElements.length > 0) {
      dataSet.dataSetElements.map((dataSetElement: any) => {
        dataElements = _.concat(dataElements, dataSetElement.dataElement);
      });
    }
    return dataElements;
  }
}
