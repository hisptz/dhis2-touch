import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FullScreenDashboardPage } from './full-screen-dashboard';
import { ChartModule } from '../../../modules/chart/chart.module';
import { TableModule } from '../../../modules/table/table.module';
import { MapModule } from '../../../modules/map/map.module';
import { SharedModule } from '../../../components/shared.module';
import { DashboardModule } from '../components/dashboard.module';
import { DictionaryModule } from '../../../modules/dictionary/dictionary.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [FullScreenDashboardPage],
  imports: [
    IonicPageModule.forChild(FullScreenDashboardPage),
    SharedModule,
    DashboardModule,
    TranslateModule.forChild()
  ]
})
export class FullScreenDashboardPageModule {}
