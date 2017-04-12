import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';
import { HTTP } from '@ionic-native/http';
import { SMS } from '@ionic-native/sms';
import { AppVersion } from '@ionic-native/app-version';
import {AppProvider} from "../providers/app-provider";
import {HttpClient} from "../providers/http-client";
import {SqlLite} from "../providers/sql-lite";
import {User} from "../providers/user";
import {SmsCommand} from "../providers/sms-command";
import {VisualizerService} from "../providers/visualizer-service";
import {Dashboard} from "../providers/dashboard";
import {DataSets} from "../providers/data-sets";
import {DataValues} from "../providers/data-values";
import {EntryForm} from "../providers/entry-form";
import {EventCaptureFormProvider} from "../providers/event-capture-form-provider";
import {MetadataDictionaryService} from "../providers/metadata-dictionary-service";
import {Report} from "../providers/report";
import {ProgramStageSections} from "../providers/program-stage-sections";
import {ProgramStageDataElements} from "../providers/program-stage-data-elements";
import {Program} from "../providers/program";
import {OrganisationUnit} from "../providers/organisation-unit";
import {UpdateResourceManager} from "../providers/update-resource-manager";
import {Setting} from "../providers/setting";
import {Synchronization} from "../providers/synchronization";
import { ChartModule } from 'angular2-highcharts';
import {NetworkAvailability} from "../providers/network-availability";

import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { TabsPage } from '../pages/tabs/tabs';

import {AccountPage} from "../pages/account/account";
import {AppsPage} from "../pages/apps/apps";
import {DashBoardHomePage} from "../pages/dash-board-home/dash-board-home";
import {ReportHomePage} from "../pages/report-home/report-home";
import {EventCaptureHomePage} from "../pages/event-capture-home/event-capture-home";
import {DataEntryHomePage} from "../pages/data-entry-home/data-entry-home";
import {UpdateManagerHomePage} from "../pages/update-manager-home/update-manager-home";
import {SettingHomePage} from "../pages/setting-home/setting-home";
import {HelpPage} from "../pages/help/help";
import {ProfilePage} from "../pages/profile/profile";
import {LoginPage} from "../pages/login/login";
import {LoadingPage} from "../pages/loading/loading";
import {LauncherPage} from "../pages/launcher/launcher";
import {ProgressBarPage} from "../pages/progress-bar/progress-bar";
import {DataSetSelection} from "../pages/data-set-selection/data-set-selection";
import {VisualizationCardPage} from "../pages/visualization-card/visualization-card";
import {SendDataViaSms} from "../pages/send-data-via-sms/send-data-via-sms";
import {ProgramSelection} from "../pages/program-selection/program-selection";
import {OrganisationUnits} from "../pages/organisation-units/organisation-units";
import {PeriodSelection} from "../pages/period-selection/period-selection";
import {MetadataDictionary} from "../pages/metadata-dictionary/metadata-dictionary";
import {ReportParameterSelection} from "../pages/report-parameter-selection/report-parameter-selection";
import {ReportView} from "../pages/report-view/report-view";
import {EventView} from "../pages/event-view/event-view";
import {EventCaptureForm} from "../pages/event-capture-form/event-capture-form";
import {EventFieldSelectionMenu} from "../pages/event-field-selection-menu/event-field-selection-menu";
import {DataEntryForm} from "../pages/data-entry-form/data-entry-form";
import {ReportSelectionPeriod} from "../pages/report-selection-period/report-selection-period";
import {EntryFormSectionListPage} from "../pages/entry-form-section-list/entry-form-section-list";
import {DataSetSyncPage} from "../pages/data-set-sync/data-set-sync";
import {DataSetSyncContainerPage} from "../pages/data-set-sync-container/data-set-sync-container";
import {DataElementSyncContainerPage} from "../pages/data-element-sync-container/data-element-sync-container";
import {DataElementSyncPage} from "../pages/data-element-sync/data-element-sync";


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    AppsPage,
    OrganisationUnits, ProgramSelection, SendDataViaSms, VisualizationCardPage, DataSetSelection, PeriodSelection,
    DataEntryHomePage, EventCaptureHomePage, ReportHomePage, DashBoardHomePage,
    ProfilePage, AboutPage, HelpPage, SettingHomePage, UpdateManagerHomePage,
    AccountPage, LauncherPage, LoadingPage, LoginPage, MetadataDictionary,
    ProgressBarPage, ReportParameterSelection, ReportView, EventView, EventCaptureForm, EventFieldSelectionMenu,
    DataEntryForm, ReportSelectionPeriod, EntryFormSectionListPage, DataElementSyncPage, DataElementSyncContainerPage,
    DataSetSyncContainerPage, DataSetSyncPage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
        backButtonText: 'Back',
        iconMode: 'md',
        backButtonIcon: "ios-arrow-back-outline",
        modalEnter: 'modal-slide-in',
        modalLeave: 'modal-slide-out',
        tabsPlacement: 'top',
        pageTransition: 'ios'
      }, {}
    ),
    ChartModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    AppsPage,
    OrganisationUnits, ProgramSelection, SendDataViaSms, VisualizationCardPage, DataSetSelection, PeriodSelection,
    DataEntryHomePage, EventCaptureHomePage, ReportHomePage, DashBoardHomePage,
    ProfilePage, AboutPage, HelpPage, SettingHomePage, UpdateManagerHomePage,
    AccountPage, LauncherPage, LoadingPage, LoginPage, MetadataDictionary,
    ProgressBarPage, ReportParameterSelection, ReportView, EventView, EventCaptureForm, EventFieldSelectionMenu,
    DataEntryForm, ReportSelectionPeriod, EntryFormSectionListPage, DataElementSyncPage, DataElementSyncContainerPage,
    DataSetSyncContainerPage, DataSetSyncPage,
    TabsPage
  ],
  providers: [
    StatusBar, NetworkAvailability,
    SplashScreen, SQLite, HTTP, AppVersion, SMS,
    Dashboard, DataSets, DataValues, EntryForm, EventCaptureFormProvider,
    MetadataDictionaryService, UpdateResourceManager, OrganisationUnit, Program,
    ProgramStageDataElements, ProgramStageSections, Report, Setting, Synchronization,
    AppProvider, HttpClient, SqlLite, User, SmsCommand, VisualizerService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
