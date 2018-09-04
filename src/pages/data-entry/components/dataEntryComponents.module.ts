import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { sharedComponentsModule } from '../../../components/sharedComponents.module';
import { CustomDataEntryFormComponent } from './custom-data-entry-form/custom-data-entry-form';
import { AggregateConflictHandlerComponent } from './aggregate-conflict-handler/aggregate-conflict-handler';
import { DataEntryPaginationComponent } from './data-entry-pagination/data-entry-pagination';
import { DefaultDataEntryFormComponent } from './default-data-entry-form/default-data-entry-form';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CustomDataEntryFormComponent,
    AggregateConflictHandlerComponent,
    DataEntryPaginationComponent,
    DefaultDataEntryFormComponent
  ],
  imports: [IonicModule, sharedComponentsModule, TranslateModule.forChild({})],
  exports: [
    CustomDataEntryFormComponent,
    AggregateConflictHandlerComponent,
    DataEntryPaginationComponent,
    DefaultDataEntryFormComponent
  ]
})
export class DataEntryComponentsModule {}
