import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportsPage } from './reports';
import {SharedModule} from "../../components/shared.module";
import { TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    ReportsPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportsPage),SharedModule,
    TranslateModule.forChild({})
  ],
})
export class ReportsPageModule {}
