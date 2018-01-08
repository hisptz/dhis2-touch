import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventCapturePage } from './event-capture';
import {SharedModule} from "../../components/shared.module";
import { TranslateModule} from "@ngx-translate/core";
@NgModule({
  declarations: [
    EventCapturePage,
  ],
  imports: [
    IonicPageModule.forChild(EventCapturePage),SharedModule,
    TranslateModule.forChild({})
  ],
})
export class EventCapturePageModule {}
