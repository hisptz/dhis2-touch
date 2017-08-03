import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardFilterPage } from './dashboard-filter';
import {SharedModule} from "../../components/shared.module";

@NgModule({
  declarations: [
    DashboardFilterPage,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(DashboardFilterPage),
  ],
  exports: [
    DashboardFilterPage
  ]
})
export class DashboardFilterPageModule {}
