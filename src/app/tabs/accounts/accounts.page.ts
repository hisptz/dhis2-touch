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
import {
  State,
  getCurrentUserColorSettings,
  getAthorizedApps
} from '../../store';
import { AppColorObject, AppItem } from 'src/models';
import { UTILITIES_APP_LIST } from 'src/constants';
import { UserService } from 'src/app/services/user.service';
import { OrganisationUnitService } from 'src/app/services/organisation-unit.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.scss']
})
export class AccountsPage implements OnInit {
  colorSettings$: Observable<AppColorObject>;
  currentUserAccountApps$: Observable<AppItem[]>;

  constructor(
    private store: Store<State>,
    private userService: UserService,
    private organisationUnitService: OrganisationUnitService,
    private navCtrl: NavController
  ) {
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
    this.currentUserAccountApps$ = this.store.select(
      getAthorizedApps(UTILITIES_APP_LIST)
    );
  }

  ngOnInit() {}

  async onSelectApp(appItem: AppItem) {
    const { id, url } = appItem;
    if (id === 'logout') {
      await this.logOut();
    } else {
      console.log(url);
    }
  }

  async logOut() {
    try {
      const currentUser = await this.userService.getCurrentUser();
      if (currentUser) {
        await this.userService.setCurrentUser({
          ...currentUser,
          password: '',
          isLogin: false
        });
        this.organisationUnitService.resetOrganisationUnit();
      }
    } catch (error) {
    } finally {
      this.navCtrl.navigateRoot('/login');
    }
  }
}
