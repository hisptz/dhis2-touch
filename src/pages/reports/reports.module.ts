import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportsPage } from './reports';
import {SharedModule} from "../../components/shared.module";
import { TranslateModule} from "@ngx-translate/core";
import {NgxPaginationModule} from 'ngx-pagination';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ReportsPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportsPage),SharedModule, NgxPaginationModule,PipesModule,
    TranslateModule.forChild({})
  ],
})
export class ReportsPageModule {}
