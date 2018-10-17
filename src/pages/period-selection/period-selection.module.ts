import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PeriodSelectionPage } from './period-selection';
import { sharedComponentsModule } from '../../components/sharedComponents.module';
import { TranslateModule } from '@ngx-translate/core';
import { DataEntryComponentsModule } from '../data-entry/components/dataEntryComponents.module';
@NgModule({
  declarations: [PeriodSelectionPage],
  imports: [
    IonicPageModule.forChild(PeriodSelectionPage),
    DataEntryComponentsModule,
    sharedComponentsModule,
    TranslateModule.forChild({})
  ]
})
export class PeriodSelectionPageModule {}
