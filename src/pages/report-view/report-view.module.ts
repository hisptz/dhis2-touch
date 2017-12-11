import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportViewPage } from './report-view';
import {SharedModule} from "../../components/shared.module";
import {Http} from "@angular/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
@NgModule({
  declarations: [
    ReportViewPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportViewPage),SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
})
export class ReportViewPageModule {}
