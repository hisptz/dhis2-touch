import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataSetSelectionPage } from './data-set-selection';
import {SharedModule} from "../../components/shared.module";
import {DataEntryModule} from "../../components/data.entry.module";

@NgModule({
  declarations: [
    DataSetSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(DataSetSelectionPage),DataEntryModule,SharedModule
  ],
})
export class DataSetSelectionPageModule {}
