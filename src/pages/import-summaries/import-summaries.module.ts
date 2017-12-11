import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImportSummariesPage } from './import-summaries';
import {Http} from "@angular/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
@NgModule({
  declarations: [
    ImportSummariesPage,
  ],
  imports: [
    IonicPageModule.forChild(ImportSummariesPage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
})
export class ImportSummariesPageModule {}
