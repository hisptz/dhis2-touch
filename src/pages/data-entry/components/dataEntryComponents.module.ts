import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SharedModule } from '../../../components/shared.module';
import { CustomDataEntryFormComponent } from './custom-data-entry-form/custom-data-entry-form';
@NgModule({
  declarations: [CustomDataEntryFormComponent],
  imports: [IonicModule, SharedModule],
  exports: [CustomDataEntryFormComponent]
})
export class DataEntryComponentsModule {}
