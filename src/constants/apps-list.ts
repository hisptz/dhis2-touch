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

import { AppItem } from 'src/models';

export const APPS_LIST: AppItem[] = [
  {
    id: 'data_entry',
    name: 'Data entry',
    authorites: ['M_dhis-web-dataentry'],
    url: 'data-entry',
    isVisible: true,
    src: 'assets/icon/data-entry.png'
  },
  {
    id: 'event_capture',
    name: 'Event capture',
    authorites: ['M_dhis-web-event-capture'],
    url: 'event-capture',
    isVisible: true,
    src: 'assets/icon/event-capture.png'
  },
  {
    id: 'tracker_capture',
    name: 'Tracker capture',
    authorites: ['M_dhis-web-tracker-capture'],
    url: 'tracker-capture',
    isVisible: true,
    src: 'assets/icon/tracker-capture.png'
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    authorites: ['M_dhis-web-dashboard-integration', 'M_dhis-web-dashboard'],
    url: 'dashboard',
    isVisible: true,
    src: 'assets/icon/dashboard.png'
  },
  {
    id: 'reports',
    name: 'Reports',
    authorites: ['M_dhis-web-reporting'],
    url: 'reports',
    isVisible: true,
    src: 'assets/icon/reports.png'
  },
  {
    id: 'sync',
    name: 'Sync',
    authorites: [],
    url: 'sync',
    isVisible: true,
    src: 'assets/icon/sync.png'
  },
  {
    id: 'settings',
    name: 'Settings',
    authorites: [],
    url: 'settings',
    isVisible: true,
    src: 'assets/icon/settings.png'
  }
];
