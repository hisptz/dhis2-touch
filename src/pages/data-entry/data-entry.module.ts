import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataEntryPage } from './data-entry';

@NgModule({
  declarations: [
    DataEntryPage,
  ],
  imports: [
    IonicPageModule.forChild(DataEntryPage),
  ],
})
export class DataEntryPageModule {}
