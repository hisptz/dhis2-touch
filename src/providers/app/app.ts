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
import { AppVersion } from '@ionic-native/app-version';
import { Observable } from 'rxjs/Rx';
import { ToastController } from 'ionic-angular';
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
    private transalationProvider: AppTranslationProvider
  ) {}

  /**
   *
   * @param {string} message
   */
  setTopNotification(message: string) {
    message = this.getSanitizedMessage(message);
    this.transalationProvider
      .getTransalations([message])
      .subscribe((data: any) => {
        this.toastController
          .create({
            message: data[message],
            position: 'top',
            duration: 5000
          })
          .present();
      });
  }

  /**
   *
   * @param {string} message
   * @param {number} time
   */
  setNormalNotification(message: string, time: number = 6000) {
    message = this.getSanitizedMessage(message);
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

  getSanitizedMessage(message) {
    const { error } = message;
    const { status } = message;
    let customMessage = error
      ? error
      : typeof message === 'object'
        ? ''
        : message;
    try {
      const matchRegx = /<body[^>]*>([\w|\W]*)<\/body/im;
      customMessage = customMessage
        .match(matchRegx)[0]
        .replace(/(<([^>]+)>)/gi, ':separator:')
        .split(':separator:')
        .filter(content => content.length > 0)[0];
    } catch (e) {}
    if (status) {
      customMessage = 'Status ' + status + ' : ' + customMessage;
    }
    return customMessage;
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
