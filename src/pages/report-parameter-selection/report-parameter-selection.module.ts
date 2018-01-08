import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportParameterSelectionPage } from './report-parameter-selection';
import {SharedModule} from "../../components/shared.module";
import { TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    ReportParameterSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportParameterSelectionPage),SharedModule,
    TranslateModule.forChild({})
  ],
})
export class ReportParameterSelectionPageModule {}
