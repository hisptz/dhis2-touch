import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackerCapturePage } from './tracker-capture';
import { sharedComponentsModule } from '../../components/sharedComponents.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [TrackerCapturePage],
  imports: [
    IonicPageModule.forChild(TrackerCapturePage),
    sharedComponentsModule,
    TranslateModule.forChild({})
  ]
})
export class TrackerCapturePageModule {}
