import {NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {DataSetReportComponent} from "./data-set-report/data-set-report";
import {SharedModule} from "./shared.module";
import {DataSetReportRowComponent} from "./data-set-report-row/data-set-report-row";

@NgModule({
  declarations: [DataSetReportComponent, DataSetReportRowComponent],
  imports: [
    IonicModule, SharedModule,
  ],
  exports: [DataSetReportComponent, DataSetReportRowComponent]
})

export class ReportModule {
}
