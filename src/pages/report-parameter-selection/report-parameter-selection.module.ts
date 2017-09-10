import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportParameterSelectionPage } from './report-parameter-selection';
import {SharedModule} from "../../components/shared.module";

@NgModule({
  declarations: [
    ReportParameterSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportParameterSelectionPage),SharedModule
  ],
})
export class ReportParameterSelectionPageModule {}
