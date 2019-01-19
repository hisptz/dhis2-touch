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
import { Injectable } from '@angular/core';

@Injectable()
export class AppColorProvider {
  /*
    green-main:#2E7D32,
    green-secondary:#00E676,
    light-blue-main:#1D5288,
    light-blue-secondary:#488AFF,
    india-main:#EF6C00,
    india-secondary:#FF9100,
    myanmar-main:#F9A825,
    myanmar-secondary:#FFEA00,
    vietnam-main:#D84315,
    vietnam-secondary:#FF3D00,
  */
  constructor() {}

  getUserSettingColorAttribute(currentUser: any) {
    return currentUser &&
      currentUser.userSetting &&
      currentUser.userSetting.colorAttributes
      ? currentUser.userSetting.colorAttributes
      : { main: 'light-blue-main', secondary: 'light-blue-secondary' };
  }

  getUserSettingColorValue(currentUser: any) {
    return currentUser &&
      currentUser.userSetting &&
      currentUser.userSetting.colorCode
      ? currentUser.userSetting.colorCode
      : { main: '#1D5288', secondary: '#488AFF' };
  }

  getCurrentUserColorObject(currentStyle?: string, keyStyle?: string) {
    const userStyle = keyStyle
      ? keyStyle.split('/')[0]
      : currentStyle
      ? currentStyle.split('/')[0]
      : '';
    const colorAttributes =
      userStyle === 'green'
        ? { main: 'green-main', secondary: 'green-secondary' }
        : userStyle === 'light_blue'
        ? { main: 'light-blue-main', secondary: 'light-blue-secondary' }
        : userStyle === 'india'
        ? { main: 'india-main', secondary: 'india-secondary' }
        : userStyle === 'myanmar'
        ? { main: 'myanmar-main', secondary: 'myanmar-secondary' }
        : userStyle === 'vietnam'
        ? { main: 'vietnam-main', secondary: 'vietnam-secondary' }
        : { main: 'light-blue-main', secondary: 'light-blue-secondary' };
    const colorCode =
      userStyle === 'green'
        ? { main: '#2E7D32', secondary: '#00E676' }
        : userStyle === 'light_blue'
        ? { main: '#1D5288', secondary: '#488AFF' }
        : userStyle === 'india'
        ? { main: '#EF6C00', secondary: '#FF9100' }
        : userStyle === 'myanmar'
        ? { main: '#F9A825', secondary: '#FFEA00' }
        : userStyle === 'vietnam'
        ? { main: '#D84315', secondary: '#FF3D00' }
        : { main: '#1D5288', secondary: '#488AFF' };
    return { colorAttributes, colorCode };
  }
}
