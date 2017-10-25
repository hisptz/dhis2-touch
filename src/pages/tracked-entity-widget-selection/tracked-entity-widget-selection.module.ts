import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackedEntityWidgetSelectionPage } from './tracked-entity-widget-selection';
import {SharedModule} from "../../components/shared.module";

@NgModule({
  declarations: [
    TrackedEntityWidgetSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(TrackedEntityWidgetSelectionPage),SharedModule,
  ],
})
export class TrackedEntityWidgetSelectionPageModule {}
