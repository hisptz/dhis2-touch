import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ProgressBarPage } from './progress-bar/progress-bar';
import { LoadingPage } from './loading/loading';
import {EmptyListNotificationComponent} from "./empty-list-notification/empty-list-notification";
import {NotificationComponent} from "./notification/notification";
import {HelpContentsComponent} from "./help-contents/help-contents";
import {WarningComponent} from "./warning/warning";
import {Http} from "@angular/http";
import {createTranslateLoader} from "../app/app.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [
    LoadingPage,
    ProgressBarPage,NotificationComponent,
    EmptyListNotificationComponent,HelpContentsComponent,WarningComponent,
  ],
  imports: [
    IonicModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      },
      isolate: true
    }),
  ],
  exports: [
    LoadingPage,
    ProgressBarPage,NotificationComponent,
    EmptyListNotificationComponent,HelpContentsComponent,WarningComponent
  ]
})

export class SharedModule { }
