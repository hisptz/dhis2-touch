import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackerCapturePage } from './tracker-capture';
import { sharedComponentsModule } from '../../components/sharedComponents.module';
import { TranslateModule } from '@ngx-translate/core';
import { TrackerCaptureComponentsModule } from './components/trackerCaptureComponents.module';
@NgModule({
  declarations: [TrackerCapturePage],
  imports: [
    IonicPageModule.forChild(TrackerCapturePage),
    TrackerCaptureComponentsModule,
    sharedComponentsModule,
    TranslateModule.forChild({})
  ]
})
export class TrackerCapturePageModule {}
