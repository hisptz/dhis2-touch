import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventCapturePage } from './event-capture';
import {SharedModule} from "../../components/shared.module";

@NgModule({
  declarations: [
    EventCapturePage,
  ],
  imports: [
    IonicPageModule.forChild(EventCapturePage),SharedModule
  ],
})
export class EventCapturePageModule {}
