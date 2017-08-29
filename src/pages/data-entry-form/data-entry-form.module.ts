import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataEntryFormPage } from './data-entry-form';
import {SharedModule} from "../../components/shared.module";

@NgModule({
  declarations: [
    DataEntryFormPage,
  ],
  imports: [
    IonicPageModule.forChild(DataEntryFormPage),SharedModule
  ],
})
export class DataEntryFormPageModule {}
