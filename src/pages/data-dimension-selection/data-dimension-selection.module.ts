import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataDimensionSelectionPage } from './data-dimension-selection';
import {SharedModule} from "../../components/shared.module";

@NgModule({
  declarations: [
    DataDimensionSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(DataDimensionSelectionPage),SharedModule
  ],
})
export class DataDimensionSelectionPageModule {}
