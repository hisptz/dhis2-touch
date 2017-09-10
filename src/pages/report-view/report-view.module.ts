import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportViewPage } from './report-view';
import {SharedModule} from "../../components/shared.module";

@NgModule({
  declarations: [
    ReportViewPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportViewPage),SharedModule
  ],
})
export class ReportViewPageModule {}
