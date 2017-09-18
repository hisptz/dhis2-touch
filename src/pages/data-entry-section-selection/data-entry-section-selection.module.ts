import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataEntrySectionSelectionPage } from './data-entry-section-selection';
import {SharedModule} from "../../components/shared.module";

@NgModule({
  declarations: [
    DataEntrySectionSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(DataEntrySectionSelectionPage),SharedModule
  ],
})
export class DataEntrySectionSelectionPageModule {}
