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
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'apps',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./apps/apps.module').then(m => m.AppsPageModule)
          },
          {
            path: 'data-entry',
            loadChildren: () =>
              import('./apps/data-entry/data-entry.module').then(
                m => m.DataEntryPageModule
              )
          },
          {
            path: 'data-entry-form',
            loadChildren: () =>
              import(
                './apps/data-entry/pages/data-entry-form/data-entry-form.module'
              ).then(m => m.DataEntryFormPageModule)
          },
          {
            path: 'event-capture',
            loadChildren: () =>
              import('./apps/event-capture/event-capture.module').then(
                m => m.EventCapturePageModule
              )
          },
          {
            path: 'tracker-capture',
            loadChildren: () =>
              import('./apps/tracker-capture/tracker-capture.module').then(
                m => m.TrackerCapturePageModule
              )
          },
          {
            path: 'dashboard',
            loadChildren: () =>
              import('./apps/dashboard/dashboard.module').then(
                m => m.DashboardPageModule
              )
          },
          {
            path: 'reports',
            loadChildren: () =>
              import('./apps/reports/reports.module').then(
                m => m.ReportsPageModule
              )
          },
          {
            path: 'sync',
            loadChildren: () =>
              import('./apps/sync/sync.module').then(m => m.SyncPageModule)
          },
          {
            path: 'settings',
            loadChildren: () =>
              import('./apps/settings/settings.module').then(
                m => m.SettingsPageModule
              )
          }
        ]
      },
      {
        path: 'accounts',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./accounts/accounts.module').then(
                m => m.AccountsPageModule
              )
          },
          {
            path: 'profile',
            loadChildren: () =>
              import('./accounts/profile/profile.module').then(
                m => m.ProfilePageModule
              )
          },
          {
            path: 'about',
            loadChildren: () =>
              import('./accounts/about/about.module').then(
                m => m.AboutPageModule
              )
          },
          {
            path: 'help',
            loadChildren: () =>
              import('./accounts/help/help.module').then(m => m.HelpPageModule)
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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
