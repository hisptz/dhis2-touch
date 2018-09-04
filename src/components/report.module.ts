import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { DataSetReportComponent } from './data-set-report/data-set-report';
import { DataSetReportRowComponent } from './data-set-report-row/data-set-report-row';
import { sharedComponentsModule } from './sharedComponents.module';

@NgModule({
  declarations: [DataSetReportComponent, DataSetReportRowComponent],
  imports: [IonicModule, sharedComponentsModule],
  exports: [DataSetReportComponent, DataSetReportRowComponent]
})
export class ReportModule {}
