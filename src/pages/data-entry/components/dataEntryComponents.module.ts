import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SharedModule } from '../../../components/shared.module';
import { CustomDataEntryFormComponent } from './custom-data-entry-form/custom-data-entry-form';
import { AggregateConflictHandlerComponent } from './aggregate-conflict-handler/aggregate-conflict-handler';
@NgModule({
  declarations: [
    CustomDataEntryFormComponent,
    AggregateConflictHandlerComponent
  ],
  imports: [IonicModule, SharedModule],
  exports: [CustomDataEntryFormComponent, AggregateConflictHandlerComponent]
})
export class DataEntryComponentsModule {}
