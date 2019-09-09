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

export interface AppSetting {
  entryForm: EntryFormSetting;
  synchronization: SynchronizationSetting;
  barcode: BarcodeSetting;
}

export interface EntryFormSetting {
  label: string;
  maxDataElementOnDefaultForm: number;
  formLayout: string;
  showAlertOnFormAssignement: boolean;
  shouldDisplayAsRadio: boolean;
  dataConflictPreferredOnline: boolean;
  maximumNumberOfOptionAsRadio: number;
}
export interface SynchronizationSetting {
  time: number;
  timeType: string;
  isAutoSync: boolean;
}
export interface BarcodeSetting {
  allowBarcodeReaderOnText: boolean;
  allowBarcodeReaderOnNumerical: boolean;
  activateMultiline: boolean;
  keyPairSeparator: string;
  multilineSeparator: string;
}

export interface AppSettingContent {
  id: string;
  name: string;
  icon: string;
  isVisible: boolean;
  isOpened: boolean;
}
