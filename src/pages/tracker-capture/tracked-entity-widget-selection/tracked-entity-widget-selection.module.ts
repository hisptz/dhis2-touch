import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackedEntityWidgetSelectionPage } from './tracked-entity-widget-selection';
import { sharedComponentsModule } from '../../../components/sharedComponents.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [TrackedEntityWidgetSelectionPage],
  imports: [
    IonicPageModule.forChild(TrackedEntityWidgetSelectionPage),
    sharedComponentsModule,
    TranslateModule.forChild({})
  ]
})
export class TrackedEntityWidgetSelectionPageModule {}
