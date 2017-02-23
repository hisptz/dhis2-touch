import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import {Apps} from "../pages/apps/apps";
import {Account} from "../pages/account/account";
import {TrackerCaptureHome} from "../pages/tracker-capture-home/tracker-capture-home";
import {SettingHome} from "../pages/setting-home/setting-home";
import {ReportHome} from "../pages/report-home/report-home";
import {UpdateManagerHome} from "../pages/update-manager-home/update-manager-home";
import {OrganisationUnits} from "../pages/organisation-units/organisation-units";
import {Profile} from "../pages/profile/profile";
import {Login} from "../pages/login/login";
import {Help} from "../pages/help/help";
import {EventCaptureHome} from "../pages/event-capture-home/event-capture-home";
import {DashBoardHome} from "../pages/dash-board-home/dash-board-home";
import {About} from "../pages/about/about";
import {DataEntryHome} from "../pages/data-entry-home/data-entry-home";
import {ObjectToArray} from "../pipes/object-to-array";
import {AccountName} from "../pipes/account-name";
import { Storage } from '@ionic/storage';
import {DataSetSelection} from "../pages/data-set-selection/data-set-selection";
import {PeriodSelection} from "../pages/period-selection/period-selection";
import {ProgramSelection} from "../pages/program-selection/program-selection";
import {DataEntryForm} from "../pages/data-entry-form/data-entry-form";
import {ReportView} from "../pages/report-view/report-view";
import {ReportParameterSelection} from "../pages/report-parameter-selection/report-parameter-selection";
import {EventCaptureForm} from "../pages/event-capture-form/event-capture-form";
import {EventView} from "../pages/event-view/event-view";

import { ChartModule } from 'angular2-highcharts';
import {EventFieldSelectionMenu} from "../pages/event-field-selection-menu/event-field-selection-menu";
import {ProgressBarPage} from "../pages/progress-bar/progress-bar";
import {HttpClient} from "../providers/http-client/http-client";
import {SqlLite} from "../providers/sql-lite/sql-lite";
import {DataValues} from "../providers/data-values";
import {EventCaptureFormProvider} from "../providers/event-capture-form-provider";
import {Synchronization} from "../providers/synchronization";
import {Launcher} from "../pages/launcher/launcher";
import {EntryFormSelection} from "../providers/entry-form-selection";
import {SendDataViaSms} from "../pages/send-data-via-sms/send-data-via-sms";
import {SmsCommand} from "../providers/sms-command";
import {VisualizationCardPage} from "../pages/visualization-card/visualization-card";
import {VisulizerService} from "../providers/visulizer.service";

@NgModule({
  declarations: [
    MyApp,About,DashBoardHome,EventCaptureHome,EventView,
    TabsPage,Help,Login,Profile,DataEntryHome,Launcher,SendDataViaSms,
    EventFieldSelectionMenu,ProgressBarPage,VisualizationCardPage,
    Apps,OrganisationUnits,UpdateManagerHome,DataSetSelection,PeriodSelection,
    Account,ReportHome,SettingHome,TrackerCaptureHome,ObjectToArray,ProgramSelection,
    AccountName,DataEntryForm,ReportView,ReportParameterSelection,EventCaptureForm
  ],
  imports: [
    ChartModule,
    IonicModule.forRoot(MyApp,{tabsPlacement: 'top'})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,About,DashBoardHome,EventCaptureHome,EventView,
    TabsPage,Help,Login,Profile,DataEntryHome,Launcher,SendDataViaSms,
    EventFieldSelectionMenu,ProgressBarPage,VisualizationCardPage,
    Apps,OrganisationUnits,UpdateManagerHome,DataSetSelection,PeriodSelection,ReportParameterSelection,
    Account,ReportHome,SettingHome,TrackerCaptureHome,ProgramSelection,DataEntryForm,ReportView,EventCaptureForm
  ],
  providers: [Storage,HttpClient,SqlLite,DataValues,
    VisulizerService,
    EventCaptureFormProvider,Synchronization,EntryFormSelection,SmsCommand]
})
export class AppModule {}
