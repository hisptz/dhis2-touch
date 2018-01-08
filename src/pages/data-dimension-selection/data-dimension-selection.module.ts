import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataDimensionSelectionPage } from './data-dimension-selection';
import {SharedModule} from "../../components/shared.module";
import { TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    DataDimensionSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(DataDimensionSelectionPage),SharedModule,
    TranslateModule.forChild({})
  ],
})
export class DataDimensionSelectionPageModule {}
