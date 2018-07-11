import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';


import { TranslateModule } from '@ngx-translate/core';
import { DashboardListFilterPage } from './dashboard-list-filter';
import { PipesModule } from '../../../../pipes/pipes.module';

@NgModule({
  declarations: [
    DashboardListFilterPage
  ],
  imports: [
    IonicPageModule.forChild(DashboardListFilterPage),
    TranslateModule.forChild(),
    PipesModule
  ]
})
export class DashboardListFilterPageModule {}
