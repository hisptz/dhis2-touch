import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {SharedModule} from "../../components/shared.module";
import {DataValuesSyncContainerPage} from "./data-values-sync-container";
import {AboutModule} from "../../components/about.module";
import {Http} from "@angular/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
@NgModule({
  declarations: [
    DataValuesSyncContainerPage,
  ],
  imports: [
    IonicPageModule.forChild(DataValuesSyncContainerPage),SharedModule, AboutModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
})
export class DataValuesSyncPageModule {}
