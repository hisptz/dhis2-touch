import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackedEntityDashboardPage } from './tracked-entity-dashboard';
import { SharedModule } from '../../../components/shared.module';
import { DataEntryModule } from '../../../components/data.entry.module';
import { TranslateModule } from '@ngx-translate/core';
import { DataEntryComponentsModule } from '../../data-entry/components/dataEntryComponents.module';
@NgModule({
  declarations: [TrackedEntityDashboardPage],
  imports: [
    IonicPageModule.forChild(TrackedEntityDashboardPage),
    SharedModule,
    DataEntryModule,
    DataEntryComponentsModule,
    TranslateModule.forChild({})
  ]
})
export class TrackedEntityDashboardPageModule {}
