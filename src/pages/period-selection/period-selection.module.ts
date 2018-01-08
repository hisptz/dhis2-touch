import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PeriodSelectionPage } from './period-selection';
import {SharedModule} from "../../components/shared.module";
import {DataEntryModule} from "../../components/data.entry.module";
import { TranslateModule} from "@ngx-translate/core";
@NgModule({
  declarations: [
    PeriodSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(PeriodSelectionPage),DataEntryModule,SharedModule,
    TranslateModule.forChild({})
  ],
})
export class PeriodSelectionPageModule {}
