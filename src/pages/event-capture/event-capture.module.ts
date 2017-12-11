import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventCapturePage } from './event-capture';
import {SharedModule} from "../../components/shared.module";
import {Http} from "@angular/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
@NgModule({
  declarations: [
    EventCapturePage,
  ],
  imports: [
    IonicPageModule.forChild(EventCapturePage),SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
})
export class EventCapturePageModule {}
