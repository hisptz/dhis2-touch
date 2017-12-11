import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardPage } from './dashboard';
import {SharedModule} from "../../components/shared.module";
import {DashboardModule} from "../../components/dashboard.module";
import {Http} from "@angular/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";

@NgModule({
  declarations: [
    DashboardPage
  ],
  imports: [
    SharedModule,DashboardModule,
    IonicPageModule.forChild(DashboardPage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
})
export class DashboardPageModule {}
