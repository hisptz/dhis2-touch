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
import { Component } from '@angular/core';
import { IonicPage, NavController, App } from 'ionic-angular';
import { Store, select } from '@ngrx/store';
import { State, getAthorizedApps } from '../../store';
import { UserProvider } from '../../providers/user/user';
import { CurrentUser } from '../../models/currentUser';
import { AppItem } from '../../models';
import { Observable } from 'rxjs';

/**
 * Generated class for the AccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  currentUserAccountApps$: Observable<AppItem[]>;

  constructor(
    private App: App,
    private navCtrl: NavController,
    private userProvider: UserProvider,
    private store: Store<State>
  ) {
    const apps = this.getAppItems();
    this.currentUserAccountApps$ = this.store.pipe(
      select(getAthorizedApps(apps))
    );
  }

  onSelectApp(app: AppItem) {
    if (app.id === 'logout') {
      this.logOut();
    } else {
      this.navCtrl.push(app.pageName);
    }
  }

  logOut() {
    this.userProvider.getCurrentUser().subscribe((currentUser: CurrentUser) => {
      if (currentUser && currentUser.username) {
        currentUser.isLogin = false;
        this.userProvider.setCurrentUser(currentUser).subscribe(() => {
          this.App.getRootNav().setRoot('LoginPage');
        });
      } else {
        this.App.getRootNav().setRoot('LoginPage');
      }
    });
  }

  getAppItems(): Array<AppItem> {
    return [
      {
        id: 'profile',
        name: 'Profile',
        authorites: [],
        pageName: 'ProfilePage',
        src: 'assets/icon/profile.png'
      },
      {
        id: 'about',
        name: 'About',
        authorites: [],
        pageName: 'AboutPage',
        src: 'assets/icon/about.png'
      },
      {
        id: 'help',
        name: 'Help',
        authorites: [],
        pageName: 'HelpPage',
        src: 'assets/icon/help.png'
      },
      {
        id: 'logout',
        name: 'Log out',
        authorites: [],
        pageName: '',
        src: 'assets/icon/logout.png'
      }
    ];
  }
}
