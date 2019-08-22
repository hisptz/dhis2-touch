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

import { LocalInstance } from 'src/models';
import { DEFAULT_COLOR_SETTING } from './default-color-setting';
export const DEFAULT_LOCAL_INSTANCES: LocalInstance[] = [
  {
    id: 'default1',
    currentLanguage: 'en',
    currentUser: {
      username: '',
      serverUrl: 'dhis.moh.go.tz',
      password: '',
      currentLanguage: 'en',
      progressTracker: {},
      colorSettings: DEFAULT_COLOR_SETTING
    }
  },
  {
    id: 'default2',
    currentLanguage: 'en',
    currentUser: {
      username: '',
      serverUrl: 'dhis.hisptz.org/dhis',
      password: '',
      currentLanguage: 'en',
      progressTracker: {},
      colorSettings: DEFAULT_COLOR_SETTING
    }
  },
  {
    id: 'default3',
    currentLanguage: 'en',
    currentUser: {
      username: 'admin',
      serverUrl: 'play.dhis2.org/demo',
      password: 'district',
      currentLanguage: 'en',
      progressTracker: {},
      colorSettings: DEFAULT_COLOR_SETTING
    }
  },
  {
    id: 'default4',
    currentLanguage: 'en',
    currentUser: {
      username: 'admin',
      serverUrl: 'play.dhis2.org/2.29',
      password: 'district',
      currentLanguage: 'en',
      progressTracker: {},
      colorSettings: DEFAULT_COLOR_SETTING
    }
  }
];
