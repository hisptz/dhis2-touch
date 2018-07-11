import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackedEntityWidgetSelectionPage } from './tracked-entity-widget-selection';
import {SharedModule} from "../../../components/shared.module";
import { TranslateModule} from "@ngx-translate/core";
@NgModule({
  declarations: [
    TrackedEntityWidgetSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(TrackedEntityWidgetSelectionPage),SharedModule,
    TranslateModule.forChild({})
  ],
})
export class TrackedEntityWidgetSelectionPageModule {}
