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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'apps',
        children: [
          { path: '', loadChildren: './apps/apps.module#AppsPageModule' },
          {
            path: 'data-entry',
            loadChildren:
              './apps/data-entry/data-entry.module#DataEntryPageModule'
          },
          {
            path: 'event-capture',
            loadChildren:
              './apps/event-capture/event-capture.module#EventCapturePageModule'
          },
          {
            path: 'tracker-capture',
            loadChildren:
              './apps/tracker-capture/tracker-capture.module#TrackerCapturePageModule'
          },
          {
            path: 'dashboard',
            loadChildren:
              './apps/dashboard/dashboard.module#DashboardPageModule'
          },
          {
            path: 'reports',
            loadChildren: './apps/reports/reports.module#ReportsPageModule'
          },
          {
            path: 'sync',
            loadChildren: './apps/sync/sync.module#SyncPageModule'
          },
          {
            path: 'settings',
            loadChildren: './apps/settings/settings.module#SettingsPageModule'
          }
        ]
      },
      {
        path: 'accounts',
        children: [
          {
            path: '',
            loadChildren: './accounts/accounts.module#AccountsPageModule'
          },
          {
            path: 'profile',
            loadChildren: './accounts/profile/profile.module#ProfilePageModule'
          },
          {
            path: 'about',
            loadChildren: './accounts/about/about.module#AboutPageModule'
          },
          {
            path: 'help',
            loadChildren: './accounts/help/help.module#HelpPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: 'apps',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'apps',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes)
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
