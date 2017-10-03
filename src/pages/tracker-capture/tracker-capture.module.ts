import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackerCapturePage } from './tracker-capture';
import {SharedModule} from "../../components/shared.module";

@NgModule({
  declarations: [
    TrackerCapturePage,
  ],
  imports: [
    IonicPageModule.forChild(TrackerCapturePage),SharedModule
  ],
})
export class TrackerCapturePageModule {}
