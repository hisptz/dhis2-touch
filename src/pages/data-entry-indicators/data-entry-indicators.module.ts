import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataEntryIndicatorsPage } from './data-entry-indicators';
import {Http} from "@angular/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";

@NgModule({
  declarations: [
    DataEntryIndicatorsPage,
  ],
  imports: [
    IonicPageModule.forChild(DataEntryIndicatorsPage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
})
export class DataEntryIndicatorsPageModule {}
