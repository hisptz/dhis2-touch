import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import {ProgressBarComponent} from './progress-bar/progress-bar';
import {LoadingPage} from "./loading/loading";
import {AppFeaturesSlideComponent} from "./app-features-slide/app-features-slide";
import {NotificationComponent} from "./notification/notification";
import {EmptyListNotificationComponent} from "./empty-list-notification/empty-list-notification";
import {HelpContentsComponent} from "./help-contents/help-contents";
import {WarningComponent} from "./warning/warning";

@NgModule({
  declarations: [
    ProgressBarComponent,
    AppFeaturesSlideComponent,
    LoadingPage,NotificationComponent,
    EmptyListNotificationComponent,HelpContentsComponent,WarningComponent,
  ],
  imports: [
    IonicModule
  ],
  exports: [
    ProgressBarComponent,
    AppFeaturesSlideComponent,
    LoadingPage,NotificationComponent,
    EmptyListNotificationComponent,HelpContentsComponent,WarningComponent,
  ]
})

export class SharedModule { }
