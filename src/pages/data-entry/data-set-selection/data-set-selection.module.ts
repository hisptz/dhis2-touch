import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataSetSelectionPage } from './data-set-selection';
import {SharedModule} from "../../../components/shared.module";
import {DataEntryModule} from "../../../components/data.entry.module";
import { TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    DataSetSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(DataSetSelectionPage),DataEntryModule,SharedModule,
    TranslateModule.forChild({})
  ],
})
export class DataSetSelectionPageModule {}
