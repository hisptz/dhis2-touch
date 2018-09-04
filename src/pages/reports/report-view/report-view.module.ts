import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportViewPage } from './report-view';
import { sharedComponentsModule } from '../../../components/sharedComponents.module';
import { TranslateModule } from '@ngx-translate/core';
import { ReportModule } from '../../../components/report.module';
@NgModule({
  declarations: [ReportViewPage],
  imports: [
    IonicPageModule.forChild(ReportViewPage),
    sharedComponentsModule,
    ReportModule,
    TranslateModule.forChild({})
  ]
})
export class ReportViewPageModule {}
