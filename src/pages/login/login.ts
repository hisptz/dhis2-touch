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
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  IonicPage,
  NavController,
  ModalOptions,
  ModalController
} from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { UserProvider } from '../../providers/user/user';
import { CurrentUser } from '../../models/currentUser';

import { Store } from '@ngrx/store';
import { State, AddCurrentUser } from '../../store';

import * as _ from 'lodash';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';
import { AppProvider } from '../../providers/app/app';
import { SystemSettingProvider } from '../../providers/system-setting/system-setting';
import { SettingsProvider } from '../../providers/settings/settings';
import { SmsCommandProvider } from '../../providers/sms-command/sms-command';
import { LocalInstanceProvider } from '../../providers/local-instance/local-instance';
import { EncryptionProvider } from '../../providers/encryption/encryption';
import { BackgroundMode } from '@ionic-native/background-mode';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit, OnDestroy {
  logoUrl: string;
  isLoginFormValid: boolean;
  isLoginProcessActive: boolean;
  isOnLogin: boolean;
  showOverallProgressBar: boolean;
  overAllLoginMessage: string;
  offlineIcon: string;
  currentUser: CurrentUser;
  topThreeTranslationCodes: string[];
  localInstances: string[];
  processes: string[];
  keyFlag: string;
  keyApplicationFooter: string;
  applicationTitle: string;
  keyApplicationNotification: string;
  keyApplicationIntro: string;

  constructor(
    private navCtrl: NavController,
    private userProvider: UserProvider,
    private appTranslationProvider: AppTranslationProvider,
    private appProvider: AppProvider,
    private systemSettings: SystemSettingProvider,
    private settingsProvider: SettingsProvider,
    private smsCommandProvider: SmsCommandProvider,
    private localInstanceProvider: LocalInstanceProvider,
    private encryptionProvider: EncryptionProvider,
    private modalCtrl: ModalController,
    private backgroundMode: BackgroundMode,
    private store: Store<State>
  ) {
    this.logoUrl = 'assets/img/logo.png';
    this.offlineIcon = 'assets/icon/offline.png';
    this.isLoginFormValid = false;
    this.isLoginProcessActive = false;
    this.isOnLogin = true;
    this.showOverallProgressBar = true;
    this.topThreeTranslationCodes = this.appTranslationProvider.getTopThreeSupportedTranslationCodes();
    this.processes = [
      'organisationUnits',
      'sections',
      'dataElements',
      'smsCommand',
      'programs',
      'programStageSections',
      'programRules',
      'indicators',
      'programRuleActions',
      'programRuleVariables',
      'dataSets',
      'reports',
      'constants'
    ];
  }

  ngOnInit() {
    const defaultCurrentUser: CurrentUser = {
      serverUrl: 'play.dhis2.org/2.28', //'dhis.hisptz.org/eds', // 'ssudanhis.org', //'play.dhis2.org/2.28',
      username: 'admin', // 'boma',
      password: 'district', // 'Boma_2018',
      currentLanguage: 'en',
      progressTracker: {}
    };
    this.localInstanceProvider.getLocalInstances().subscribe(localInstances => {
      this.localInstances = localInstances;
    });
    this.userProvider.getCurrentUser().subscribe(
      (currentUser: CurrentUser) => {
        if (currentUser && currentUser.username) {
          currentUser.password = '';
          this.currentUser = currentUser;
        } else {
          this.currentUser = defaultCurrentUser;
        }
      },
      () => {
        this.currentUser = defaultCurrentUser;
      }
    );
  }

  openLocalInstancesSelection() {
    const options: ModalOptions = {
      cssClass: 'inset-modal',
      enableBackdropDismiss: true
    };
    const data = { localInstances: this.localInstances };
    const modal = this.modalCtrl.create(
      'LocalInstancesSelectionPage',
      { data: data },
      options
    );
    modal.onDidDismiss((currentUser: CurrentUser) => {
      if (currentUser) {
        this.currentUser = null;
        currentUser.password = '';
        setTimeout(() => {
          this.currentUser = _.assign({}, this.currentUser, currentUser);
        }, 20);
      }
    });
    modal.present();
  }

  openTranslationCodeSelection() {
    const options: ModalOptions = {
      cssClass: 'inset-modal',
      enableBackdropDismiss: true
    };
    const data = { currentLanguage: this.currentUser.currentLanguage };
    const modal = this.modalCtrl.create(
      'TransalationSelectionPage',
      { data: data },
      options
    );
    modal.onDidDismiss((code: string) => {
      if (code) {
        this.updateTranslationLanguage(code);
      }
    });
    modal.present();
  }

  updateTranslationLanguage(code) {
    this.appTranslationProvider.setAppTranslation(code);
    this.currentUser.currentLanguage = code;
  }

  onFormFieldChange(data) {
    const { status } = data;
    const { currentUser } = data;
    this.isLoginFormValid = status;
    if (status) {
      this.currentUser = _.assign({}, this.currentUser, currentUser);
    } else {
      this.isLoginProcessActive = false;
    }
  }

  onUpdateCurrentUser(currentUser) {
    this.currentUser = _.assign({}, this.currentUser, currentUser);
  }

  onCancelLoginProcess() {
    this.isLoginProcessActive = false;
    this.backgroundMode
      .disable()
      .then(() => {})
      .catch(e => {});
  }

  onFailLogin(errorReponse) {
    this.appProvider.setNormalNotification(errorReponse);
    this.onCancelLoginProcess();
  }

  onSuccessLogin(data) {
    const { currentUser } = data;
    currentUser.isLogin = true;
    let loggedInInInstance = this.currentUser.serverUrl;
    if (currentUser.serverUrl.split('://').length > 1) {
      loggedInInInstance = this.currentUser.serverUrl.split('://')[1];
    }
    this.reCheckingAppSetting(currentUser);
    currentUser.hashedKeyForOfflineAuthentication = this.encryptionProvider.getHashedKeyForOfflineAuthentication(
      currentUser
    );
    currentUser.password = this.encryptionProvider.encode(currentUser.password);
    currentUser.isPasswordEncode = true;
    this.currentUser = _.assign({}, this.currentUser, currentUser);
    if (
      this.currentUser &&
      this.currentUser.serverUrl &&
      this.currentUser.username
    ) {
      this.currentUser['currentDatabase'] = this.appProvider.getDataBaseName(
        this.currentUser.serverUrl,
        this.currentUser.username
      );
      this.localInstanceProvider
        .setLocalInstanceInstances(
          this.localInstances,
          this.currentUser,
          loggedInInInstance
        )
        .subscribe(() => {
          this.store.dispatch(
            new AddCurrentUser({ currentUser: this.currentUser })
          );
          this.userProvider.setCurrentUser(this.currentUser).subscribe(() => {
            this.backgroundMode
              .disable()
              .then(() => {})
              .catch(e => {});
            this.smsCommandProvider
              .checkAndGenerateSmsCommands(this.currentUser)
              .subscribe(() => {}, error => {});
            this.navCtrl.setRoot(TabsPage);
          });
        });
    }
  }

  reCheckingAppSetting(currentUser) {
    let defaultSetting = this.settingsProvider.getDefaultSettings();
    this.settingsProvider
      .getSettingsForTheApp(currentUser)
      .subscribe((appSettings: any) => {
        if (!appSettings) {
          let time = defaultSetting.synchronization.time;
          let timeType = defaultSetting.synchronization.timeType;
          defaultSetting.synchronization.time = this.settingsProvider.getDisplaySynchronizationTime(
            time,
            timeType
          );
          this.settingsProvider
            .setSettingsForTheApp(currentUser, defaultSetting)
            .subscribe(() => {}, error => {});
        }
      });
  }

  onSystemSettingLoaded(data: any, skipSaving?: boolean) {
    const { keyFlag } = data;
    const { keyApplicationFooter } = data;
    const { applicationTitle } = data;
    const { keyApplicationNotification } = data;
    const { keyApplicationIntro } = data;
    const { serverUrl } = this.currentUser;

    this.keyFlag = keyFlag ? keyFlag : null;
    this.keyApplicationFooter = keyApplicationFooter
      ? keyApplicationFooter
      : null;
    this.applicationTitle = applicationTitle ? applicationTitle : null;
    this.keyApplicationNotification = keyApplicationNotification
      ? keyApplicationNotification
      : null;
    this.keyApplicationIntro = keyApplicationIntro ? keyApplicationIntro : null;
    if (!skipSaving) {
      this.systemSettings
        .saveSystemSettings(data, serverUrl)
        .subscribe(() => {});
    }
  }

  startLoginProcess() {
    this.overAllLoginMessage = this.currentUser.serverUrl;
    this.isLoginProcessActive = true;
    this.backgroundMode.enable();
    this.resetLoginSpinnerValues();
  }

  ngOnDestroy() {
    this.resetAllValues();
  }

  resetLoginSpinnerValues() {
    this.keyFlag = null;
    this.keyApplicationFooter = null;
    this.applicationTitle = null;
    this.keyApplicationNotification = null;
    this.keyApplicationIntro = null;
  }
  resetAllValues() {
    this.logoUrl = null;
    this.isLoginFormValid = null;
    this.isLoginProcessActive = null;
    this.offlineIcon = null;
    this.topThreeTranslationCodes = null;
    this.localInstances = null;
    this.processes = null;
    this.showOverallProgressBar = null;
    this.isOnLogin = null;
    this.resetLoginSpinnerValues();
  }
}
