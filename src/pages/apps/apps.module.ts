import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppsPage } from './apps';
import {Http} from "@angular/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";

@NgModule({
  declarations: [
    AppsPage,
  ],
  imports: [
    IonicPageModule.forChild(AppsPage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
  exports: [
    AppsPage
  ]
})
export class AppsPageModule {}
