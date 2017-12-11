import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataDimensionSelectionPage } from './data-dimension-selection';
import {SharedModule} from "../../components/shared.module";
import {Http} from "@angular/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";

@NgModule({
  declarations: [
    DataDimensionSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(DataDimensionSelectionPage),SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
})
export class DataDimensionSelectionPageModule {}
