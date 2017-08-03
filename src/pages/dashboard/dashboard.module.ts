import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardPage } from './dashboard';
import {SharedModule} from "../../components/shared.module";

@NgModule({
  declarations: [
    DashboardPage,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(DashboardPage),
  ],
})
export class DashboardPageModule {}
