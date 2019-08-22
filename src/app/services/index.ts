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
 */

// Native plugins
import { SQLite } from '@ionic-native/sqlite/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { Network } from '@ionic-native/network/ngx';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

// services
import { AppConfigService } from './app-config.service';
import { BarcodeReaderService } from './barcode-reader.service';
import { ToasterMessagesService } from './toaster-messages.service';
import { EncryptionService } from './encryption.service';
import { LocalStorageService } from './local-storage.service';
import { LocalInstanceService } from './local-instance.service';
import { AppTransalationsService } from './app-transalations.service';
import { SettingService } from './setting.service';
import { SystemSettingService } from './system-setting.service';
import { UserService } from './user.service';
import { HttpClientService } from './http-client.service';
import { NetworkService } from './network.service';
import { UserAuthorizationService } from './user-authorization.service';
import { SystemInformationService } from './system-information.service';
import { AppColorService } from './app-color.service';
import { OrganisationUnitService } from './organisation-unit.service';
import { DataSetService } from './data-set.service';
import { SectionService } from './section.service';
import { DataElementService } from './data-element.service';
import { CategoryComboService } from './category-combo.service';
import { SmsCommandService } from './sms-command.service';
import { ProgramService } from './program.service';
import { ProgramStageSectionService } from './program-stage-section.service';
import { ProgramRuleEngineService } from './program-rule-engine.service';
import { IndicatorService } from './indicator.service';
import { StandardResportService } from './standard-resport.service';
import { DataStoreManagerService } from './data-store-manager.service';
import { ValidationRuleService } from './validation-rule.service';
import { GeolocationService } from './geolocation.service';

export const appProviders = [
  AppConfigService,
  BarcodeReaderService,
  ToasterMessagesService,
  EncryptionService,
  LocalStorageService,
  LocalInstanceService,
  AppTransalationsService,
  SettingService,
  SystemSettingService,
  UserService,
  HttpClientService,
  NetworkService,
  UserAuthorizationService,
  SystemInformationService,
  AppColorService,
  OrganisationUnitService,
  DataSetService,
  SectionService,
  DataElementService,
  CategoryComboService,
  SmsCommandService,
  ProgramService,
  ProgramStageSectionService,
  ProgramRuleEngineService,
  IndicatorService,
  StandardResportService,
  DataStoreManagerService,
  ValidationRuleService,
  GeolocationService
];

export const nativePlugins = [
  SQLite,
  SplashScreen,
  StatusBar,
  BarcodeScanner,
  Diagnostic,
  BackgroundMode,
  HTTP,
  Network,
  DatePicker,
  Geolocation
];
