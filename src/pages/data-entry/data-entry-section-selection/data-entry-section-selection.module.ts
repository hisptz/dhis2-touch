import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataEntrySectionSelectionPage } from './data-entry-section-selection';
import { sharedComponentsModule } from '../../../components/sharedComponents.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [DataEntrySectionSelectionPage],
  imports: [
    IonicPageModule.forChild(DataEntrySectionSelectionPage),
    sharedComponentsModule,
    TranslateModule.forChild({})
  ]
})
export class DataEntrySectionSelectionPageModule {}
