import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackerEntityRegisterPage } from './tracker-entity-register';
import { sharedComponentsModule } from '../../../components/sharedComponents.module';
import { TranslateModule } from '@ngx-translate/core';
import { TrackerCaptureComponentsModule } from '../components/trackerCaptureComponents.module';
import { EventCaptureComponentsModule } from '../../event-capture/components/eventCaptureComponents.module';
@NgModule({
  declarations: [TrackerEntityRegisterPage],
  imports: [
    IonicPageModule.forChild(TrackerEntityRegisterPage),
    sharedComponentsModule,
    EventCaptureComponentsModule,
    TrackerCaptureComponentsModule,
    TranslateModule.forChild({})
  ]
})
export class TrackerEntityRegisterPageModule {}
