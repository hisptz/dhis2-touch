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
import {DataSetDimension} from "../pages/data-set-dimension/data-set-dimension";
import {DataEntryForm} from "../pages/data-entry-form/data-entry-form";
import {ReportView} from "../pages/report-view/report-view";
import {ReportParameterSelection} from "../pages/report-parameter-selection/report-parameter-selection";
import {SettingDetail} from "../pages/setting-detail/setting-detail";
import {EventCaptureForm} from "../pages/event-capture-form/event-capture-form";

@NgModule({
  declarations: [
    MyApp,About,DashBoardHome,EventCaptureHome,
    TabsPage,Help,Login,Profile,DataEntryHome,DataSetDimension,
    Apps,OrganisationUnits,UpdateManagerHome,DataSetSelection,PeriodSelection,
    Account,ReportHome,SettingHome,TrackerCaptureHome,ObjectToArray,ProgramSelection,
    AccountName,DataEntryForm,ReportView,ReportParameterSelection,SettingDetail,EventCaptureForm
  ],
  imports: [
    IonicModule.forRoot(MyApp,{tabsPlacement: 'top'})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,About,DashBoardHome,EventCaptureHome,
    TabsPage,Help,Login,Profile,DataEntryHome,DataSetDimension,SettingDetail,
    Apps,OrganisationUnits,UpdateManagerHome,DataSetSelection,PeriodSelection,ReportParameterSelection,
    Account,ReportHome,SettingHome,TrackerCaptureHome,ProgramSelection,DataEntryForm,ReportView,EventCaptureForm
  ],
  providers: [Storage]
})
export class AppModule {}
