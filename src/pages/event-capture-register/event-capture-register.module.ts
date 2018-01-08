import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventCaptureRegisterPage } from './event-capture-register';
import {SharedModule} from "../../components/shared.module";
import {DataEntryModule} from "../../components/data.entry.module";
import { TranslateModule} from "@ngx-translate/core";
@NgModule({
  declarations: [
    EventCaptureRegisterPage,
  ],
  imports: [
    IonicPageModule.forChild(EventCaptureRegisterPage),SharedModule,DataEntryModule,
    TranslateModule.forChild({})
  ],
})
export class EventCaptureRegisterPageModule {}
