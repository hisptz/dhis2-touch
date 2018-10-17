import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventCaptureRegisterPage } from './event-capture-register';
import { sharedComponentsModule } from '../../../components/sharedComponents.module';
import { TranslateModule } from '@ngx-translate/core';
import { EventCaptureComponentsModule } from '../components/eventCaptureComponents.module';
@NgModule({
  declarations: [EventCaptureRegisterPage],
  imports: [
    IonicPageModule.forChild(EventCaptureRegisterPage),
    sharedComponentsModule,
    EventCaptureComponentsModule,
    TranslateModule.forChild({})
  ]
})
export class EventCaptureRegisterPageModule {}
