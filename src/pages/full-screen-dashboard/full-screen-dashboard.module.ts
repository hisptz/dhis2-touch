import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FullScreenDashboardPage } from './full-screen-dashboard';
import {SharedModule} from "../../components/shared.module";
import {DashboardModule} from "../../components/dashboard.module";

@NgModule({
  declarations: [
    FullScreenDashboardPage,
  ],
  imports: [
    SharedModule,DashboardModule,
    IonicPageModule.forChild(FullScreenDashboardPage),
  ],
})
export class FullScreenDashboardPageModule {}
