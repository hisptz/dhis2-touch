import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackedEntityDashboardPage } from './tracked-entity-dashboard';

@NgModule({
  declarations: [
    TrackedEntityDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(TrackedEntityDashboardPage),
  ],
})
export class TrackedEntityDashboardPageModule {}
