import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardFilterPage } from './dashboard-filter';
import {SharedModule} from "../../components/shared.module";
import { TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    DashboardFilterPage,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(DashboardFilterPage),
    TranslateModule.forChild()
  ],
  exports: [
    DashboardFilterPage
  ]
})
export class DashboardFilterPageModule {}
