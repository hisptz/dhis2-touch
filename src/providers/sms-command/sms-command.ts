import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {HttpClientProvider} from "../http-client/http-client";
import {SMS} from '@ionic-native/sms';
import {Observable} from "rxjs/Observable";

/*
  Generated class for the SmsCommandProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SmsCommandProvider {

  resourceName: string;

  constructor(private SqlLite: SqlLiteProvider, private HttpClient: HttpClientProvider, private sms: SMS) {
    this.resourceName = "smsCommand";
  }

  /**
   *
   * @param user
   * @returns {Observable<any>}
   */
  getSmsCommandFromServer(user): Observable<any> {
    return new Observable(observer => {
      let smsCommandUrl = "/api/25/dataStore/sms/commands";
      this.HttpClient.get(smsCommandUrl, true, user).subscribe((response: any) => {
        observer.next(response);
        observer.complete();
      }, () => {
        observer.next([]);
        observer.complete();
      });
    });
  }

  /**
   *
   * @param smsCommands
   * @param databaseName
   * @returns {Observable<any>}
   */
  savingSmsCommand(smsCommands, databaseName): Observable<any> {
    return new Observable(observer => {
      if (smsCommands.length == 0) {
        observer.next();
        observer.complete();
      } else {
        smsCommands.forEach((smsCommand: any) => {
          smsCommand["id"] = smsCommand.dataSetId;
        });
        this.SqlLite.insertBulkDataOnTable(this.resourceName, smsCommands, databaseName).subscribe(() => {
          observer.next();
          observer.complete();
        }, error => {
          observer.error(error);
        });
      }
    });
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
      this.SqlLite.getDataFromTableByAttributes(this.resourceName, "id", ids, currentUser.currentDatabase).subscribe((smsCommands: any) => {
        if (smsCommands.length > 0) {
          observer.next(smsCommands[0]);
        } else {
          observer.next({});
        }
        observer.complete();
      }, error => {
        observer.error(error);
      });
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
  getEntryFormDataValuesObjectFromStorage(dataSetId, period, orgUnitId, dataElements, currentUser): Observable<any> {
    let ids = [];
    let entryFormDataValuesObjectFromStorage = {};
    dataElements.forEach((dataElement: any) => {
      dataElement.categoryCombo.categoryOptionCombos.forEach((categoryOptionCombo: any) => {
        ids.push(dataSetId + '-' + dataElement.id + '-' + categoryOptionCombo.id + '-' + period + '-' + orgUnitId);
      });
    });
    return new Observable(observer => {
      this.SqlLite.getDataFromTableByAttributes("dataValues", "id", ids, currentUser.currentDatabase).subscribe((dataValues: any) => {
        dataValues.forEach((dataValue: any) => {
          let id = dataValue.de + "-" + dataValue.co;
          entryFormDataValuesObjectFromStorage[id] = dataValue.value;
        });
        observer.next(entryFormDataValuesObjectFromStorage);
        observer.complete();
      }, error => {
        observer.error(error);
      });
    });
  }

  /**
   *
   * @param smsCommand
   * @param entryFormDataValuesObject
   * @param selectedPeriod
   * @returns {Observable<any>}
   */
  getSmsForReportingData(smsCommand, entryFormDataValuesObject, selectedPeriod): Observable<any> {
    return new Observable(observer => {
      let sms = [];
      let smsLimit = 135;
      let smsForReportingData = smsCommand.commandName + " " + selectedPeriod.iso + " ";
      let firstValuesFound = false;
      smsCommand.smsCode.forEach((smsCodeObject: any) => {
        let id = smsCodeObject.dataElement.id + "-" + smsCodeObject.categoryOptionCombos;
        if (entryFormDataValuesObject[id]) {
          let value = entryFormDataValuesObject[id];
          if (!firstValuesFound) {
            firstValuesFound = true;
          } else if ((smsForReportingData + smsCodeObject.smsCode + smsCommand.separator + value).length > smsLimit) {
            sms.push(smsForReportingData);
            firstValuesFound = false;
            smsForReportingData = smsCommand.commandName + " " + selectedPeriod.iso + " ";
          } else {
            smsForReportingData = smsForReportingData + "|";
          }
          smsForReportingData = smsForReportingData + smsCodeObject.smsCode + smsCommand.separator + value;
        }
      });
      sms.push(smsForReportingData);
      observer.next(sms);
      observer.complete();
    });
  };


  /**
   *
   * @param phoneNumber
   * @param messages
   * @returns {Observable<any>}
   */
  sendSmsForReportingData(phoneNumber, messages): Observable<any> {
    return new Observable(observer => {
      this.sendSms(phoneNumber, messages, 0).subscribe((success) => {
        observer.next();
        observer.complete();
      }, error => {
        observer.error(error);
      });
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
    const options = {
      replaceLineBreaks: false,
      android: {
        intent: ''
      }
    };
    return new Observable(observer => {
      this.sms.send(phoneNumber, messages[messageIndex], options).then((success) => {
        messageIndex = messageIndex + 1;
        if (messageIndex < messages.length) {
          this.sendSms(phoneNumber, messages, messageIndex).subscribe(() => {
            observer.next();
            observer.complete();
          }, error => {
            observer.error(error);
          });
        } else {
          observer.next(success);
          observer.complete();
        }
      }, (error) => {
        observer.error(error);
      });
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
      dataSet.dataSetElements.forEach((dataSetElement: any) => {
        dataElements.push(dataSetElement.dataElement);
      });
    }
    return dataElements;
  }


}
