import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

//native plugins
import {SQLite} from "@ionic-native/sqlite";
import {HTTP} from "@ionic-native/http";
import {AppVersion} from "@ionic-native/app-version";
import {Network} from "@ionic-native/network";
import {BackgroundMode} from "@ionic-native/background-mode";
import {SMS} from "@ionic-native/sms";
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {IonicStorageModule} from "@ionic/storage";

// Multi-language
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Http, HttpModule } from '@angular/http';

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

//pages
import { TabsPage } from '../pages/tabs/tabs';
import {AppsPage} from "../pages/apps/apps";
import {AccountPage} from "../pages/account/account";
import {LoginPage} from "../pages/login/login";
import {LauncherPage} from "../pages/launcher/launcher";
//modules

import {SharedModule} from "../components/shared.module";

//providers
import { HttpClientProvider } from '../providers/http-client/http-client';
import {MessageServiceProvider} from "../providers/message-service/message-service";
import {ResourceProvider} from "../providers/resource/resource";
import {UserProvider} from "../providers/user/user";
import {NetworkAvailabilityProvider} from "../providers/network-availability/network-availability";
import {AppProvider} from "../providers/app/app";
import {VisualizerService} from "../providers/visualizer-service";
import {DashboardServiceProvider} from "../providers/dashboard-service/dashboard-service";
import {AboutProvider} from "../providers/about/about";
import {ProfileProvider} from "../providers/profile/profile";
import {SettingsProvider} from "../providers/settings/settings";
import {HelpContentsProvider} from "../providers/help-contents/help-contents";
import {DashboardProvider} from "../providers/dashboard/dashboard";
import {AnalyticsServiceProvider} from "../providers/analytics-service/analytics-service";
import {ChartServiceProvider} from "../providers/chart-service/chart-service";
import {ColorInterpolationServiceProvider} from "../providers/color-interpolation-service/color-interpolation-service";
import {DashboardNotificationServiceProvider} from "../providers/dashboard-notification-service/dashboard-notification-service";
import {FavoriteServiceProvider} from "../providers/favorite-service/favorite-service";
import {GeoFeatureServiceProvider} from "../providers/geo-feature-service/geo-feature-service";
import {LegendSetServiceProvider} from "../providers/legend-set-service/legend-set-service";
import {MapServiceProvider} from "../providers/map-service/map-service";
import {MapVisualizationServiceProvider} from "../providers/map-visualization-service/map-visualization-service";
import {OrgUnitGroupSetServiceProvider} from "../providers/org-unit-group-set-service/org-unit-group-set-service";
import {EnrollmentsProvider} from "../providers/enrollments/enrollments";
import {TrackedEntityAttributeValuesProvider} from "../providers/tracked-entity-attribute-values/tracked-entity-attribute-values";
import {VisualizationServiceProvider} from "../providers/visualization-service/visualization-service";
import {TableServiceProvider} from "../providers/table-service/table-service";
import {RelativePeriodServiceProvider} from "../providers/relative-period-service/relative-period-service";
import {VisualizationObjectServiceProvider} from "../providers/visualization-object-service/visualization-object-service";
import {VisualizerServiceProvider} from "../providers/visualizer-service/visualizer-service";
import {UtilitiesServiceProvider} from "../providers/utilities-service/utilities-service";
import {MapFilesConversionProvider} from "../providers/map-files-conversion/map-files-conversion";
import {TileLayers} from "../constants/tile-layers";
import {OrgUnitService} from "../providers/org-unit.service";
import {SqlLiteProvider} from "../providers/sql-lite/sql-lite";
import {OrganisationUnitsProvider} from "../providers/organisation-units/organisation-units";
import {DataSetsProvider} from "../providers/data-sets/data-sets";
import {SectionsProvider} from "../providers/sections/sections";
import {DataElementsProvider} from "../providers/data-elements/data-elements";
import {SmsCommandProvider} from "../providers/sms-command/sms-command";
import {IndicatorsProvider} from "../providers/indicators/indicators";
import {SyncProvider} from "../providers/sync/sync";
import {StandardReportProvider} from "../providers/standard-report/standard-report";
import {PeriodSelectionProvider} from "../providers/period-selection/period-selection";
import {ProgramsProvider} from "../providers/programs/programs";
import {ProgramStageSectionsProvider} from "../providers/program-stage-sections/program-stage-sections";
import {EventCaptureFormProvider} from "../providers/event-capture-form/event-capture-form";
import {DataEntryFormProvider} from "../providers/data-entry-form/data-entry-form";
import {DataValuesProvider} from "../providers/data-values/data-values";
import {DataSetCompletenessProvider} from "../providers/data-set-completeness/data-set-completeness";
import {TrackerCaptureProvider} from "../providers/tracker-capture/tracker-capture";
import {TrackedEntityInstancesProvider} from "../providers/tracked-entity-instances/tracked-entity-instances";
import { DataSetReportProvider } from '../providers/data-set-report/data-set-report';


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
    SharedModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
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
    StatusBar,SQLite,
    SplashScreen,HTTP,AppVersion,Network,BackgroundMode,SMS,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ResourceProvider,HttpClientProvider,UserProvider,NetworkAvailabilityProvider,AppProvider,
    VisualizerService,DashboardServiceProvider,
    AboutProvider,
    ProfileProvider,
    SettingsProvider,
    HelpContentsProvider,
    DashboardProvider,
    AnalyticsServiceProvider,
    ChartServiceProvider,
    ColorInterpolationServiceProvider,
    DashboardNotificationServiceProvider,
    FavoriteServiceProvider,
    GeoFeatureServiceProvider,
    LegendSetServiceProvider,
    MapServiceProvider,
    MapVisualizationServiceProvider,
    OrgUnitGroupSetServiceProvider,
    RelativePeriodServiceProvider,
    TableServiceProvider,
    VisualizationServiceProvider,
    VisualizationObjectServiceProvider,
    VisualizerServiceProvider,
    UtilitiesServiceProvider,
    MapFilesConversionProvider,TileLayers,OrgUnitService,
    MessageServiceProvider,
    SqlLiteProvider,
    OrganisationUnitsProvider,
    DataSetsProvider,
    SectionsProvider,
    DataElementsProvider,
    SmsCommandProvider,
    IndicatorsProvider,
    SyncProvider,
    StandardReportProvider,
    PeriodSelectionProvider,
    ProgramsProvider,
    ProgramStageSectionsProvider,
    EventCaptureFormProvider,
    DataEntryFormProvider,
    DataValuesProvider, DataSetCompletenessProvider,
    TrackerCaptureProvider,
    TrackedEntityInstancesProvider,
    TrackedEntityAttributeValuesProvider,
    EnrollmentsProvider,
    DataSetReportProvider
  ]
})
export class AppModule {}
