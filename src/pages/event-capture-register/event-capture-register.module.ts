import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventCaptureRegisterPage } from './event-capture-register';
import {SharedModule} from "../../components/shared.module";
import {DataEntryModule} from "../../components/data.entry.module";
import {Http} from "@angular/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
@NgModule({
  declarations: [
    EventCaptureRegisterPage,
  ],
  imports: [
    IonicPageModule.forChild(EventCaptureRegisterPage),SharedModule,DataEntryModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
})
export class EventCaptureRegisterPageModule {}
