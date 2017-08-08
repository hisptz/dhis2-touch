import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ProgressBarPage } from './progress-bar/progress-bar';
import { LoadingPage } from './loading/loading';
import {EmptyListNotificationComponent} from "./empty-list-notification/empty-list-notification";

@NgModule({
  declarations: [
    LoadingPage,
    ProgressBarPage,
    EmptyListNotificationComponent
  ],
  imports: [
    IonicModule
  ],
  exports: [
    LoadingPage,
    ProgressBarPage,
    EmptyListNotificationComponent
  ]
})

export class SharedModule { }
