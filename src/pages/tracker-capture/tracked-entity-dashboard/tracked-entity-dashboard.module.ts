import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackedEntityDashboardPage } from './tracked-entity-dashboard';
import { SharedModule } from '../../../components/shared.module';
import { DataEntryModule } from '../../../components/data.entry.module';
import { TranslateModule } from '@ngx-translate/core';
import { TrackerCaptureComponentsModule } from '../components/trackerCaptureComponents.module';
@NgModule({
  declarations: [TrackedEntityDashboardPage],
  imports: [
    IonicPageModule.forChild(TrackedEntityDashboardPage),
    SharedModule,
    DataEntryModule,
    TrackerCaptureComponentsModule,
    TranslateModule.forChild({})
  ]
})
export class TrackedEntityDashboardPageModule {}
