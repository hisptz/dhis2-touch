import { Injectable } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { ToastController } from 'ionic-angular';
import { SqlLiteProvider } from '../sql-lite/sql-lite';
import { Http } from '@angular/http';
import { AppTranslationProvider } from '../app-translation/app-translation';

/*
  Generated class for the AppProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AppProvider {
  constructor(
    private appVersion: AppVersion,
    private toastController: ToastController,
    private sqLite: SqlLiteProvider,
    private http: Http,
    private transalationProvider: AppTranslationProvider
  ) {}

  /**
   *
   * @param {string} message
   */
  setTopNotification(message: string) {
    this.transalationProvider
      .getTransalations([message])
      .subscribe((data: any) => {
        this.toastController
          .create({
            message: data[message],
            position: 'top',
            duration: 4500
          })
          .present();
      });
  }

  /**
   *
   * @param {string} message
   * @param {number} time
   */
  setNormalNotification(message: string, time: number = 5000) {
    this.transalationProvider
      .getTransalations([message])
      .subscribe((data: any) => {
        this.toastController
          .create({
            message: data[message],
            position: 'bottom',
            duration: time
          })
          .present();
      });
  }

  /**
   *
   * @returns {Observable<any>}
   */
  getAppInformation(): Observable<any> {
    let appInformation = {};
    let promises = [];
    return new Observable(observer => {
      promises.push(
        this.appVersion.getAppName().then(appName => {
          appInformation['appName'] = appName;
        })
      );
      promises.push(
        this.appVersion.getPackageName().then(packageName => {
          appInformation['packageName'] = packageName;
        })
      );
      promises.push(
        this.appVersion.getVersionCode().then(versionCode => {
          appInformation['versionCode'] = versionCode;
        })
      );
      promises.push(
        this.appVersion.getVersionNumber().then(versionNumber => {
          appInformation['versionNumber'] = versionNumber;
        })
      );
      Observable.forkJoin(promises).subscribe(
        () => {
          observer.next(appInformation);
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
   * @param url
   * @param username
   * @returns {string}
   */
  getDataBaseName(url: string, username: string) {
    let databaseName: string = url
      .replace('://', '_')
      .replace(/[/\s]/g, '_')
      .replace(/[.\s]/g, '_')
      .replace(/[:\s]/g, '_');
    databaseName += '_' + username;
    return databaseName;
  }

  /**
   *
   * @param {string} url
   * @returns {string}
   */
  getFormattedBaseUrl(url: string) {
    let formattedBaseUrl: string = '';
    let urlToBeFormatted: string = '',
      urlArray: any = [],
      baseUrlString: any;
    if (!(url.split('/')[0] == 'https:' || url.split('/')[0] == 'http:')) {
      urlToBeFormatted = 'http://' + url;
    } else {
      urlToBeFormatted = url;
    }
    baseUrlString = urlToBeFormatted.split('/');
    for (let index in baseUrlString) {
      if (baseUrlString[index]) {
        urlArray.push(baseUrlString[index]);
      }
    }
    formattedBaseUrl = urlArray[0] + '/';
    for (let i = 0; i < urlArray.length; i++) {
      if (i != 0) {
        formattedBaseUrl = formattedBaseUrl + '/' + urlArray[i];
      }
    }

    formattedBaseUrl = this.getUrlWithLowercaseDomain(formattedBaseUrl);
    return formattedBaseUrl;
  }

  /**
   *
   * @param {string} formattedBaseUrl
   * @returns {string}
   */
  getUrlWithLowercaseDomain(formattedBaseUrl: string) {
    let baseUrlArray = formattedBaseUrl.split('://');

    if (baseUrlArray.length > 0) {
      let domainName = baseUrlArray[1].split('/')[0];
      let lowerCaseDomain = baseUrlArray[1].split('/')[0].toLowerCase();
      formattedBaseUrl = formattedBaseUrl.replace(domainName, lowerCaseDomain);
    }
    return formattedBaseUrl;
  }
}
