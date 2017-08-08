import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InteractiveDashboardPage } from './interactive-dashboard';
import {SharedModule} from "../../components/shared.module";
import {DashboardModule} from "../../components/dashboard.module";

@NgModule({
  declarations: [
    InteractiveDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(InteractiveDashboardPage),
    SharedModule,DashboardModule
  ],
})
export class InteractiveDashboardPageModule {}
