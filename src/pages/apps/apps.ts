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
import { IonicPage, NavController } from 'ionic-angular';
import { Store, select } from '@ngrx/store';
import { State, getAthorizedApps } from '../../store';
import { AppItem } from '../../models';
import { Observable } from 'rxjs';
/**
 * Generated class for the AppsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-apps',
  templateUrl: 'apps.html'
})
export class AppsPage {
  currentUserApps$: Observable<any>;
  constructor(public navCtrl: NavController, private store: Store<State>) {
    const apps = this.getAppItems();
    this.currentUserApps$ = this.store.pipe(select(getAthorizedApps(apps)));
  }

  onSelectApp(app: AppItem) {
    this.navCtrl.push(app.pageName);
  }

  getAppItems(): Array<AppItem> {
    return [
      {
        id: 'data_entry',
        name: 'Data entry',
        authorites: ['M_dhis-web-dataentry'],
        pageName: 'DataEntryPage',
        src: 'assets/icon/data-entry.png'
      },
      {
        id: 'event_capture',
        name: 'Event capture',
        authorites: ['M_dhis-web-event-capture'],
        pageName: 'EventCapturePage',
        src: 'assets/icon/event-capture.png'
      },
      {
        id: 'tracker_capture',
        name: 'Tracker capture',
        authorites: ['M_dhis-web-tracker-capture'],
        pageName: 'TrackerCapturePage',
        src: 'assets/icon/tracker-capture.png'
      },
      {
        id: 'dashboard',
        name: 'Dashboard',
        authorites: [
          'M_dhis-web-dashboard-integration',
          'M_dhis-web-dashboard'
        ],
        pageName: 'DashboardPage',
        src: 'assets/icon/dashboard.png'
      },
      {
        id: 'reports',
        name: 'Reports',
        authorites: ['M_dhis-web-reporting'],
        pageName: 'ReportsPage',
        src: 'assets/icon/reports.png'
      },
      {
        id: 'sync',
        name: 'Sync',
        authorites: [],
        pageName: 'SyncPage',
        src: 'assets/icon/sync.png'
      },
      {
        id: 'settings',
        name: 'Settings',
        authorites: [],
        pageName: 'SettingsPage',
        src: 'assets/icon/settings.png'
      }
    ];
  }
}
