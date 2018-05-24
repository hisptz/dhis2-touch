import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportsPage } from './reports';
import {SharedModule} from "../../components/shared.module";
import { TranslateModule} from "@ngx-translate/core";
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
  declarations: [
    ReportsPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportsPage),SharedModule, NgxPaginationModule,
    TranslateModule.forChild({})
  ],
})
export class ReportsPageModule {}
