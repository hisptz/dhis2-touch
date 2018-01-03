import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataEntryPage } from './data-entry';
import {SharedModule} from "../../components/shared.module";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [
    DataEntryPage,
  ],
  imports: [
    IonicPageModule.forChild(DataEntryPage),SharedModule,
    TranslateModule.forChild({})
  ],
})
export class DataEntryPageModule {}
