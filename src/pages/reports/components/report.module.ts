import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { DataSetReportComponent } from './data-set-report/data-set-report';
import { DataSetReportRowComponent } from './data-set-report-row/data-set-report-row';
import { sharedComponentsModule } from '../../../components/sharedComponents.module';
import { DataEntryComponentsModule } from '../../data-entry/components/dataEntryComponents.module';

@NgModule({
  declarations: [DataSetReportComponent, DataSetReportRowComponent],
  imports: [IonicModule, sharedComponentsModule, DataEntryComponentsModule],
  exports: [DataSetReportComponent, DataSetReportRowComponent]
})
export class ReportModule {}
