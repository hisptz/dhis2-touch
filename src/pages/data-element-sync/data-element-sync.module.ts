import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {SharedModule} from "../../components/shared.module";
import {DataElementSyncPage} from "./data-element-sync";
import {AboutModule} from "../../components/about.module";
import {Http} from "@angular/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";

@NgModule({
  declarations: [
    DataElementSyncPage,
  ],
  imports: [
    IonicPageModule.forChild(DataElementSyncPage),SharedModule, AboutModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
})
export class DataElementSnycPageModule {}
