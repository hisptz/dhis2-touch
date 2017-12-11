import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FullScreenDashboardPage } from './full-screen-dashboard';
import {SharedModule} from "../../components/shared.module";
import {DashboardModule} from "../../components/dashboard.module";
import {Http} from "@angular/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
@NgModule({
  declarations: [
    FullScreenDashboardPage,
  ],
  imports: [
    SharedModule,DashboardModule,
    IonicPageModule.forChild(FullScreenDashboardPage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
})
export class FullScreenDashboardPageModule {}
