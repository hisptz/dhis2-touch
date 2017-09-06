import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ProgressBarPage } from './progress-bar/progress-bar';
import { LoadingPage } from './loading/loading';
import {EmptyListNotificationComponent} from "./empty-list-notification/empty-list-notification";
import {NotificationComponent} from "./notification/notification";
import {HelpContentsComponent} from "./help-contents/help-contents";
import {ReportCompComponent} from "./report-comp/report-comp";

@NgModule({
  declarations: [
    LoadingPage,
    ProgressBarPage,NotificationComponent,
    EmptyListNotificationComponent,HelpContentsComponent,ReportCompComponent
  ],
  imports: [
    IonicModule
  ],
  exports: [
    LoadingPage,
    ProgressBarPage,NotificationComponent,
    EmptyListNotificationComponent,HelpContentsComponent,ReportCompComponent
  ]
})

export class SharedModule { }
