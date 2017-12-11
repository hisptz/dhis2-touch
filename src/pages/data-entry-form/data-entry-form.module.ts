import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataEntryFormPage } from './data-entry-form';
import {SharedModule} from "../../components/shared.module";
import {DataEntryModule} from "../../components/data.entry.module";
import {Http} from "@angular/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";

@NgModule({
  declarations: [
    DataEntryFormPage,
  ],
  imports: [
    IonicPageModule.forChild(DataEntryFormPage),SharedModule,DataEntryModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
})
export class DataEntryFormPageModule {}
