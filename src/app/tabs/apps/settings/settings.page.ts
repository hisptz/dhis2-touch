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
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { State, getCurrentUserColorSettings } from '../../../store';
import {
  AppColorObject,
  CurrentUser,
  AppSettingContent,
  AppSetting,
  Translation
} from 'src/models';
import { UserService } from 'src/app/services/user.service';
import { SettingService } from 'src/app/services/setting.service';
import { DEFAULT_SETTINGS_CONTENTS } from 'src/constants';
import { AppTransalationsService } from 'src/app/services/app-transalations.service';
import { ToasterMessagesService } from 'src/app/services/toaster-messages.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {
  colorSettings$: Observable<AppColorObject>;
  currentUser: CurrentUser;
  settingContents: AppSettingContent[];
  currentAppSetting: AppSetting;
  supportedTranslations: Translation[];
  currentLanguage: string;
  isLoading: boolean;

  constructor(
    private store: Store<State>,
    private userService: UserService,
    private settingService: SettingService,
    private appTransalationsService: AppTransalationsService,
    private toasterMessagesService: ToasterMessagesService
  ) {
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
    this.isLoading = true;
  }

  ngOnInit() {
    this.discoveringCurrentUser();
  }

  async discoveringCurrentUser() {
    const currentUser = await this.userService.getCurrentUser();
    await this.discoveringCurrentAppSettings(currentUser);
  }

  async discoveringCurrentAppSettings(currentUser: CurrentUser) {
    const currentAppSetting = await this.settingService.getCurrentSettingsForTheApp(
      currentUser
    );
    this.supportedTranslations = _.sortBy(
      this.appTransalationsService.getSupportedTranslations(),
      'name'
    );

    this.currentAppSetting = currentAppSetting;
    this.currentUser = currentUser;
    const { currentLanguage } = currentUser;
    this.currentLanguage = currentLanguage;
    this.settingContents = this.getVisiableSettingContents();
    setTimeout(() => {
      this.isLoading = false;
    }, 200);
  }

  async onChangeCurrentLanguage(currentLanguage: string) {
    const currentUser = { ...this.currentUser, currentLanguage };
    this.currentLanguage = currentLanguage;
    this.appTransalationsService.setCurrentUserLanguage(currentLanguage);
    await this.userService.setCurrentUser(currentUser);
    await this.toastSuccessMessage();
  }

  async onChangesOnAppSettings(response: any) {
    const { id, data, isTypeOnSyncSettingChange } = response;
    this.currentAppSetting[id] = data;
    await this.settingService.setCurrentSettingsForTheApp(
      this.currentUser,
      this.currentAppSetting,
      isTypeOnSyncSettingChange
    );
    await this.toastSuccessMessage();
    // @TODO update synchronization process
    if (isTypeOnSyncSettingChange) {
    }
  }

  async toastSuccessMessage() {
    const message = `Changes have been applied successfully`;
    await this.toasterMessagesService.showToasterMessage(
      message,
      2000,
      '',
      'top'
    );
  }

  getVisiableSettingContents() {
    return _.filter(
      DEFAULT_SETTINGS_CONTENTS,
      (settingContent: AppSettingContent) => {
        return settingContent.isVisible;
      }
    );
  }
}
