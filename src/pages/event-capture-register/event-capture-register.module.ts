import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventCaptureRegisterPage } from './event-capture-register';
import {SharedModule} from "../../components/shared.module";
import {DataEntryModule} from "../../components/data.entry.module";

@NgModule({
  declarations: [
    EventCaptureRegisterPage,
  ],
  imports: [
    IonicPageModule.forChild(EventCaptureRegisterPage),SharedModule,DataEntryModule
  ],
})
export class EventCaptureRegisterPageModule {}
