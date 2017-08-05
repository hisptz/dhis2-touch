import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventCapturePage } from './event-capture';

@NgModule({
  declarations: [
    EventCapturePage,
  ],
  imports: [
    IonicPageModule.forChild(EventCapturePage),
  ],
})
export class EventCapturePageModule {}
