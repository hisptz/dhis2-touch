import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ProgressBarPage } from './progress-bar/progress-bar';
import { LoadingPage } from './loading/loading';
import {EmptyListNotificationComponent} from "./empty-list-notification/empty-list-notification";
import {HelpContentsPage} from "./help-contents/help-contents";

@NgModule({
  declarations: [
    LoadingPage,
    ProgressBarPage,
    EmptyListNotificationComponent,HelpContentsPage
  ],
  imports: [
    IonicModule
  ],
  exports: [
    LoadingPage,
    ProgressBarPage,
    EmptyListNotificationComponent,HelpContentsPage
  ]
})

export class SharedModule { }
