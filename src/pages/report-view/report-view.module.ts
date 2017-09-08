import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportViewPage } from './report-view';

@NgModule({
  declarations: [
    ReportViewPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportViewPage),
  ],
})
export class ReportViewPageModule {}
