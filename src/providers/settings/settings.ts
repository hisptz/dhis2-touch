import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the SettingsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SettingsProvider {
  constructor(private storage: Storage) {}

  /**
   *
   * @returns {{id: string; name: string; icon: string; isLoading: boolean; loadingMessage: string}[]}
   */
  getSettingContentDetails() {
    let settingContents = [
      {
        id: 'appSettings',
        name: 'App settings',
        icon: 'assets/icon/app-setting.png',
        isLoading: false,
        loadingMessage: ''
      },
      {
        id: 'entryForm',
        name: 'Entry form',
        icon: 'assets/icon/form.png',
        isLoading: false,
        loadingMessage: ''
      },
      {
        id: 'synchronization',
        name: 'Synchronization',
        icon: 'assets/icon/synchronization.png',
        isLoading: false,
        loadingMessage: ''
      },
      {
        id: 'barcode',
        name: 'Barcode behaviour',
        icon: 'assets/icon/barcode-reader.png',
        isLoading: false,
        loadingMessage: ''
      }
    ];
    return settingContents;
  }

  /**
   *
   * @param currentUser
   * @param appSettings
   * @returns {Observable<any>}
   */
  setSettingsForTheApp(currentUser, appSettings): Observable<any> {
    appSettings = this.getSanitizedSettings(appSettings);
    return new Observable(observer => {
      let key =
        'appSettings' + (currentUser && currentUser.currentDatabase)
          ? currentUser.currentDatabase
          : '';
      appSettings = JSON.stringify(appSettings);
      this.storage.set(key, appSettings).then(
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
   * @param currentUser
   * @returns {Observable<any>}
   */
  getSettingsForTheApp(currentUser): Observable<any> {
    return new Observable(observer => {
      let key =
        'appSettings' + (currentUser && currentUser.currentDatabase)
          ? currentUser.currentDatabase
          : '';
      this.storage.get(key).then(
        appSettings => {
          try {
            appSettings = JSON.parse(appSettings);
            observer.next(appSettings);
            observer.complete();
          } catch (e) {
            observer.error(e);
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
   * @param time
   * @param timeType
   * @returns {any}
   */
  getSynchronizationTimeToSave(time, timeType) {
    let value = time;
    if (timeType == 'minutes') {
      value = time * 60 * 1000;
    } else if (timeType == 'hours') {
      value = time * 60 * 60 * 1000;
    }
    return value;
  }

  /**
   *
   * @param time
   * @param timeType
   * @returns {any}
   */
  getDisplaySynchronizationTime(time, timeType) {
    let value = time;
    if (timeType == 'minutes') {
      value = time / (60 * 1000);
    } else if (timeType == 'hours') {
      value = time / (60 * 60 * 1000);
    }
    return value;
  }

  /**
   *
   * @returns {{entryForm: {label: string; maxDataElementOnDefaultForm: number}; synchronization: {time: number; timeType: string}}}
   */
  getDefaultSettings() {
    let defaultSettings = {
      entryForm: {
        label: 'formName',
        maxDataElementOnDefaultForm: 10,
        formLayout: 'tableLayout',
        showAlertOnFormAssignement: true,
        shouldDisplayAsRadio: true
      },
      synchronization: {
        time: 2 * 60 * 1000,
        timeType: 'minutes',
        isAutoSync: true
      },
      barcode: {
        allowBarcodeReaderOnText: false,
        allowBarcodeReaderOnNumerical: false,
        activateMultiline: false,
        keyPairSeparator: ':',
        multilineSeparator: ';'
      }
    };
    return defaultSettings;
  }

  /**
   *
   * @param appSettings
   * @returns {any}
   */
  getSanitizedSettings(appSettings) {
    if (appSettings.entryForm) {
      if (
        isNaN(appSettings.entryForm.maxDataElementOnDefaultForm) ||
        appSettings.entryForm.maxDataElementOnDefaultForm <= 0
      ) {
        appSettings.entryForm.maxDataElementOnDefaultForm = 1;
      }
    }
    if (appSettings.synchronization) {
      if (
        isNaN(appSettings.synchronization.time) ||
        appSettings.synchronization.time < 1
      ) {
        appSettings.synchronization.time = 1;
      }
      appSettings.synchronization.time = this.getSynchronizationTimeToSave(
        appSettings.synchronization.time,
        appSettings.synchronization.timeType
      );
    }
    return appSettings;
  }
}
