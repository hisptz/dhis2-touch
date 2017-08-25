import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PeriodSelectionPage } from './period-selection';
import {SharedModule} from "../../components/shared.module";
import {DataEntryModule} from "../../components/data.entry.module";

@NgModule({
  declarations: [
    PeriodSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(PeriodSelectionPage),DataEntryModule,SharedModule
  ],
})
export class PeriodSelectionPageModule {}
