import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { DashboardCardComponent } from './dashboard-card/dashboard-card';
import {ChartCardComponent} from "./chart-card/chart-card";
import {TableCardComponent} from "./table-card/table-card";
import {SharedModule} from "./shared.module";

@NgModule({
  declarations: [
    DashboardCardComponent,ChartCardComponent,
    TableCardComponent
  ],
  imports: [
    IonicModule,SharedModule
  ],
  exports: [DashboardCardComponent,ChartCardComponent,
    TableCardComponent ]
})

export class DashboardModule { }
