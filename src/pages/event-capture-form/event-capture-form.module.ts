import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {SharedModule} from "../../components/shared.module";
import {EventCaptureForm} from "./event-capture-form";
import {DataEntryModule} from "../../components/data.entry.module";

@NgModule({
  declarations: [
    EventCaptureForm,
  ],
  imports: [
    IonicPageModule.forChild(EventCaptureForm),SharedModule, DataEntryModule
  ],
})
export class EventCapturePageModule {}
