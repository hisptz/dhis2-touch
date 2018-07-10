import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
//native plugins
import { SQLite } from '@ionic-native/sqlite';
import { HTTP } from '@ionic-native/http';
import { AppVersion } from '@ionic-native/app-version';
import { Network } from '@ionic-native/network';
import { BackgroundMode } from '@ionic-native/background-mode';
import { SMS } from '@ionic-native/sms';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { DatePicker } from '@ionic-native/date-picker';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Diagnostic } from '@ionic-native/diagnostic';

// Multi-language
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Http, HttpModule } from '@angular/http';

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

//pages
import { TabsPage } from '../pages/tabs/tabs';
import { AppsPage } from '../pages/apps/apps';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { LauncherPage } from '../pages/launcher/launcher';
//modules

import { SharedModule } from '../components/shared.module';
import { PipesModule } from '../pipes/pipes.module';
import * as profileProviders from '../pages/profile/providers';

//store
import { reducers, effects } from '../store';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

//providers
import { HttpClientProvider } from '../providers/http-client/http-client';
import { UserProvider } from '../providers/user/user';
import { NetworkAvailabilityProvider } from '../providers/network-availability/network-availability';
import { AppProvider } from '../providers/app/app';
import { AboutProvider } from '../providers/about/about';
import { SettingsProvider } from '../providers/settings/settings';
import { HelpContentsProvider } from '../providers/help-contents/help-contents';
import { SqlLiteProvider } from '../providers/sql-lite/sql-lite';
import { OrganisationUnitsProvider } from '../providers/organisation-units/organisation-units';
import { DataSetsProvider } from '../providers/data-sets/data-sets';
import { SectionsProvider } from '../providers/sections/sections';
import { DataElementsProvider } from '../providers/data-elements/data-elements';
import { SmsCommandProvider } from '../providers/sms-command/sms-command';
import { IndicatorsProvider } from '../providers/indicators/indicators';
import { SyncProvider } from '../providers/sync/sync';
import { StandardReportProvider } from '../providers/standard-report/standard-report';
import { PeriodSelectionProvider } from '../providers/period-selection/period-selection';
import { ProgramsProvider } from '../providers/programs/programs';
import { ProgramStageSectionsProvider } from '../providers/program-stage-sections/program-stage-sections';
import { EventCaptureFormProvider } from '../providers/event-capture-form/event-capture-form';
import { DataEntryFormProvider } from '../providers/data-entry-form/data-entry-form';
import { DataValuesProvider } from '../providers/data-values/data-values';
import { DataSetCompletenessProvider } from '../providers/data-set-completeness/data-set-completeness';
import { TrackerCaptureProvider } from '../providers/tracker-capture/tracker-capture';
import { TrackedEntityInstancesProvider } from '../providers/tracked-entity-instances/tracked-entity-instances';
import { DataSetReportProvider } from '../providers/data-set-report/data-set-report';
import { LocalInstanceProvider } from '../providers/local-instance/local-instance';
import { AppTranslationProvider } from '../providers/app-translation/app-translation';
import { EnrollmentsProvider } from '../providers/enrollments/enrollments';
import { TrackedEntityAttributeValuesProvider } from '../providers/tracked-entity-attribute-values/tracked-entity-attribute-values';
import { EncryptionProvider } from '../providers/encryption/encryption';
import { SmsGatewayProvider } from '../providers/sms-gateway/sms-gateway';
import { ProgramRulesProvider } from '../providers/program-rules/program-rules';
import { SynchronizationProvider } from '../providers/synchronization/synchronization';
import { GeolocationProvider } from '../providers/geolocation/geolocation';
import { BarcodeReaderProvider } from '../providers/barcode-reader/barcode-reader';

@NgModule({
  declarations: [
    MyApp,
    AppsPage,
    AccountPage,
    LoginPage,
    LauncherPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(effects),
    IonicModule.forRoot(MyApp),
    HttpModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [Http]
      }
    }),
    PipesModule,
    SharedModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AppsPage,
    AccountPage,
    LoginPage,
    LauncherPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SQLite,
    SplashScreen,
    Geolocation,
    Diagnostic,
    DatePicker,
    BarcodeScanner,
    HTTP,
    AppVersion,
    Network,
    BackgroundMode,
    SMS,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    HttpClientProvider,
    UserProvider,
    NetworkAvailabilityProvider,
    AppProvider,
    AboutProvider,
    SettingsProvider,
    HelpContentsProvider,
    SqlLiteProvider,
    SmsCommandProvider,
    OrganisationUnitsProvider,
    DataSetsProvider,
    SectionsProvider,
    DataElementsProvider,
    SmsGatewayProvider,
    IndicatorsProvider,
    SyncProvider,
    StandardReportProvider,
    PeriodSelectionProvider,
    ProgramsProvider,
    ProgramStageSectionsProvider,
    EventCaptureFormProvider,
    DataEntryFormProvider,
    DataValuesProvider,
    DataSetCompletenessProvider,
    TrackerCaptureProvider,
    TrackedEntityInstancesProvider,
    TrackedEntityAttributeValuesProvider,
    EnrollmentsProvider,
    DataSetReportProvider,
    LocalInstanceProvider,
    AppTranslationProvider,
    EncryptionProvider,
    ProgramRulesProvider,
    SynchronizationProvider,
    GeolocationProvider,
    BarcodeReaderProvider,
    ...profileProviders.providers
  ]
})
export class AppModule {}
