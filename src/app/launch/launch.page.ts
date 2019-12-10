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
import { NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  State,
  AddCurrentUser,
  SetCurrentUserColorSettings,
  getCurrentUserColorSettings
} from '../store';

import { UserService } from '../services/user.service';
import { CurrentUser, AppColorObject } from 'src/models';
import { AppTransalationsService } from '../services/app-transalations.service';
import { AppConfigService } from '../services/app-config.service';

@Component({
  selector: 'app-launch',
  templateUrl: './launch.page.html',
  styleUrls: ['./launch.page.scss']
})
export class LaunchPage implements OnInit {
  topSlogan: string;
  buttonSlogan: string;
  appIcon: string;

  colorSettings$: Observable<AppColorObject>;
  constructor(
    private navCtrl: NavController,
    private userService: UserService,
    private appTranslationService: AppTransalationsService,
    private appConfigService: AppConfigService,
    private store: Store<State>
  ) {
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
    this.appIcon = 'assets/img/logo.png';
    this.topSlogan = 'Innovation in every dimension';
    this.buttonSlogan = 'powered by HISPTZ';
  }

  ngOnInit() {
    this.discoveringCurrentUser();
  }

  async discoveringCurrentUser() {
    try {
      const currentUser: CurrentUser = await this.userService.getCurrentUser();
      if (currentUser) {
        const {
          currentLanguage,
          colorSettings,
          isLogin,
          currentDatabase
        } = currentUser;
        const langCode: string = currentLanguage ? currentLanguage : `en`;
        this.appTranslationService.setCurrentUserLanguage(langCode);
        if (colorSettings) {
          this.store.dispatch(
            SetCurrentUserColorSettings({ colorSettings })
          );
        }
        if (currentDatabase) {
          await this.appConfigService.initateDataBaseConnection(
            currentDatabase
          );
        }
        if (isLogin) {
          this.store.dispatch(AddCurrentUser({ currentUser }));
          this.setLandingPage();
        } else {
          this.setLoginPage();
        }
      } else {
        this.setLoginPage();
      }
    } catch (error) {
      this.setLoginPage();
    }
  }

  setLandingPage() {
    setTimeout(() => {
      this.navCtrl.navigateRoot('/tabs');
    }, 1000);
  }

  setLoginPage() {
    this.navCtrl.navigateRoot('/login');
  }
}
