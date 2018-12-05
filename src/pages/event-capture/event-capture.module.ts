import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventCapturePage } from './event-capture';
import { sharedComponentsModule } from '../../components/sharedComponents.module';
import { TranslateModule } from '@ngx-translate/core';
import { EventCaptureComponentsModule } from './components/eventCaptureComponents.module';
@NgModule({
  declarations: [EventCapturePage],
  imports: [
    IonicPageModule.forChild(EventCapturePage),
    sharedComponentsModule,
    EventCaptureComponentsModule,
    TranslateModule.forChild({})
  ]
})
export class EventCapturePageModule {}
