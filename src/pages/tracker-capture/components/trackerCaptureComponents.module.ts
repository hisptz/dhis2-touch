import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SharedModule } from '../../../components/shared.module';
import { TrackerRegistrationFormComponent } from './tracker-registration-form/tracker-registration-form';
import { DataEntryComponentsModule } from '../../data-entry/components/dataEntryComponents.module';
import { DataEntryModule } from '../../../components/data.entry.module';
@NgModule({
  declarations: [TrackerRegistrationFormComponent],
  imports: [
    IonicModule,
    SharedModule,
    DataEntryComponentsModule,
    DataEntryModule
  ],
  exports: [TrackerRegistrationFormComponent]
})
export class TrackerCaptureComponentsModule {}
