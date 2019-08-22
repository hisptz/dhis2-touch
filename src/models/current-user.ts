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
import { AppColorObject } from './app-color';
export interface CurrentUser {
  username: string;
  name?: string;
  id?: string;
  dataViewOrganisationUnits?: any;
  password: string; // encrypted string
  serverUrl: string;
  currentLanguage: string;
  isLogin?: boolean;
  isPasswordEncode?: boolean;
  authorizationKey?: string;
  hashedKeyForOfflineAuthentication?: string;
  currentDatabase?: string;
  dhisVersion?: string;
  authorities?: string[];
  progressTracker?: any;
  userOrgUnitIds?: string[];
  programs?: string[];
  dataSets?: string[];
  colorSettings?: AppColorObject;
}
