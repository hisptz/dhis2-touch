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
 */

// Native plugins
import { HTTP } from '@ionic-native/http';
import { Network } from '@ionic-native/network';
import { AppVersion } from '@ionic-native/app-version';
import { SQLite } from '@ionic-native/sqlite';
import { Diagnostic } from '@ionic-native/diagnostic';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { DatePicker } from '@ionic-native/date-picker';
import { Geolocation } from '@ionic-native/geolocation';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SMS } from '@ionic-native/sms';
import { BackgroundMode } from '@ionic-native/background-mode';

import { AppTranslationProvider } from '../providers/app-translation/app-translation';
import { AppProvider } from './app/app';
import { NetworkAvailabilityProvider } from './network-availability/network-availability';
import { EncryptionProvider } from './encryption/encryption';
import { HttpClientProvider } from './http-client/http-client';
import { LocalInstanceProvider } from './local-instance/local-instance';
import { UserProvider } from './user/user';
import { BarcodeReaderProvider } from './barcode-reader/barcode-reader';
import { GeolocationProvider } from './geolocation/geolocation';
import { SettingsProvider } from './settings/settings';
import { SystemSettingProvider } from '../providers/system-setting/system-setting';
import { LocalStorageProvider } from '../providers/local-storage/local-storage';
import { SqlLiteProvider } from '../providers/sql-lite/sql-lite';
import { OrganisationUnitsProvider } from './organisation-units/organisation-units';
import { ProgramsProvider } from './programs/programs';
import { DataSetsProvider } from './data-sets/data-sets';
import { IndicatorsProvider } from './indicators/indicators';
import { ProgramRulesProvider } from './program-rules/program-rules';
import { ProgramStageSectionsProvider } from './program-stage-sections/program-stage-sections';
import { SectionsProvider } from './sections/sections';
import { SmsCommandProvider } from './sms-command/sms-command';
import { StandardReportProvider } from './standard-report/standard-report';
import { DataElementsProvider } from './data-elements/data-elements';

export const appProviders = [
  AppTranslationProvider,
  AppProvider,
  NetworkAvailabilityProvider,
  EncryptionProvider,
  HttpClientProvider,
  LocalInstanceProvider,
  UserProvider,
  BarcodeReaderProvider,
  OrganisationUnitsProvider,
  IndicatorsProvider,
  ProgramRulesProvider,
  ProgramStageSectionsProvider,
  SectionsProvider,
  SmsCommandProvider,
  StandardReportProvider,
  DataSetsProvider,
  GeolocationProvider,
  ProgramsProvider,
  SettingsProvider,
  SystemSettingProvider,
  LocalStorageProvider,
  SqlLiteProvider,
  DataElementsProvider
];

export const nativePlugins = [
  StatusBar,
  HTTP,
  Network,
  AppVersion,
  SQLite,
  Diagnostic,
  BarcodeScanner,
  SMS,
  DatePicker,
  Geolocation,
  SplashScreen,
  BackgroundMode
];
