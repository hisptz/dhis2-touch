import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import {ProgressBarComponent} from './progress-bar/progress-bar';
import {LoadingComponent} from "./loading/loading";
import {AppFeaturesSlideComponent} from "./app-features-slide/app-features-slide";
import {NotificationComponent} from "./notification/notification";
import {EmptyListNotificationComponent} from "./empty-list-notification/empty-list-notification";
import {HelpContentsComponent} from "./help-contents/help-contents";
import {WarningComponent} from "./warning/warning";
import {AvailableLocalInstanceComponent} from "./available-local-instance/available-local-instance";

@NgModule({
  declarations: [
    ProgressBarComponent,
    AppFeaturesSlideComponent,
    LoadingComponent,NotificationComponent,
    EmptyListNotificationComponent,HelpContentsComponent,WarningComponent,
    AvailableLocalInstanceComponent,
  ],
  imports: [
    IonicModule
  ],
  exports: [
    ProgressBarComponent,
    AppFeaturesSlideComponent,
    LoadingComponent,NotificationComponent,
    EmptyListNotificationComponent,HelpContentsComponent,WarningComponent,
    AvailableLocalInstanceComponent,
  ]
})

export class SharedModule { }
