import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportViewPage } from './report-view';
import {SharedModule} from "../../components/shared.module";
import { TranslateModule} from "@ngx-translate/core";
import {ReportModule} from "../../components/report.module";
@NgModule({
  declarations: [
    ReportViewPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportViewPage),SharedModule,
    ReportModule,
    TranslateModule.forChild({})
  ],
})
export class ReportViewPageModule {}
