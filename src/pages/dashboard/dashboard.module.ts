import { MapModule } from './../../modules/map/map.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardPage } from './dashboard';
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "../../components/share.module";
import { ChartModule } from '../../modules/chart/chart.module';
import { TableModule } from '../../modules/table/table.module';

@NgModule({
  declarations: [
    DashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardPage),
    ChartModule,
    TableModule,
    MapModule,
    SharedModule,
    TranslateModule.forChild()
  ],
})
export class DashboardPageModule { }
