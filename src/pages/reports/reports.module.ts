import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportsPage } from './reports';
import {SharedModule} from "../../components/shared.module";

@NgModule({
  declarations: [
    ReportsPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportsPage),SharedModule
  ],
})
export class ReportsPageModule {}
