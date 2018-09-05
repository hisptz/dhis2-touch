import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackedEntityDashboardPage } from './tracked-entity-dashboard';
import { sharedComponentsModule } from '../../../components/sharedComponents.module';
import { TranslateModule } from '@ngx-translate/core';
import { TrackerCaptureComponentsModule } from '../components/trackerCaptureComponents.module';
@NgModule({
  declarations: [TrackedEntityDashboardPage],
  imports: [
    IonicPageModule.forChild(TrackedEntityDashboardPage),
    sharedComponentsModule,
    TrackerCaptureComponentsModule,
    TranslateModule.forChild({})
  ]
})
export class TrackedEntityDashboardPageModule {}
