import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventCaptureRegisterPage } from './event-capture-register';

@NgModule({
  declarations: [
    EventCaptureRegisterPage,
  ],
  imports: [
    IonicPageModule.forChild(EventCaptureRegisterPage),
  ],
})
export class EventCaptureRegisterPageModule {}
