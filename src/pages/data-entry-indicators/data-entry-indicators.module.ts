import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataEntryIndicatorsPage } from './data-entry-indicators';

@NgModule({
  declarations: [
    DataEntryIndicatorsPage,
  ],
  imports: [
    IonicPageModule.forChild(DataEntryIndicatorsPage),
  ],
})
export class DataEntryIndicatorsPageModule {}
