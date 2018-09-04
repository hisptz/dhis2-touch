import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataEntryFormPage } from './data-entry-form';
import { sharedComponentsModule } from '../../../components/sharedComponents.module';

import { TranslateModule } from '@ngx-translate/core';
import { DataEntryComponentsModule } from '../components/dataEntryComponents.module';

@NgModule({
  declarations: [DataEntryFormPage],
  imports: [
    IonicPageModule.forChild(DataEntryFormPage),
    sharedComponentsModule,
    DataEntryComponentsModule,
    TranslateModule.forChild({})
  ]
})
export class DataEntryFormPageModule {}
