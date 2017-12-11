import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {SharedModule} from "../../components/shared.module";
import {ProgramSelection} from "./program-selection";
import {Http} from "@angular/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";

@NgModule({
  declarations: [
    ProgramSelection,
  ],
  imports: [
    IonicPageModule.forChild(ProgramSelection),SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
})
export class ProgramPageModule {}
