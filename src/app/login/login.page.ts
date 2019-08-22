/*
 *
 * Copyright 2019 HISP Tanzania
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
 * @since 2019
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */

import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { NavController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  State,
  AddCurrentUser,
  SetCurrentUserColorSettings,
  getCurrentUserColorSettings
} from '../store';
import {
  CurrentUser,
  LocalInstance,
  SystemSettings,
  AppSetting,
  AppColorObject,
  Translation
} from 'src/models';
import { DEFAULT_USER, DEFAULT_SETTINGS } from 'src/constants';

import { TranslationSelectionPage } from '../modals/translation-selection/translation-selection.page';
import { LocalInstanceSelectionPage } from '../modals/local-instance-selection/local-instance-selection.page';

import { ToasterMessagesService } from '../services/toaster-messages.service';
import { EncryptionService } from '../services/encryption.service';
import { AppTransalationsService } from '../services/app-transalations.service';
import { LocalInstanceService } from '../services/local-instance.service';
import { UserService } from '../services/user.service';
import { SystemSettingService } from '../services/system-setting.service';
import { SettingService } from '../services/setting.service';
import { getAppMetadata } from 'src/helpers';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  topSlogan: string;
  buttonSlogan: string;
  appIcon: string;
  isLoginProcessActive: boolean;
  isLoginFormValid: boolean;
  isOnLogin: boolean;
  showOverallProgressBar: boolean;
  topThreeTranslationCodes: string[];
  localInstances: LocalInstance[];
  processes: string[];
  keyFlag: string;
  keyApplicationFooter: string;
  applicationTitle: string;
  keyApplicationNotification: string;
  keyApplicationIntro: string;
  overAllLoginMessage: string;
  currentUser: CurrentUser;
  offlineIcon: string;

  colorSettings$: Observable<AppColorObject>;

  constructor(
    private backgroundMode: BackgroundMode,
    private toasterMessageService: ToasterMessagesService,
    private encryptionService: EncryptionService,
    private translationService: AppTransalationsService,
    private localInstanceServices: LocalInstanceService,
    private userService: UserService,
    private systemSettingService: SystemSettingService,
    private settingService: SettingService,
    private navCtrl: NavController,
    private modalController: ModalController,
    private store: Store<State>
  ) {
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
    this.appIcon = 'assets/img/logo.png';
    this.offlineIcon = 'assets/icon/offline.png';
    this.topSlogan = 'Innovation in every dimension';
    this.buttonSlogan = 'powered by iApps';
    this.isLoginProcessActive = false;
    this.isOnLogin = true;
    this.showOverallProgressBar = true;
    this.localInstances = [];
    this.topThreeTranslationCodes = this.translationService.getTopThreeSupportedTranslationCodes();
    this.processes = getAppMetadata();
  }

  ngOnInit() {
    this.getAndSetLocalInstance();
    this.fetchAndSetCurrentUser();
  }

  async fetchAndSetCurrentUser() {
    let currentUser = null;
    try {
      currentUser = await this.userService.getCurrentUser();
    } catch (error) {
    } finally {
      this.currentUser = currentUser ? currentUser : DEFAULT_USER;
    }
  }

  async getAndSetLocalInstance() {
    this.localInstances = await this.localInstanceServices.getLocalInstances();
  }

  async openLocalInstancesSelection() {
    const modal = await this.modalController.create({
      component: LocalInstanceSelectionPage,
      componentProps: { localInstances: this.localInstances },
      cssClass: 'inset-modal'
    });
    modal.present();
    const response = await modal.onDidDismiss();
    if (response && response.data) {
      const currentUser = response.data;
      this.currentUser = null;
      setTimeout(() => {
        this.currentUser = _.assign({}, this.currentUser, {
          ...currentUser,
          password: ''
        });
        this.onCancelLoginProcess();
      }, 20);
    }
  }

  async openTranslationCodeSelection() {
    const translationCodes = this.translationService.getSupportedTranslations();
    const { currentLanguage } = this.currentUser;
    const modal = await this.modalController.create({
      component: TranslationSelectionPage,
      componentProps: { currentLanguage, translationCodes },
      cssClass: 'inset-modal'
    });
    modal.present();
    const response = await modal.onDidDismiss();
    if (response && response.data) {
      const currrentTransalation: Translation = response.data;
      const { code } = currrentTransalation;
      this.updateTranslationLanguage(code);
    }
  }

  updateTranslationLanguage(currentLanguage: string) {
    this.currentUser = { ...this.currentUser, currentLanguage };
    this.translationService.setCurrentUserLanguage(currentLanguage);
  }

  onFormFieldChange(data: any) {
    const { status } = data;
    const { currentUser } = data;
    this.isLoginFormValid = status;
    if (status) {
      this.currentUser = _.assign({}, this.currentUser, currentUser);
    } else {
      this.isLoginProcessActive = false;
    }
  }

  async onStartLoginProcess() {
    const { username, password, serverUrl } = this.currentUser;
    this.currentUser = {
      ...this.currentUser,
      username: username.trim(),
      password: password.trim(),
      serverUrl: serverUrl.trim(),
      isPasswordEncode: false
    };
    this.overAllLoginMessage = this.currentUser.serverUrl;
    this.isLoginProcessActive = true;
    this.backgroundMode.enable();
    this.resetLoginSpinnerValues();
  }

  async onUpdateCurrentUser(currentUser: CurrentUser) {
    const { colorSettings } = currentUser;
    if (colorSettings) {
      this.store.dispatch(new SetCurrentUserColorSettings({ colorSettings }));
    }
    this.currentUser = _.assign({}, this.currentUser, currentUser);
    await this.userService.setCurrentUser(this.currentUser);
  }

  async onCancelLoginProcess() {
    this.isLoginProcessActive = false;
    await this.backgroundMode.disable();
  }

  onFailLogin(errorResponseObject: any) {
    const {
      failedProcesses,
      error,
      failedProcessesErrors
    } = errorResponseObject;
    if (error) {
      this.toasterMessageService.showToasterMessage(error, 10000);
    } else if (failedProcesses && failedProcesses.length > 0) {
      let errorMessage = '';
      failedProcesses.map(process => {
        const errorResponse: any =
          failedProcessesErrors[failedProcesses.indexOf(process)];
        errorMessage +=
          (process.charAt(0).toUpperCase() + process.slice(1))
            .replace(/([A-Z])/g, ' $1')
            .trim() +
          ' : ' +
          this.toasterMessageService.getSanitizedErrorMessage(errorResponse) +
          '; ';
      });
      this.toasterMessageService.showToasterMessage(errorMessage, 10000);
    }
    this.onCancelLoginProcess();
  }

  async onSuccessLogin(data) {
    const { currentUser } = data;
    const loggedInInInstance =
      currentUser.serverUrl.split('://').length > 1
        ? this.currentUser.serverUrl.split('://')[1]
        : this.currentUser.serverUrl;
    const hashedKeyForOfflineAuthentication = this.encryptionService.getHashedKeyForOfflineAuthentication(
      currentUser
    );
    const password = this.encryptionService.encode(currentUser.password);
    this.currentUser = _.assign({}, this.currentUser, {
      ...currentUser,
      hashedKeyForOfflineAuthentication,
      password,
      isPasswordEncode: true,
      isLogin: true
    });
    try {
      await this.reCheckingAppSetting(currentUser);
      await this.localInstanceServices.setLocalInstanceInstances(
        this.localInstances,
        loggedInInInstance,
        this.currentUser
      );
      const { colorSettings } = this.currentUser;
      if (colorSettings) {
        this.store.dispatch(new SetCurrentUserColorSettings({ colorSettings }));
      }
      this.store.dispatch(
        new AddCurrentUser({ currentUser: this.currentUser })
      );
      await this.userService.setCurrentUser(this.currentUser);
      this.navCtrl.navigateRoot('/tabs');
    } catch (error) {
      await this.toasterMessageService.showToasterMessage(
        error,
        6000,
        'Error',
        'top'
      );
    } finally {
      await this.backgroundMode.disable();
    }
  }

  async reCheckingAppSetting(currentUser: CurrentUser) {
    const defaultSetting: AppSetting = DEFAULT_SETTINGS;
    const appSettings: AppSetting = await this.settingService.getSettingsForTheApp(
      currentUser
    );
    if (!appSettings) {
      const time = defaultSetting.synchronization.time;
      const timeType = defaultSetting.synchronization.timeType;
      defaultSetting.synchronization.time = this.settingService.getDisplaySynchronizationTime(
        time,
        timeType
      );
      await this.settingService.setSettingsForTheApp(currentUser, appSettings);
    }
  }

  async onSystemSettingLoaded(
    systemSettings: SystemSettings,
    skipSaving?: boolean
  ) {
    const {
      keyFlag,
      keyApplicationIntro,
      keyApplicationFooter,
      applicationTitle,
      keyApplicationNotification
    } = systemSettings;
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
      await this.systemSettingService.saveSystemSettings(
        systemSettings,
        this.currentUser
      );
    }
  }

  resetLoginSpinnerValues() {
    this.keyFlag = null;
    this.keyApplicationFooter = null;
    this.applicationTitle = null;
    this.keyApplicationNotification = null;
    this.keyApplicationIntro = null;
  }
}
