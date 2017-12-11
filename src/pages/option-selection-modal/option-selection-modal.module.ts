import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OptionSelectionModalPage } from './option-selection-modal';
import {Http} from "@angular/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
@NgModule({
  declarations: [
    OptionSelectionModalPage,
  ],
  imports: [
    IonicPageModule.forChild(OptionSelectionModalPage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
})
export class OptionSelectionModalPageModule {}
