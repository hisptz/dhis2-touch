import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataEntryPage } from './data-entry';
import {SharedModule} from "../../components/shared.module";
import {DataEntryModule} from "../../components/data.entry.module";

@NgModule({
  declarations: [
    DataEntryPage,
  ],
  imports: [
    IonicPageModule.forChild(DataEntryPage),SharedModule,DataEntryModule
  ],
})
export class DataEntryPageModule {}
