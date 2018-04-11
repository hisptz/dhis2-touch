import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataEntryFormPage } from './data-entry-form';
import { SharedModule } from '../../../components/shared.module';
import { DataEntryModule } from '../../../components/data.entry.module';
import { TranslateModule } from '@ngx-translate/core';
import { DataEntryComponentsModule } from '../components/dataEntryComponents.module';

@NgModule({
  declarations: [DataEntryFormPage],
  imports: [
    IonicPageModule.forChild(DataEntryFormPage),
    SharedModule,
    DataEntryModule,
    DataEntryComponentsModule,
    TranslateModule.forChild({})
  ]
})
export class DataEntryFormPageModule {}
