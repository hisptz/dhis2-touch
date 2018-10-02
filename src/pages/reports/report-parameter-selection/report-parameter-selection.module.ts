import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportParameterSelectionPage } from './report-parameter-selection';
import { sharedComponentsModule } from '../../../components/sharedComponents.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ReportParameterSelectionPage],
  imports: [
    IonicPageModule.forChild(ReportParameterSelectionPage),
    sharedComponentsModule,
    TranslateModule.forChild({})
  ]
})
export class ReportParameterSelectionPageModule {}
