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

import { AppSetting, AppSettingContent, Option } from 'src/models';

export const DEFAULT_SETTINGS: AppSetting = {
  entryForm: {
    label: 'formName',
    maxDataElementOnDefaultForm: 10,
    maximumNumberOfOptionAsRadio: 5,
    formLayout: 'customLayout',
    showAlertOnFormAssignement: true,
    dataConflictPreferredOnline: false,
    shouldDisplayAsRadio: true
  },
  synchronization: {
    time: 2,
    timeType: 'minutes',
    isAutoSync: true
  },
  barcode: {
    allowBarcodeReaderOnText: false,
    allowBarcodeReaderOnNumerical: false,
    activateMultiline: false,
    keyPairSeparator: ':',
    multilineSeparator: ';'
  }
};

export const DEFAULT_SETTINGS_CONTENTS: AppSettingContent[] = [
  {
    id: 'appSettings',
    name: 'App settings',
    icon: 'assets/icon/app-setting.png',
    isVisible: true,
    isOpened: false
  },
  {
    id: 'entryForm',
    name: 'Entry form',
    icon: 'assets/icon/form.png',
    isVisible: true,
    isOpened: false
  },
  {
    id: 'synchronization',
    name: 'Synchronization',
    icon: 'assets/icon/synchronization.png',
    isVisible: true,
    isOpened: false
  },
  {
    id: 'barcode',
    name: 'Barcode behaviour',
    icon: 'assets/icon/barcode-reader.png',
    isVisible: true,
    isOpened: false
  }
];

export const DEFAULT_FORM_LABEL_SETTINGS: Option[] = [
  { id: 'displayName', name: 'Display name', code: 'displayName' },
  { id: 'formName', name: 'Form name', code: 'formName' }
];

export const DEFAULT_UNIT_TIME_SYNCHRONIZATION: Option[] = [
  { id: 'minutes', name: 'Minutes', code: 'minutes' },
  { id: 'hours', name: 'Hours', code: 'hours' }
];

export const DEFAULT_FORM_LAYOUT_SETTINGS: Option[] = [
  { id: 'tableLayout', name: 'Table Layout', code: 'tableLayout' },
  { id: 'listLayout', name: 'List Layout', code: 'listLayout' },
  { id: 'customLayout', name: 'Custom Layout', code: 'customLayout' }
];
