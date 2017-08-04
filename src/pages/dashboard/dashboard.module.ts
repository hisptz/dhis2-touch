import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardPage } from './dashboard';
import {SharedModule} from "../../components/shared.module";
import {DashboardModule} from "../../components/dashboard.module";

@NgModule({
  declarations: [
    DashboardPage,
  ],
  imports: [
    SharedModule,DashboardModule,
    IonicPageModule.forChild(DashboardPage),
  ],
})
export class DashboardPageModule {}
